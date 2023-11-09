from decimal import Decimal
from typing import Any, Optional


from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from extensions.db.models import TimeStampedModel
from senda.core.managers import SupplierOrderManager
from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel
from senda.core.models.suppliers import SupplierModel


class SupplierOrderModel(TimeStampedModel):
    orders: models.QuerySet["SupplierOrderProduct"]
    history: models.QuerySet["SupplierOrderHistoryModel"]

    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="supplier_orders_branch"
    )
    office_destination = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="supplier_orders_destination",
    )
    date_created = models.DateTimeField(auto_now_add=True)

    current_history: models.OneToOneField[
        "SupplierOrderHistoryModel" | models.Combinable | None,
        "SupplierOrderHistoryModel" | None,
    ] = models.OneToOneField(
        "SupplierOrderHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True)

    objects: SupplierOrderManager = SupplierOrderManager()  # pyright: ignore

    def __str__(self) -> str:
        return str(self.pk)

    def calculate_total(self) -> Decimal:
        total = Decimal(0)
        for order in self.orders.all():
            total += order.total

        return total


class SupplierOrderProduct(TimeStampedModel):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="related_supplier_orders"
    )
    price = models.DecimalField(decimal_places=2, max_digits=10, blank=True)
    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True)

    quantity = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="orders"
    )

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.price and self.product.price:
            self.price = self.product.price

        if not self.total:
            self.total = self.price * self.quantity

        super().save(*args, **kwargs)

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["product", "supplier_order"],
                name="order_supplier_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=0),
                name="order_supplier_quantity_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="order_supplier_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity")),
                name="order_supplier_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class SupplierOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class SupplierOrderHistoryModel(TimeStampedModel):
    status = models.CharField(
        max_length=20, choices=SupplierOrderHistoryStatusChoices.choices
    )
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )


@receiver(post_save, sender=SupplierOrderHistoryModel)
def update_current_history(
    sender: SupplierOrderHistoryModel,
    instance: SupplierOrderHistoryModel,
    created: bool,
    **kwargs: Any,
) -> None:
    if created:
        supplier_order = instance.supplier_order
        supplier_order.current_history = instance
        supplier_order.save()
