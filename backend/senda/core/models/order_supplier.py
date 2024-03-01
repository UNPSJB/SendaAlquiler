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

                    order_item = SupplierOrderLineItem(
                        supplier_order=supplier_order,
                        product=product,
                        quantity_ordered=item_data["quantity_ordered"],
                        product_price=product_supplier_relation.price,
                        total=total_item,
                    )
                    order_items.append(order_item)

                SupplierOrderLineItem.objects.bulk_create(order_items)

                # Actualizar el total de la orden
                supplier_order.update_totals()

                # Crear la entrada inicial en el historial
                supplier_order.set_status(
                    status=SupplierOrderHistoryStatusChoices.PENDING, user=user
                )

                return supplier_order
        except ValidationError as e:
            raise SupplierOrderCreationError(f"Validation failed: {e}")
        except Exception as e:
            raise SupplierOrderCreationError(f"Failed to create supplier order: {e}")


class SupplierOrder(TimeStampedModel):
    order_items: models.QuerySet["SupplierOrderLineItem"]
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

    def set_status(self, status: str, user: Optional["UserModel"] = None):
        history = SupplierOrderHistory.objects.create(
            user=user, supplier_order=self, status=status
        )
        self.latest_history_entry = history
        self.save()


class SupplierOrderLineItem(TimeStampedModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="related_supplier_orders"
    )
    supplier_order = models.ForeignKey(
        SupplierOrder, on_delete=models.CASCADE, related_name="order_items"
    )

    quantity_ordered = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)

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
    user = models.ForeignKey(
        UserModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supplier_order_histories",
    )

    status = models.CharField(
        max_length=20, choices=SupplierOrderHistoryStatusChoices.choices
    )

    objects = models.Manager()
