from typing import List, TypedDict

from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from senda.core.models.offices import OfficeModel
from senda.core.models.products import ProductModel
from senda.core.models.suppliers import SupplierModel
from users.models import UserModel

SupplierOrderProductsDict = TypedDict("Products", {"id": str, "quantity": int})


class SupplierOrderManager(models.Manager["SupplierOrderModel"]):
    @transaction.atomic
    def create_supplier_order(
        self,
        supplier: SupplierModel,
        office_destination: OfficeModel,
        user: UserModel,
        products: List[SupplierOrderProductsDict],
        total: float,
    ):
        supplier_order = self.create(
            supplier=supplier, office_destination=office_destination
        )
        supplier_order.save()

        SupplierOrderHistoryModel.objects.create(
            status=SupplierOrderHistoryStatusChoices.PENDING,
            supplier_order=supplier_order,
            user=user,
            total=total,
        )

        for product in products:
            SupplierOrderProduct.objects.create(
                product_id=product["id"],
                quantity=product["quantity"],
                supplier_order=supplier_order,
            )

        supplier_order.total = supplier_order.calculate_total()

        return supplier_order


class SupplierOrderModel(models.Model):
    orders: models.QuerySet["SupplierOrderProduct"]

    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="supplier_orders_branch"
    )
    office_destination = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="supplier_orders_destination",
    )
    date_created = models.DateTimeField(auto_now_add=True)

    current_history = models.OneToOneField(
        "SupplierOrderHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_order",
        blank=True,
        null=True,
    )

    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True)

    objects: SupplierOrderManager = SupplierOrderManager()

    def __str__(self) -> str:
        return str(self.id)

    def calculate_total(self):
        total = 0
        for order in self.orders.all():
            total += order.total

        return total


class SupplierOrderProduct(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="related_supplier_orders"
    )
    price = models.DecimalField(decimal_places=2, max_digits=10, blank=True)
    total = models.DecimalField(decimal_places=2, max_digits=10, blank=True)

    quantity = models.PositiveIntegerField(default=0)
    quantity_received = models.PositiveIntegerField(default=0)
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="orders"
    )

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.price

        if not self.total:
            self.total = self.price * self.quantity

        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "supplier_order"],
                name="order_supplier_unique_product",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=0),
                name="order_supplier_quantity_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__gte=0),
                name="order_supplier_quantity_received_must_be_positive",
            ),
            models.CheckConstraint(
                check=models.Q(quantity_received__lte=models.F("quantity")),
                name="order_supplier_quantity_received_must_be_lte_to_quantity",
            ),
        ]


class SupplierOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"


class SupplierOrderHistoryModel(models.Model):
    status = models.CharField(
        max_length=20, choices=SupplierOrderHistoryStatusChoices.choices
    )
    supplier_order = models.ForeignKey(
        SupplierOrderModel, on_delete=models.CASCADE, related_name="history"
    )
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(
        "users.UserModel", on_delete=models.SET_NULL, null=True, blank=True
    )


@receiver(post_save, sender=SupplierOrderHistoryModel)
def update_current_history(sender, instance, created, **kwargs):
    if created:
        supplier_order = instance.supplier_order
        supplier_order.current_history = instance
        supplier_order.save()
