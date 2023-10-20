from django.db import models
from senda.core.models import OfficeModel, ProductModel
from users.models import UserModel

from typing import TypedDict, List

InternalOrderProductsDict = TypedDict("Products", {"id": str, "quantity": int})


class InternalOrderManager(models.Manager):
    def create_internal_order(
        self,
        office_branch: OfficeModel,
        office_destination: OfficeModel,
        user: UserModel,
        products: List[InternalOrderProductsDict],
    ):
        internal_order = self.create(
            office_branch=office_branch, office_destination=office_destination
        )

        InternalOrderHistoryModel.objects.create(
            status=InternalOrderHistoryStatusChoices.PENDING,
            internal_order=internal_order,
            user=user,
        )

        for product in products:
            InternalOrderProduct.objects.create(
                product_id=product["id"],
                quantity=product["quantity"],
                internal_order=internal_order,
            )

        return internal_order


class InternalOrderModel(models.Model):
    office_branch = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="internal_orders_branch"
    )
    office_destination = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="internal_orders_destination",
    )
    date_created = models.DateTimeField(auto_now_add=True)

    current_history = models.OneToOneField(
        "InternalOrderHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True
    )

    objects: InternalOrderManager = InternalOrderManager()

    def __str__(self) -> str:
        return str(self.id)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class InternalOrderProduct(models.Model):
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

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "internal_order"],
                name="unique_product_internal_order",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=0),
                name="quantity_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity")),
                name="quantity_received_must_be_lte_to_quantity",
            ),
        ]


class InternalOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class InternalOrderHistoryModel(models.Model):
    status = models.CharField(max_length=20, choices=InternalOrderHistoryStatusChoices.choices)
    internal_order = models.ForeignKey(
        InternalOrderModel, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            self.internal_order.current_history = self
            self.internal_order.save()

        super().save(*args, **kwargs)
