from typing import TypedDict, List, Optional

from django.db import models, transaction

from extensions.db.models import TimeStampedModel
from senda.core.models.offices import Office
from senda.core.models.products import Product

from django.core.exceptions import ValidationError
from users.models import UserModel

from datetime import datetime


class InternalOrderCreationError(Exception):
    """Custom exception for internal order creation errors."""


class InternalOrderDetailsDict(TypedDict):
    source_office_id: int
    target_office_id: int
    contract_item_product_allocation_id: Optional[int]
    note: Optional[str]
    requested_for_date: datetime
    approximate_delivery_date: Optional[datetime]


class InternalOrderItemDetailsDict(TypedDict):
    product_id: int
    quantity_ordered: int


class InternalOrderManager(models.Manager["InternalOrder"]):
    def _validate_office_and_product(self, source_office_id: int, product_id: int):
        office = Office.objects.filter(id=source_office_id).first()
        if not office:
            raise ValidationError(
                f"Source Office with ID {source_office_id} not found."
            )

        product = Product.objects.filter(id=product_id).first()
        if not product:
            raise ValidationError(f"Product with ID {product_id} not found.")

        return office, product

    def create_internal_order(
        self,
        order_data: InternalOrderDetailsDict,
        items_data: List[InternalOrderItemDetailsDict],
        responsible_user: Optional["UserModel"] = None,
    ) -> "InternalOrder":
        try:
            with transaction.atomic():
                internal_order = self.create(
                    source_office_id=order_data.get("source_office_id"),
                    target_office_id=order_data.get("target_office_id"),
                    contract_item_product_allocation_id=order_data.get(
                        "contract_item_product_allocation_id"
                    ),
                    requested_for_date=order_data.get("requested_for_date"),
                    approximate_delivery_date=order_data.get(
                        "approximate_delivery_date"
                    ),
                )

                order_items = []

                for item_data in items_data:
                    _, product = self._validate_office_and_product(
                        order_data.get("source_office_id"), item_data.get("product_id")
                    )

                    order_item = InternalOrderLineItem(
                        internal_order=internal_order,
                        product=product,
                        quantity_ordered=item_data.get("quantity_ordered"),
                    )
                    order_items.append(order_item)

                InternalOrderLineItem.objects.bulk_create(order_items)

                internal_order.set_status(
                    InternalOrderHistoryStatusChoices.PENDING,
                    responsible_user,
                    order_data.get("note"),
                )

                return internal_order
        except ValidationError as e:
            raise InternalOrderCreationError(f"Validation failed: {e}")
        except Exception as e:
            raise InternalOrderCreationError(f"Failed to create internal order: {e}")


class CompletedOrderItemDetailsDict(TypedDict):
    item_id: int
    quantity_received: int


class InternalOrder(TimeStampedModel):
    history_entries: models.QuerySet["InternalOrderHistory"]
    order_items: models.QuerySet["InternalOrderLineItem"]

    source_office = models.ForeignKey(
        Office,
        on_delete=models.CASCADE,
        related_name="outgoing_internal_orders",
    )
    target_office = models.ForeignKey(
        Office,
        on_delete=models.CASCADE,
        related_name="incoming_internal_orders",
    )

    requested_for_date = models.DateField(blank=True, null=True)
    approximate_delivery_date = models.DateField(blank=True, null=True)

    latest_history_entry = models.OneToOneField(
        "InternalOrderHistory",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    contract_item_product_allocation = models.OneToOneField(
        "ContractItemProductAllocation",
        related_name="internal_order",
        on_delete=models.CASCADE,
        null=True,
    )

    objects: InternalOrderManager = InternalOrderManager()

    def __str__(self) -> str:
        return str(self.pk)

    def set_status(
        self,
        status: str,
        responsible_user: UserModel,
        note: Optional[str],
        completed_order_items: Optional[List[CompletedOrderItemDetailsDict]] = None,
    ) -> "InternalOrderHistory":
        if self.latest_history_entry:
            if (
                self.latest_history_entry.status
                == InternalOrderHistoryStatusChoices.COMPLETED
            ):
                raise ValidationError("Cannot change status of a completed order.")

            if status == self.latest_history_entry.status:
                raise ValidationError(f"Order is already in {status} status.")

            if status == InternalOrderHistoryStatusChoices.PENDING:
                raise ValidationError("Cannot set status to PENDING.")

        if status == InternalOrderHistoryStatusChoices.COMPLETED:
            if not completed_order_items:
                raise ValidationError("Completed orders must have completed items.")

            for item in self.order_items.all():
                order_item_details_dict: Optional[CompletedOrderItemDetailsDict] = None
                for item_dict in completed_order_items:
                    if item_dict["item_id"] == item.pk:
                        order_item_details_dict = item_dict
                        break

                if not order_item_details_dict:
                    raise ValidationError(
                        f"Item {item.pk} not found in completed_order_items."
                    )

                if order_item_details_dict["quantity_received"] < 0:
                    raise ValidationError(
                        f"Quantity received for item {item.pk} must be positive."
                    )

                if order_item_details_dict["quantity_received"] > item.quantity_ordered:
                    raise ValidationError(
                        f"Quantity received for item {item.pk} must be less than or equal to quantity ordered."
                    )

                item.quantity_received = order_item_details_dict["quantity_received"]
                item.save()

        history = InternalOrderHistory.objects.create(
            status=status,
            internal_order=self,
            responsible_user=responsible_user,
            note=note,
        )
        self.latest_history_entry = history
        self.save()

        return history


class InternalOrderLineItem(TimeStampedModel):
    internal_order = models.ForeignKey(
        InternalOrder, on_delete=models.CASCADE, related_name="order_items"
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="internal_orders"
    )

    quantity_ordered = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.product.name} - Qty: {self.quantity_ordered}"

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["product", "internal_order"],
                name="internal_order_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="internal_order_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity_ordered")),
                name="internal_order_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class InternalOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class InternalOrderHistory(TimeStampedModel):
    status = models.CharField(
        max_length=20, choices=InternalOrderHistoryStatusChoices.choices
    )
    internal_order = models.ForeignKey(
        InternalOrder, on_delete=models.CASCADE, related_name="history_entries"
    )
    responsible_user = models.ForeignKey(
        UserModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="internal_order_histories",
    )
    note = models.TextField(blank=True, null=True)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.internal_order} - {self.status}"
