from typing import List, Optional, TypedDict

from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .clients import ClientModel
from .localities import LocalityModel
from .offices import OfficeModel
from .products import ProductModel, ProductTypeChoices

PurchaseProductsItemDict = TypedDict(
    "Products", {"id": str, "quantity": int, "service": None}
)

class PurchaseProductManager(models.Manager["PurchaseProductModel"]):
    @transaction.atomic
    def create_Purchase_Product(
        self,
        client: ClientModel,
        products: List[PurchaseProductsItemDict],
        office: OfficeModel,
        locality: LocalityModel,
        house_number: str,
        street_number: str,
        house_unit: str,
    ):
        purchase_Products = self.create(
            client=client,
            office=office,
            locality=locality,
            house_number=house_number,
            street_number=street_number,
            house_unit=house_unit,
        )

        for product in products:
            PurchaseProductItemModel.objects.create(
                quantity=product["quantity"],
                product_id=product["id"],
                purchase_Products=purchase_Products,
            )

        PurchaseProductsHistoryModel.objects.create(
            purchase_Products=purchase_Products,
        )
    
class PurchaseProductModel(TimeStampedModel):
    purchase_product_items: models.QuerySet["PurchaseProductItemModel"]

    office = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="purchase_products",
    )
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="purchase_products"
    )
    current_history: "PurchaseProductsHistoryModel" = models.OneToOneField(
        "PurchaseProductsHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_purchase_product",
        blank=True,
        null=True,
    )
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    date_purchase = models.DateTimeField(auto_now_add=True)

    locality = models.ForeignKey(
        LocalityModel, on_delete=models.CASCADE, related_name="purchase_products"
    )
    house_number = models.CharField(
        max_length=10, help_text="Número de la calle donde vive el cliente"
    )
    street_name = models.CharField(
        max_length=255, help_text="Nombre de la calle donde vive el cliente"
    )
    house_unit = models.CharField(
        max_length=10,
        help_text="Número de la casa o departamento",
        blank=True,
        null=True,
    )

    objects: PurchaseProductManager = PurchaseProductManager()

    def __str__(self) -> str:
        return self.client.email

    class Meta:
        verbose_name = "Purchase Products"
        verbose_name_plural = "Purchase Products"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
    
    def calculate_total(self):
        total = 0
        for item in self.purchase_product_items.all():
            total += item.total

        return total
    
class PurchaseProductItemModel(TimeStampedModel):
    purchase_products = models.ForeignKey(
        PurchaseProductModel,
        on_delete=models.CASCADE,
        related_name="purchase_products_items",
    )
    product = models.ForeignKey(
        ProductModel,
        on_delete=models.CASCADE,
        related_name="purchase_products_items",
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return f"{self.purchase_products} - {self.product}"

    class Meta:
        verbose_name = "Purchase Products Item"
        verbose_name_plural = "Purchase Products Items"
        constraints = [
            models.UniqueConstraint(
                fields=["purchase_products", "product"],
                name="unique_purchase_product_item",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=1), name="quantity_must_be_greater_than_0"
            ),
        ]
    

        
    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.price

        if not self.total:
            self.total = self.price * self.quantity

        self.clean()

        super().save(*args, **kwargs)
    

class PurchaseProductsHistoryModel(TimeStampedModel):
    rental_contract = models.ForeignKey(
        PurchaseProductModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_history",
    )

    def __str__(self) -> str:
        return f"{self.purchase_products}"
    
    class Meta:
        verbose_name = "Purchase Products History"
        verbose_name_plural = "Purchase products Histories"