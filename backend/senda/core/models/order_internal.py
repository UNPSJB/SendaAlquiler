from typing import List, TypedDict

from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel
from users.models import UserModel

InternalOrderProductsDict = TypedDict("Products", {"id": str, "quantity": int})


class InternalOrderManager(models.Manager):
    @transaction.atomic
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
        internal_order.save()

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
        null=True,
    )

    objects: InternalOrderManager = InternalOrderManager()

    def __str__(self) -> str:
        return str(self.id)


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
                name="internal_order_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=0),
                name="internal_order_quantity_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="internal_order_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity")),
                name="internal_order_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class InternalOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class InternalOrderHistoryModel(models.Model):
    status = models.CharField(
        max_length=20, choices=InternalOrderHistoryStatusChoices.choices
    )
    internal_order = models.ForeignKey(
        InternalOrderModel, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )


@receiver(post_save, sender=InternalOrderHistoryModel)
def update_current_history(sender, instance, created, **kwargs):
    if created:
        internal_order = instance.internal_order
        internal_order.current_history = instance
        internal_order.save()
