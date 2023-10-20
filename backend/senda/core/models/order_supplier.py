from django.db import models
from senda.core.models import SupplierModel, OfficeModel, ProductModel


class OrderSupplierModel(models.Model):
    office = models.ForeignKey(OfficeModel, on_delete=models.CASCADE)
    supplier = models.ForeignKey(SupplierModel, on_delete=models.CASCADE)
    date = models.DateTimeField()
    price = models.FloatField(null=True, blank=True)

    def __str__(self) -> str:
        return self.id


class SupplierOrderProduct(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="supplier_order"
    )
    cant = models.IntegerField(max_length=255)
    supplier_order = models.ForeignKey(
        OrderSupplierModel, on_delete=models.CASCADE, related_name="orders"
    )
