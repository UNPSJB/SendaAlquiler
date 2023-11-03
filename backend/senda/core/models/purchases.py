from typing import List, TypedDict

from django.core.exceptions import ValidationError
from django.db import models, transaction

from extensions.db.models import TimeStampedModel

from .clients import ClientModel
from .offices import OfficeModel
from .products import ProductModel, ProductTypeChoices


def calculate_purchase_total(purchase: "PurchaseModel"):
    total = sum([item.quantity * item.price for item in purchase.purchase_items.all()])
    return total


PurchaseProductsItemDict = TypedDict("Products", {"id": str, "quantity": int})


class PurchaseProductManager(models.Manager["PurchaseModel"]):
    @transaction.atomic
    def create_Purchase_Product(
        self,
        client: ClientModel,
        products: List[PurchaseProductsItemDict],
        office: OfficeModel,
    ):
        purchase = self.create(
            client=client,
            office=office,
        )

        for product in products:
            PurchaseItemModel.objects.create(
                quantity=product["quantity"],
                product_id=product["id"],
                purchase_Products=purchase,
            )


class PurchaseModel(TimeStampedModel):
    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="purchases"
    )
    purchase_items: models.QuerySet["PurchaseItemModel"]

    def __str__(self) -> str:
        return f"{self.date} - {self.total}"

    @transaction.atomic
    def save(self, *args, **kwargs):
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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "purchase"], name="unique_purchase_product_item"
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=1),
                name="purchase_product_item_quantity_must_be_greater_than_0",
            ),
        ]

    def clean(self):
        if self.product.type != ProductTypeChoices.COMERCIABLE:
            raise ValidationError(
                "No se puede agregar un producto que no sea Comerciable a una venta en sucursal"
            )

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.price

        super().save(*args, **kwargs)
