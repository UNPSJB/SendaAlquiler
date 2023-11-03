from django.db import models

from extensions.db.models import TimeStampedModel

from .products import ProductModel


class ServiceModel(TimeStampedModel):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="services"
    )

    name = models.CharField(max_length=100)
    price = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return f"{self.product} - {self.name}"

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "name"], name="unique_service_name_by_product"
            ),
            models.CheckConstraint(check=models.Q(price__gte=0), name="price_gte_0"),
        ]
