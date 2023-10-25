from django.db import models
from .offices import OfficeModel
from .localities import LocalityModel
from .products import ProductTypeChoices, ProductModel
from .clients import ClientModel
from .services import ServiceModel

from django.db.models.signals import post_save
from django.dispatch import receiver

from django.core.exceptions import ValidationError

from django.utils import timezone


class RentalContractModel(models.Model):
    rental_contract_items: models.QuerySet["RentalContractItemModel"]

    office = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="rental_contracts",
    )
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="rental_contracts"
    )
    current_history: "RentalContractHistoryModel" = models.OneToOneField(
        "RentalContractHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_rental_contract",
        blank=True,
        null=True,
    )
    has_payed_deposit = models.BooleanField(default=False)
    has_payed_remaining_amount = models.BooleanField(default=False)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    date_created = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateTimeField(blank=True, null=True)

    contract_start_datetime = models.DateTimeField()
    contract_end_datetime = models.DateTimeField()

    locality = models.ForeignKey(
        LocalityModel, on_delete=models.CASCADE, related_name="rental_contracts"
    )
    house_number = models.CharField(
        max_length=10, help_text="Número de la calle donde vive el cliente"
    )
    street_name = models.CharField(
        max_length=255, help_text="Nombre de la calle donde vive el cliente"
    )
    house_unit = models.CharField(
        max_length=10,
        help_text="Número de la casa o departamento",
        blank=True,
        null=True,
    )

    def __str__(self) -> str:
        return self.client.email

    class Meta:
        verbose_name = "Rental Contract"
        verbose_name_plural = "Rental Contracts"

    def save(self, *args, **kwargs):
        if not self.expiration_date:
            self.expiration_date = self.date_created + timezone.timedelta(days=14)

        super().save(*args, **kwargs)

    def calculate_total(self):
        total = 0
        for item in self.rental_contract_items.all():
            total += item.total

        return total


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
    price = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    total = models.DecimalField(blank=True, decimal_places=2, max_digits=10)
    quantity_returned = models.PositiveIntegerField(default=0, blank=True, null=True)
    service = models.ForeignKey(
        ServiceModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
        null=True,
        blank=True,
    )
    service_price = models.DecimalField(
        blank=True, null=True, decimal_places=2, max_digits=10
    )
    service_total = models.DecimalField(
        null=True, blank=True, decimal_places=2, max_digits=10
    )

    def __str__(self) -> str:
        return f"{self.rental_contract} - {self.product}"

    class Meta:
        verbose_name = "Rental Contract Item"
        verbose_name_plural = "Rental Contract Items"
        constraints = [
            models.UniqueConstraint(
                fields=["rental_contract", "product", "service"],
                name="unique_rental_contract_item",
            ),
            models.CheckConstraint(
                check=models.Q(quantity__gte=1), name="quantity_must_be_greater_than_0"
            ),
            models.CheckConstraint(
                check=models.Q(quantity_returned__lte=models.F("quantity")),
                name="quantity_returned_must_be_lte_quantity",
            ),
        ]

    def clean(self):
        if self.product.type != ProductTypeChoices.ALQUILABLE:
            raise ValidationError(
                "No se puede agregar un producto que no sea ALQUILABLE a un contrato de alquiler"
            )

    def save(self, *args, **kwargs):
        if not self.total:
            self.total = self.price * self.quantity

        if self.service and not self.service_total:
            self.service_total += self.service.price * self.quantity

        if not self.price:
            self.price = self.product.price

        if not self.service_price:
            self.service_price = self.service.price

        self.clean()

        super().save(*args, **kwargs)


class RentalContractStatusChoices(models.TextChoices):
    PRESUPUESTADO = "PRESUPUESTADO", "PRESUPUESTADO"
    CON_DEPOSITO = "CON_DEPOSITO", "SEÑADO"
    PAGADO = "PAGADO", "PAGADO"
    CANCELADO = "CANCELADO", "CANCELADO"
    ACTIVO = "ACTIVO", "ACTIVO"
    VENCIDO = "VENCIDO", "VENCIDO"
    FINALIZADO = "FINALIZADO", "FINALIZADO"
    DEVOLUCION_EXITOSA = "DEVOLUCION_EXITOSA", "DEVOLUCION EXITOSA"
    DEVOLUCION_FALLIDA = "DEVOLUCION_FALLIDA", "DEVOLUCION FALLIDA"


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
