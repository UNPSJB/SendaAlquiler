from django.db import models
from senda.core.models import SupplierModel, OfficeModel

from typing import List, TypedDict

class ProductTypeChoices(models.TextChoices):
    ALQUILABLE = "ALQUILABLE", "ALQUILABLE"
    COMERCIABLE = "COMERCIABLE", "COMERCIABLE"


class BrandModel(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name
    
ProductStockInOfficeModelDict = TypedDict(
    "ProductStockInOfficeModelDict", {"office_id":str, "stock":int}
)

ProductSupplierDict = TypedDict(
    "ProductSupplierDict", {"supplier_id":str, "price":str}
)

ProductServiceDict = TypedDict(
    "ProductServiceDict", {"service_id":str, "price":str}
)

class ProductModelManager(models.Manager["ProductModel"]):
    def create_product(
            self,
            sku:str,
            name:str,
            brand: BrandModel,
            description: str,
            type: ProductTypeChoices,
            price: str,
            stock: List[ProductStockInOfficeModelDict],
            services: List[ProductServiceDict], 
            suppliers: List[ProductSupplierDict], 
    ):
        if self.filter(sku=sku).exists():
            raise ValueError("Ya existe un producto con ese sku")
        
        return self.create(
            sku = sku,
            name = name,
            brand = brand,
            description = description,
            type = type,
            price = price,
            stock = stock,
            services = services,
            suppliers = suppliers,
        )
# falta update


class ProductModel(models.Model):
    sku = models.CharField(
        max_length=10, null=True, blank=True, unique=True, db_index=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.ForeignKey(
        BrandModel,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=50, choices=ProductTypeChoices.choices)
    price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return self.name

    def clean(self, *args, **kwargs):
        if not self.brand and self.type == ProductTypeChoices.COMERCIABLE:
            raise ValueError("Brand is required for COMERCIABLE products")

        return super().clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0), name="price_must_be_greater_than_0"
            ),
        ]
    objects: ProductModelManager = ProductModelManager()

class ProductStockInOfficeModel(models.Model):
    office = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="stock"
    )
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="stock"
    )
    stock = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["office", "product"], name="unique_stock")
        ]


class ProductSupplierModel(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="suppliers"
    )
    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="products"
    )
    price = models.DecimalField(decimal_places=2, max_digits=10)

