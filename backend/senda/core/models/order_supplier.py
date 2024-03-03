from datetime import datetime
from typing import List, Optional, TypedDict, Tuple

from django.db import models, transaction

from django.core.exceptions import ValidationError

from extensions.db.models import TimeStampedModel
from senda.core.models.offices import Office
from senda.core.models.products import Product, ProductSupplier
from senda.core.models.suppliers import SupplierModel
from users.models import UserModel


class SupplierOrderCreationError(Exception):
    """Excepción personalizada para errores de creación de orden de proveedor."""


class SupplierOrderDetailsDict(TypedDict):
    supplier_id: int
    target_office_id: int
    requested_for_date: Optional[datetime]
    approximate_delivery_date: Optional[datetime]
    note: Optional[str]


class SupplierOrderItemDetailsDict(TypedDict):
    product_id: int
    quantity_ordered: int


class SupplierOrderManager(models.Manager["SupplierOrder"]):
    def _validate_supplier_office_and_product(
        self, supplier_id: int, target_office_id: int, product_id: int
    ) -> Tuple[SupplierModel, Office, Product, ProductSupplier]:
        supplier = SupplierModel.objects.filter(id=supplier_id).first()
        if not supplier:
            raise ValidationError(f"Supplier with ID {supplier_id} not found.")

        target_office = Office.objects.filter(id=target_office_id).first()
        if not target_office:
            raise ValidationError(
                f"Target Office with ID {target_office_id} not found."
            )

        product = Product.objects.filter(id=product_id).first()
        if not product:
            raise ValidationError(f"Product with ID {product_id} not found.")

        product_supplier_relation = ProductSupplier.objects.filter(
            supplier=supplier, product=product
        ).first()
        if not product_supplier_relation:
            raise ValidationError(
                f"Product with ID {product_id} is not related to supplier with ID {supplier_id}."
            )

        return supplier, target_office, product, product_supplier_relation

    def create_supplier_order(
        self,
        order_data: SupplierOrderDetailsDict,
        items_data: List[SupplierOrderItemDetailsDict],
        user: Optional["UserModel"] = None,
    ) -> "SupplierOrder":
        try:
            with transaction.atomic():
                supplier_order = self.create(
                    supplier_id=order_data["supplier_id"],
                    target_office_id=order_data["target_office_id"],
                    requested_for_date=order_data["requested_for_date"],
                    approximate_delivery_date=order_data.get(
                        "approximate_delivery_date"
                    ),
                )

                order_items = []

                for item_data in items_data:
                    supplier, office, product, product_supplier_relation = (
                        self._validate_supplier_office_and_product(
                            order_data["supplier_id"],
                            order_data["target_office_id"],
                            item_data["product_id"],
                        )
                    )

                    total_item = (
                        item_data["quantity_ordered"] * product_supplier_relation.price
                    )

                    order_item = SupplierOrderItem(
                        supplier_order=supplier_order,
                        product=product,
                        quantity_ordered=item_data["quantity_ordered"],
                        product_price=product_supplier_relation.price,
                        total=total_item,
                    )
                    order_items.append(order_item)

                SupplierOrderItem.objects.bulk_create(order_items)

                # Actualizar el total de la orden
                supplier_order.update_totals()

                # Crear la entrada inicial en el historial
                supplier_order.set_status(
                    status=SupplierOrderHistoryStatusChoices.PENDING, responsible_user=user
                )

                return supplier_order
        except ValidationError as e:
            raise SupplierOrderCreationError(f"Validation failed: {e}")
        except Exception as e:
            raise SupplierOrderCreationError(f"Failed to create supplier order: {e}")


class CompletedOrderItemDetailsDict(TypedDict):
    item_id: int
    quantity_received: int


