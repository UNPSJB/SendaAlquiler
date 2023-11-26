from typing import Any

from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from extensions.db.models import TimeStampedModel
from senda.core.managers import InternalOrderManager
from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel


class InternalOrderModel(TimeStampedModel):
    """
    Represents an internal order within the Senda system. Inherits from TimeStampedModel for timestamps.

    Attributes:
        history (models.QuerySet["InternalOrderHistoryModel"]): A queryset for accessing the order's history.
        orders (models.QuerySet["InternalOrderProduct"]): A queryset for accessing the products associated with the order.
        office_branch (models.ForeignKey): A foreign key to the OfficeModel, representing the branch office where the order originated.
        office_destination (models.ForeignKey): A foreign key to the OfficeModel, representing the destination office for the order.
        date_created (models.DateTimeField): The date and time when the order was created.
        current_history (models.OneToOneField): A one-to-one relationship to the most current history item of the order.
        objects (InternalOrderManager): Custom manager for additional functionalities.

    Methods:
        __str__: Returns the string representation of the order, which is its primary key.
    """

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
    """
    Represents a product within an internal order in the Senda system. Inherits from TimeStampedModel.

    Attributes:
        product (models.ForeignKey): A foreign key to ProductModel, representing the product in the order.
        quantity (models.PositiveIntegerField): The quantity of the product ordered.
        quantity_received (models.PositiveIntegerField): The quantity of the product that has been received.
        internal_order (models.ForeignKey): A foreign key to InternalOrderModel, linking it to the internal order.

    Meta:
        Defines several constraints, including uniqueness of product per order and validation checks on quantities.

    Methods:
        __str__: Returns a string representation of the internal order product, showing product name and quantity.
    """

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
    """
    Enum-like class representing status choices for internal order history. Inherits from models.TextChoices.

    It provides a set of predefined status choices such as PENDING, IN_PROGRESS, COMPLETED, and CANCELED.
    """

    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class InternalOrderHistoryModel(TimeStampedModel):
    """
    Represents the history of an internal order, tracking its status changes. Inherits from TimeStampedModel.

    Attributes:
        status (models.CharField): The current status of the order, using choices from InternalOrderHistoryStatusChoices.
        internal_order (models.ForeignKey): A foreign key to InternalOrderModel, linking to the related order.
        date (models.DateTimeField): The date and time of the status record.
        user (models.ForeignKey): A foreign key to UserModel, representing the user associated with the status change.
    """

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
    """
    Signal receiver that updates the current history of an InternalOrderModel when a new InternalOrderHistoryModel instance is created.

    Parameters:
        sender (InternalOrderHistoryModel): The model class sending the signal.
        instance (InternalOrderHistoryModel): The instance of the model that was saved.
        created (bool): A boolean flag indicating whether this instance is newly created.
        kwargs (Any): Additional keyword arguments.
    """
    if created:
        internal_order = instance.internal_order
        internal_order.current_history = instance
        internal_order.save()
