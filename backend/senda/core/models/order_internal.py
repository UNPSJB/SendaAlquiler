from typing import Any

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from extensions.db.models import TimeStampedModel
from senda.core.managers import InternalOrderManager
from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel


class InternalOrderModel(TimeStampedModel):
    history: models.QuerySet["InternalOrderHistoryModel"]
    orders: models.QuerySet["InternalOrderProduct"]

    office_branch = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="internal_orders_branch"
    )
    office_destination = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="internal_orders_destination",
    )
    date_created = models.DateTimeField(auto_now_add=True)

    current_history = models.OneToOneField(
        "InternalOrderHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    objects: InternalOrderManager = InternalOrderManager()  # pyright: ignore

    def __str__(self) -> str:
        return str(self.pk)


class InternalOrderProduct(TimeStampedModel):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="related_orders"
    )

    quantity = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)

    internal_order = models.ForeignKey(
        InternalOrderModel, on_delete=models.CASCADE, related_name="orders"
    )

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["product", "internal_order"],
                name="internal_order_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=0),
                name="internal_order_quantity_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="internal_order_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity")),
                name="internal_order_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class InternalOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class InternalOrderHistoryModel(TimeStampedModel):
    status = models.CharField(
        max_length=20, choices=InternalOrderHistoryStatusChoices.choices
    )
    internal_order = models.ForeignKey(
        InternalOrderModel, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )


@receiver(post_save, sender=InternalOrderHistoryModel)
def update_current_history(
    sender: InternalOrderHistoryModel,
    instance: InternalOrderHistoryModel,
    created: bool,
    **kwargs: Any,
) -> None:
    if created:
        internal_order = instance.internal_order
        internal_order.current_history = instance
        internal_order.save()