class SupplierOrder(TimeStampedModel):
    order_items: models.QuerySet["SupplierOrderItem"]
    history_entries: models.QuerySet["SupplierOrderHistory"]

    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="outgoing_supplier_orders"
    )
    target_office = models.ForeignKey(
        Office,
        on_delete=models.CASCADE,
        related_name="incoming_supplier_orders",
    )

    requested_for_date = models.DateField(blank=True, null=True)
    approximate_delivery_date = models.DateField(blank=True, null=True)

    latest_history_entry = models.OneToOneField(
        "SupplierOrderHistory",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    total = models.PositiveBigIntegerField(default=0)

    objects: SupplierOrderManager = SupplierOrderManager()

    def __str__(self) -> str:
        return str(self.pk)

    def update_totals(self):
        self.total = self.order_items.aggregate(models.Sum("total"))["total__sum"]
        self.save()

    def set_status(
        self,
        status: str,
        responsible_user: Optional["UserModel"] = None,
        note: str = None,
        completed_order_items: Optional[List[CompletedOrderItemDetailsDict]] = None,
    ) -> "SupplierOrderHistory":
        if self.latest_history_entry:
            if (
                self.latest_history_entry.status
                == SupplierOrderHistoryStatusChoices.COMPLETED
            ):
                raise ValidationError("Cannot change status of a completed order.")

            if status == self.latest_history_entry.status:
                raise ValidationError(f"Order is already in {status} status.")

            if status == SupplierOrderHistoryStatusChoices.PENDING:
                raise ValidationError("Cannot set status to PENDING.")

        if status == SupplierOrderHistoryStatusChoices.COMPLETED:
            if not completed_order_items:
                raise ValidationError("Completed orders must have completed items.")

            for item in self.order_items.all():
                completed_order_item_details_dict: Optional[
                    CompletedOrderItemDetailsDict
                ] = None
                for completed_item_dict in completed_order_items:
                    if completed_item_dict["item_id"] == item.pk:
                        completed_order_item_details_dict = completed_item_dict
                        break

                if not completed_order_item_details_dict:
                    raise ValidationError(
                        f"Item {item.pk} not found in completed_order_items."
                    )

                if (
                    completed_order_item_details_dict["quantity_received"]
                    > item.quantity_ordered
                ):
                    raise ValidationError(
                        f"Quantity received for item {item.pk} must be less than or equal to quantity ordered."
                    )

                if completed_order_item_details_dict["quantity_received"] < 0:
                    raise ValidationError(
                        f"Quantity received for item {item.pk} must be positive."
                    )

                item.target_office_quantity_before_receive = (
                    item.product.get_stock_for_office(office_id=self.target_office.pk)
                    or 0
                )
                item.product.increase_stock_in_office(
                    office_id=self.target_office.pk,
                    quantity=completed_order_item_details_dict["quantity_received"],
                )
                item.target_office_quantity_after_receive = (
                    item.product.get_stock_for_office(office_id=self.target_office.pk)
                )

                item.quantity_received = completed_order_item_details_dict[
                    "quantity_received"
                ]
                item.save()

        history = SupplierOrderHistory.objects.create(
            status=status,
            supplier_order=self,
            responsible_user=responsible_user,
            note=note,
        )
        self.latest_history_entry = history
        self.save()

        return history


class SupplierOrderItem(TimeStampedModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="related_supplier_orders"
    )
    supplier_order = models.ForeignKey(
        SupplierOrder, on_delete=models.CASCADE, related_name="order_items"
    )

    quantity_ordered = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)

    target_office_quantity_before_receive = models.PositiveIntegerField(default=0)
    target_office_quantity_after_receive = models.PositiveIntegerField(default=0)

    product_price = models.PositiveBigIntegerField(blank=True)
    total = models.PositiveBigIntegerField(blank=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.product.name} - Qty: {self.quantity_ordered}"

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["product", "supplier_order"],
                name="order_supplier_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="order_supplier_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity_ordered")),
                name="order_supplier_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class SupplierOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class SupplierOrderHistory(TimeStampedModel):
    supplier_order = models.ForeignKey(
        SupplierOrder, on_delete=models.CASCADE, related_name="history_entries"
    )
    responsible_user = models.ForeignKey(
        UserModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supplier_order_histories",
    )

    status = models.CharField(
        max_length=20, choices=SupplierOrderHistoryStatusChoices.choices
    )

    note = models.TextField(blank=True, null=True)

    objects = models.Manager()
