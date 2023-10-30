from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .clients import ClientModel
from .products import ProductModel


def calculate_purchase_total(purchase):
    total = sum([item.quantity * item.price for item in purchase.purchase_items.all()])
    return total


class PurchaseModel(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="purchases"
    )
    current_history = models.OneToOneField(
        "PurchaseHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_purchase",
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        return f"{self.date} - {self.total}"

    @transaction.atomic
    def save(self, *args, **kwargs):
        if not self.total:
            self.total = calculate_purchase_total(self)

        super().save(*args, **kwargs)


class PurchaseStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    CANCELED = "CANCELED", "Cancelado"
    PAID = "PAID", "Pagado"


class PurchaseHistoryModel(models.Model):
    purchase = models.ForeignKey(PurchaseModel, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=PurchaseStatusChoices.choices,
        default=PurchaseStatusChoices.PENDING,
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"{self.purchase} - {self.status}"


class PurchaseItemModel(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    purchase = models.ForeignKey(
        PurchaseModel, on_delete=models.CASCADE, related_name="purchase_items"
    )
    quantity = models.IntegerField()
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=10)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["product", "purchase"], name="unique_item")
        ]

    def __str__(self) -> str:
        return f"{self.product.name} - {self.quantity}"

    def save(self, *args, **kwargs):
        if not self.price:
            self.price = self.product.price

        super().save(*args, **kwargs)


@receiver(post_save, sender=PurchaseHistoryModel)
def update_current_history(sender, instance: PurchaseHistoryModel, created, **kwargs):
    if created:
        purchase = instance.purchase
        purchase.current_history = instance
        purchase.save()
