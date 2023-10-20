from django.db import models
from senda.core.models import OfficeModel, ProductModel


class InternalOrderModel(models.Model):
    office_branch = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="internal_orders_branch"
    )
    office_destination = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="internal_orders_destination",
    )
    date = models.DateTimeField()

    def __str__(self) -> str:
        return self.id


class InternalOrderProduct(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="internal_order"
    )
    stock = models.IntegerField(max_length=255)
    internal_order = models.ForeignKey(
        InternalOrderModel, on_delete=models.CASCADE, related_name="orders"
    )
