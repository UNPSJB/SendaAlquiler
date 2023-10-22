from django.db import models
from senda.core.models import SupplierModel, OfficeModel


class ProductTypeChoices(models.TextChoices):
    ALQUILABLE = "ALQUILABLE", "ALQUILABLE"
    COMERCIABLE = "COMERCIABLE", "COMERCIABLE"


class BrandModel(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


class ProductModel(models.Model):
    sku = models.CharField(max_length=10, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.ForeignKey(
        BrandModel, on_delete=models.CASCADE, related_name="products"
    )
    type = models.CharField(max_length=50, choices=ProductTypeChoices.choices)
    price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return self.name


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
