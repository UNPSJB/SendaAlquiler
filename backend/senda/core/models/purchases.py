from decimal import Decimal
from typing import Any

from django.core.exceptions import ValidationError
from django.db import models, transaction

from extensions.db.models import TimeStampedModel
from senda.core.managers import PurchaseModelManager

from .clients import ClientModel
from .products import ProductModel, ProductTypeChoices


def calculate_purchase_total(purchase: "PurchaseModel") -> Decimal:
    total = sum([item.quantity * item.price for item in purchase.purchase_items.all()])
    return Decimal(total)


class PurchaseModel(TimeStampedModel):
    purchase_items: models.QuerySet["PurchaseItemModel"]

    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="purchases"
    )

    objects: PurchaseModelManager = PurchaseModelManager()  # pyright: ignore

    def __str__(self) -> str:
        return f"{self.date} - {self.total}"

    @transaction.atomic
    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.total:
            self.total = calculate_purchase_total(self)

        super().save(*args, **kwargs)


class PurchaseItemModel(TimeStampedModel):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    purchase = models.ForeignKey(
        PurchaseModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    quantity = models.IntegerField()
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)

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

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.price and self.product.price:
            self.price = self.product.price

        super().save(*args, **kwargs)
