from decimal import Decimal
from typing import Any


from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from extensions.db.models import TimeStampedModel
from senda.core.managers import SupplierOrderManager
from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel
from senda.core.models.suppliers import SupplierModel


class SupplierOrderModel(TimeStampedModel):
    """
    Represents a supplier order in the Senda system. Inherits from TimeStampedModel for creation and modification timestamps.

    Attributes:
        orders (models.QuerySet["SupplierOrderProduct"]): A queryset for accessing the products associated with the supplier order.
        history (models.QuerySet["SupplierOrderHistoryModel"]): A queryset for accessing the order's history.
        supplier (models.ForeignKey): A foreign key to the SupplierModel, representing the supplier of the order.
        office_destination (models.ForeignKey): A foreign key to the OfficeModel, representing the destination office for the order.
        current_history (models.OneToOneField): A one-to-one relationship to the most current history item of the order.
        total (models.DecimalField): The total cost of the supplier order.
        objects (SupplierOrderManager): Custom manager providing additional functionalities.

    Methods:
        __str__: Returns the string representation of the order, which is its primary key.
        calculate_total: Calculates and returns the total cost of the order.
    """

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

    current_history = models.OneToOneField(
        "SupplierOrderHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True, null=True)

    objects: SupplierOrderManager = SupplierOrderManager()  # pyright: ignore

    def __str__(self) -> str:
        return str(self.pk)

    def calculate_total(self) -> Decimal:
        total = Decimal(0)
        for order in self.orders.all():
            total += order.total

        return total


class SupplierOrderProduct(TimeStampedModel):
    """
    Represents a product within a supplier order in the Senda system. Inherits from TimeStampedModel.

    Attributes:
        product (models.ForeignKey): A foreign key to ProductModel, representing the product in the order.
        price (models.DecimalField): The price of the product in the order.
        total (models.DecimalField): The total cost for this product in the order.
        quantity (models.PositiveIntegerField): The quantity of the product ordered.
        quantity_received (models.PositiveIntegerField): The quantity of the product that has been received.
        supplier_order (models.ForeignKey): A foreign key to SupplierOrderModel, linking it to the supplier order.

    Meta:
        Defines several constraints, including uniqueness of product per order and validation checks on quantities.

    Methods:
        __str__: Returns a string representation of the supplier order product, showing product name and quantity.
        save: Overridden save method to auto-calculate price and total if not provided.
    """

    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="related_supplier_orders"
    )

    quantity = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="orders"
    )
    price = models.DecimalField(decimal_places=2, max_digits=10, blank=True)
    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True)

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
    """
    Enum-like class representing status choices for supplier order history. Inherits from models.TextChoices.

    It provides a set of predefined status choices such as PENDING, IN_PROGRESS, COMPLETED, and CANCELED.
    """

    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class SupplierOrderHistoryModel(TimeStampedModel):
    """
    Represents the history of a supplier order, tracking its status changes. Inherits from TimeStampedModel.

    Attributes:
        status (models.CharField): The current status of the order, using choices from SupplierOrderHistoryStatusChoices.
        supplier_order (models.ForeignKey): A foreign key to SupplierOrderModel, linking to the related order.
        date (models.DateTimeField): The date and time of the status record.
        user (models.ForeignKey): A foreign key to UserModel, representing the user associated with the status change.
    """

    status = models.CharField(
        max_length=20, choices=SupplierOrderHistoryStatusChoices.choices
    )
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="history"
    )
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
    """
    Signal receiver that updates the current history of a SupplierOrderModel when a new SupplierOrderHistoryModel instance is created.

    Parameters:
        sender (SupplierOrderHistoryModel): The model class sending the signal.
        instance (SupplierOrderHistoryModel): The instance of the model that was saved.
        created (bool): A boolean flag indicating whether this instance is newly created.
        kwargs (Any): Additional keyword arguments.
    """
    if created:
        supplier_order = instance.supplier_order
        supplier_order.current_history = instance
        supplier_order.save()
