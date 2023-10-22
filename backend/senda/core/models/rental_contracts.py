from django.db import models
from users.models import UserModel
from .products import ProductTypeChoices, ProductModel

from django.db.models.signals import post_save
from django.dispatch import receiver


class RentalContractModel(models.Model):
    rental_contract_items: models.QuerySet["RentalContractItemModel"]

    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name="rental_contract"
    )
    current_history: "RentalContractHistoryModel" = models.OneToOneField(
        "RentalContractHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_rental_contract",
        blank=True,
        null=True,
    )
    deposit_amount = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=10
    )
    payment_amount = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=10
    )
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.user.email

    class Meta:
        verbose_name = "Rental Contract"
        verbose_name_plural = "Rental Contracts"
        constraints = [
            models.CheckConstraint(
                check=models.Q(deposit_amount__gte=0), name="deposit_amount_positive"
            ),
            models.CheckConstraint(
                check=models.Q(total__gte=0), name="total_must_be_positive"
            ),
            models.CheckConstraint(
                check=models.Q(deposit_amount__lte=models.F("total")),
                name="deposit_amount_must_be_less_than_total",
            ),
            models.CheckConstraint(
                check=models.Q(total__gte=models.F("deposit_amount")),
                name="total_must_be_greater_than_deposit_amount",
            ),
            models.CheckConstraint(
                check=models.Q(
                    total=models.F("deposit_amount") + models.F("payment_amount")
                ),
                name="deposit_amount_plus_payment_amount_must_be_equal_to_total",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.total:
            self.total = sum(
                [item.total for item in self.rental_contract_items.all() if item.total]
            )

        super().save(*args, **kwargs)


class RentalContractItemModel(models.Model):
    rental_contract = models.ForeignKey(
        RentalContractModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
    )
    product = models.ForeignKey(
        ProductModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
    )
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    quantity_returned = models.PositiveIntegerField(default=0, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.rental_contract} - {self.product}"

    class Meta:
        verbose_name = "Rental Contract Item"
        verbose_name_plural = "Rental Contract Items"
        constraints = [
            models.UniqueConstraint(
                fields=["rental_contract", "product"],
                name="unique_rental_contract_item",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=1), name="quantity_must_be_greater_than_0"
            ),
            models.CheckConstraint(
                check=models.Q(product__type=ProductTypeChoices.ALQUILABLE),
                name="product_must_be_rentable",
            ),
            models.CheckConstraint(
                check=models.Q(total__gte=0), name="total_must_be_positive"
            ),
            models.CheckConstraint(
                check=models.Q(quantity_returned__lte=models.F("quantity")),
                name="quantity_returned_must_be_less_than_quantity",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.total:
            self.total = self.product.price * self.quantity

        super().save(*args, **kwargs)


class RentalContractStatusChoices(models.TextChoices):
    PRESUPUESTADO = "PRESUPUESTADO", "PRESUPUESTADO"
    CON_DEPOSITO = "CON_DEPOSITO", "SEÑADO"
    PAGADO = "PAGADO", "PAGADO"
    CANCELADO = "CANCELADO", "CANCELADO"
    ACTIVO = "ACTIVO", "ACTIVO"
    FINALIZADO = "FINALIZADO", "FINALIZADO"


class RentalContractHistoryModel(models.Model):
    rental_contract = models.ForeignKey(
        RentalContractModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_history",
    )
    status = models.CharField(
        max_length=50, choices=RentalContractStatusChoices.choices
    )

    def __str__(self) -> str:
        return f"{self.rental_contract} - {self.status}"

    class Meta:
        verbose_name = "Rental Contract History"
        verbose_name_plural = "Rental Contract Histories"


@receiver(post_save, sender=RentalContractHistoryModel)
def update_current_history(
    sender, instance: RentalContractHistoryModel, created, **kwargs
):
    if created:
        rental_contract = instance.rental_contract
        rental_contract.current_history = instance
        rental_contract.save()
