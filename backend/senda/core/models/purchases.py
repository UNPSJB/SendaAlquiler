from typing import Any
from django.db.models.signals import pre_save
from django.dispatch import receiver

from django.core.exceptions import ValidationError
from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import PurchaseModelManager

from .clients import ClientModel
from .products import ProductModel, ProductTypeChoices


class PurchaseModel(TimeStampedModel):
    """
    Represents a purchase in the Senda system. Inherits from TimeStampedModel for creation and modification timestamps.

    Attributes:
        purchase_items (models.QuerySet["PurchaseItemModel"]): A queryset for accessing the items included in the purchase.
        date (models.DateTimeField): The date and time when the purchase was made.
        total (models.DecimalField): The total cost of the purchase.
        office (models.ForeignKey): A foreign key to OfficeModel, linking to the office where the purchase was made and from where we should subtract the stock.
        client (models.ForeignKey): A foreign key to ClientModel, linking to the client who made the purchase.

    Methods:
        __str__: Returns a string representation of the purchase, showing the date and total cost.
        recalculate_total: Recalculates the total cost of the purchase based on its items.

    objects (PurchaseModelManager): Custom manager providing additional functionalities.
    """

    purchase_items: models.QuerySet["PurchaseItemModel"]

    total = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="purchases"
    )

    office = models.ForeignKey(
        "OfficeModel", on_delete=models.CASCADE, related_name="purchases"
    )

    objects: PurchaseModelManager = PurchaseModelManager()  # pyright: ignore

    def __str__(self) -> str:
        return f"{self.created_on} - {self.total}"

    def recalculate_total(self) -> None:
        self.total = self.purchase_items.aggregate(
            total=models.Sum(models.F("price") * models.F("quantity"))
        )["total"]
        self.save()


class PurchaseItemModel(TimeStampedModel):
    """
    Represents an item in a purchase. Inherits from TimeStampedModel.

    Attributes:
        product (models.ForeignKey): A foreign key to ProductModel, linking to the product purchased.
        purchase (models.ForeignKey): A foreign key to PurchaseModel, linking to the purchase the item belongs to.
        quantity (models.IntegerField): The quantity of the product purchased.
        price (models.DecimalField): The price of the product at the time of purchase.
        total (models.DecimalField): The total cost for this product in the purchase.

    Meta:
        Defines constraints, including uniqueness of product per purchase and validation check on quantity.

    Methods:
        clean: Custom validation logic to ensure the product is commerciable.
        __str__: Returns a string representation of the purchase item, showing product name and quantity.
        save: Overridden save method to include custom logic for setting price and total.
    """

    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    purchase = models.ForeignKey(
        PurchaseModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    quantity = models.IntegerField()
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    total = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["product", "purchase"], name="unique_purchase_product_item"
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=1),
                name="purchase_product_item_quantity_must_be_greater_than_0",
            ),
        ]

    def clean(self) -> None:
        if self.product.type != ProductTypeChoices.COMERCIABLE:
            raise ValidationError(
                "No se puede agregar un producto que no sea Comerciable a una venta en sucursal"
            )

        stock_in_office = self.product.get_stock_for_office(self.purchase.office)
        if stock_in_office is None:
            raise ValidationError(
                "No se puede agregar un producto que no esté en stock en una sucursal"
            )

        if stock_in_office.stock < self.quantity:
            raise ValidationError(
                "No se puede agregar un producto con stock menor al solicitado a en una venta"
            )

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.price and self.product.price:
            self.price = self.product.price

        self.clean()
        super().save(*args, **kwargs)


@receiver(pre_save, sender=PurchaseItemModel)
def update_purchase_total(
    sender: Any, instance: PurchaseItemModel, **kwargs: Any
) -> None:
    """
    Signal receiver that updates the total field of a PurchaseItemModel instance and recalculates the total cost of the associated PurchaseModel.

    Parameters:
        sender (Any): The model class sending the signal.
        instance (PurchaseItemModel): The instance of the model that was saved.
        kwargs (Any): Additional keyword arguments.
    """
    if not instance.pk:
        stock_in_office = instance.product.get_stock_for_office(
            instance.purchase.office
        )
        if stock_in_office is None:
            raise ValidationError(
                "No se puede agregar un producto que no esté en stock en una sucursal"
            )

        if stock_in_office.stock < instance.quantity:
            raise ValidationError(
                "No se puede agregar un producto con stock menor al solicitado en una venta"
            )

        stock_in_office.reduce_stock(instance.quantity)

    new_total = instance.quantity * instance.price
    if instance.total != new_total:
        instance.total = new_total
        instance.purchase.recalculate_total()
