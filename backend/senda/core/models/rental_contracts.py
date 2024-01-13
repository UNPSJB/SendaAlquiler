from typing import Any

from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from extensions.db.models import TimeStampedModel
from senda.core.managers import RentalContractManager

from .clients import ClientModel
from .localities import LocalityModel
from .offices import OfficeModel
from .products import ProductModel, ProductServiceModel, ProductTypeChoices

from datetime import timedelta


class RentalContractModel(TimeStampedModel):
    """
    Represents a rental contract in the Senda system. Inherits from TimeStampedModel for creation and modification timestamps.

    Attributes:
        rental_contract_items (models.QuerySet["RentalContractItemModel"]): A queryset for accessing the items included in the rental contract.
        rental_contract_history (models.QuerySet["RentalContractHistoryModel"]): A queryset for accessing the contract's history.
        office (models.ForeignKey): A foreign key to OfficeModel, linking to the office where the contract is held.
        client (models.ForeignKey): A foreign key to ClientModel, linking to the client involved in the rental contract.
        current_history (models.OneToOneField): A one-to-one relationship to the most current history item of the rental contract.
        has_payed_deposit (models.BooleanField): Flag to indicate if the deposit has been paid.
        has_payed_remaining_amount (models.BooleanField): Flag to indicate if the remaining amount has been paid.
        total (models.DecimalField): The total cost of the rental contract.
        expiration_date (models.DateTimeField): The expiration date of the contract.
        contract_start_datetime (models.DateTimeField): The start datetime of the contract.
        contract_end_datetime (models.DateTimeField): The end datetime of the contract.
        locality (models.ForeignKey): A foreign key to LocalityModel, representing the locality of the client.
        house_number (models.CharField): The house number of the client's address.
        street_name (models.CharField): The street name of the client's address.
        house_unit (models.CharField): The house unit number of the client's address.

    Meta:
        Defines verbose names for the model.

    Methods:
        __str__: Returns a string representation of the rental contract, showing the client's email.
        save: Overridden save method to include logic for setting expiration date.
        calculate_total: Calculates and returns the total cost of the rental contract based on its items.
    """

    rental_contract_items: models.QuerySet["RentalContractItemModel"]
    rental_contract_history: models.QuerySet["RentalContractHistoryModel"]

    office = models.ForeignKey(
        OfficeModel,
        on_delete=models.CASCADE,
        related_name="rental_contracts",
    )
    client = models.ForeignKey(
        ClientModel, on_delete=models.CASCADE, related_name="rental_contracts"
    )
    current_history = models.OneToOneField(
        "RentalContractHistoryModel",
        on_delete=models.SET_NULL,
        related_name="current_rental_contract",
        blank=True,
        null=True,
    )
    total = models.IntegerField(
        default=0,
        blank=True,
    )
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
    number_of_rental_days = models.PositiveIntegerField()

    created_by = models.ForeignKey(
        "users.UserModel",
        on_delete=models.CASCADE,
        related_name="rental_contracts_created",
    )

    objects: RentalContractManager = RentalContractManager()  # pyright: ignore

    def __str__(self) -> str:
        return self.client.email

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Rental Contract"
        verbose_name_plural = "Rental Contracts"

    def save(self, *args: Any, **kwargs: Any) -> None:
        if not self.expiration_date:
            self.expiration_date = self.created_on + timedelta(days=14)

        super().save(*args, **kwargs)

    def calculate_total(self):
        total = 0
        for item in self.rental_contract_items.all():
            total += item.total

        return total


class RentalContractItemModel(TimeStampedModel):
    """
    Represents an item in a rental contract. Inherits from TimeStampedModel.

    Attributes:
        rental_contract (models.ForeignKey): A foreign key to RentalContractModel, linking to the rental contract the item belongs to.
        product (models.ForeignKey): A foreign key to ProductModel, linking to the product rented.
        quantity (models.PositiveIntegerField): The quantity of the product rented.
        price (models.DecimalField): The price of the product at the time of rental.
        total (models.DecimalField): The total cost for this product in the rental contract.
        quantity_returned (models.PositiveIntegerField): The quantity of the product that has been returned.
        service (models.ForeignKey): An optional foreign key to ProductServiceModel, linking to an associated service.
        service_price (models.DecimalField): The price of the associated service.
        service_total (models.DecimalField): The total cost for the service in the rental contract.

    Meta:
        Defines constraints, including uniqueness of product per rental contract and validation checks on quantities.

    Methods:
        clean: Custom validation logic to ensure the product is rentable.
        __str__: Returns a string representation of the rental contract item, showing the contract and product.
        save: Overridden save method to include custom logic for setting price, total, and service total.
    """

    offices_orders: models.QuerySet["RentalContractItemOfficeOrderModel"]

    rental_contract = models.ForeignKey(
        RentalContractModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
        db_index=True,
    )
    product = models.ForeignKey(
        ProductModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
        db_index=True,
    )
    quantity = models.PositiveIntegerField(default=1)
    price = models.IntegerField(
        default=0,
        blank=True,
    )
    quantity_returned = models.PositiveIntegerField(default=0, blank=True, null=True)
    service = models.ForeignKey(
        ProductServiceModel,
        on_delete=models.CASCADE,
        related_name="rental_contract_items",
        null=True,
        blank=True,
    )
    service_price = models.IntegerField(
        blank=True,
        null=True,
    )

    subtotal = models.IntegerField(
        default=0,
    )

    discount = models.IntegerField(
        default=0,
    )

    total = models.IntegerField(
        default=0,
    )

    def __str__(self) -> str:
        return f"{self.rental_contract} - {self.product}"

    class Meta(TimeStampedModel.Meta):
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

    def clean(self) -> None:
        if self.product.type != ProductTypeChoices.ALQUILABLE:
            raise ValidationError(
                "No se puede agregar un producto que no sea ALQUILABLE a un contrato de alquiler"
            )

        return super().clean()

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.clean()
        return super().save(*args, **kwargs)


class RentalContractItemOfficeOrderModel(models.Model):
    item: "RentalContractItemModel"
    office: "OfficeModel"

    office = models.ForeignKey(
        "OfficeModel",
        on_delete=models.CASCADE,
        related_name="rental_contract_items_offices_orders",
    )
    item = models.ForeignKey(
        RentalContractItemModel,
        on_delete=models.CASCADE,
        related_name="offices_orders",
    )
    quantity = models.PositiveIntegerField()

    objects = models.Manager()

    class Meta:
        unique_together = ("office", "item")

    def __str__(self):
        return f"{self.office.name} - {self.product.name}: {self.quantity}"


class RentalContractStatusChoices(models.TextChoices):
    """
    Enum-like class representing status choices for rental contract history. Inherits from models.TextChoices.

    Provides predefined status choices like PRESUPUESTADO, CON_DEPOSITO, PAGADO, CANCELADO, etc.
    """

    PRESUPUESTADO = "PRESUPUESTADO", "PRESUPUESTADO"
    CON_DEPOSITO = "CON_DEPOSITO", "SEÑADO"
    PAGADO = "PAGADO", "PAGADO"
    CANCELADO = "CANCELADO", "CANCELADO"
    ACTIVO = "ACTIVO", "ACTIVO"
    VENCIDO = "VENCIDO", "VENCIDO"
    FINALIZADO = "FINALIZADO", "FINALIZADO"
    DEVOLUCION_EXITOSA = "DEVOLUCION_EXITOSA", "DEVOLUCION EXITOSA"
    DEVOLUCION_FALLIDA = "DEVOLUCION_FALLIDA", "DEVOLUCION FALLIDA"


class RentalContractHistoryModel(TimeStampedModel):
    """
    Represents the history of a rental contract, tracking its status changes. Inherits from TimeStampedModel.

    Attributes:
        rental_contract (models.ForeignKey): A foreign key to RentalContractModel, linking to the related rental contract.
        status (models.CharField): The current status of the contract, using choices from RentalContractStatusChoices.

    Meta:
        Defines verbose names for the model.

    Methods:
        __str__: Returns a string representation of the rental contract history, showing the contract and status.
    """

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

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Rental Contract History"
        verbose_name_plural = "Rental Contract Histories"


@receiver(post_save, sender=RentalContractHistoryModel)
def update_current_history(
    sender: RentalContractHistoryModel,
    instance: RentalContractHistoryModel,
    created: bool,
    **kwargs: Any,
) -> None:
    """
    Signal receiver that updates the current history of a RentalContractModel when a new RentalContractHistoryModel instance is created.

    Parameters:
        sender (RentalContractHistoryModel): The model class sending the signal.
        instance (RentalContractHistoryModel): The instance of the model that was saved.
        created (bool): A boolean flag indicating whether this instance is newly created.
        kwargs (Any): Additional keyword arguments.
    """
    if created:
        rental_contract = instance.rental_contract
        rental_contract.current_history = instance
        rental_contract.save()


@receiver(post_save, sender=RentalContractItemModel)
@transaction.atomic
def check_ordered_quantity(
    sender: RentalContractItemModel, instance: RentalContractItemModel, **kwargs: Any
) -> None:
    if not instance.quantity:
        for office_order in instance.offices_orders.all():
            instance.quantity += office_order.quantity

        instance.save()
    else:
        for order in instance.offices_orders.all():
            product = instance.product
            stock_in_office = product.get_office_available_stock_between_dates(
                order.office,
                instance.rental_contract.contract_start_datetime,
                instance.rental_contract.contract_end_datetime,
            )

            if stock_in_office is None:
                raise ValidationError(
                    "No se puede agregar un producto que no esté en stock en una sucursal"
                )

            if stock_in_office < order.quantity:
                raise ValidationError(
                    "El stock disponible en la fecha de alquiler es menor al solicitado"
                )

            if order.office.pk != instance.rental_contract.office.pk:
                from senda.core.models.order_internal import InternalOrderModel

                InternalOrderModel.objects.create_internal_order(
                    instance.rental_contract.office,
                    order.office,
                    instance.rental_contract.created_by,
                    [
                        {
                            "id": str(instance.product.pk),
                            "quantity": order.quantity,
                        }
                    ],
                )


@receiver(post_save, sender=RentalContractItemModel)
def update_totals(
    sender: Any, instance: RentalContractItemModel, **kwargs: Any
) -> None:
    instance.price = instance.product.price

    product_subtotal = (
        instance.quantity
        * instance.price
        * instance.rental_contract.number_of_rental_days
    )

    service_subtotal = 0
    if instance.service:
        instance.service_price = instance.service.price
        service_subtotal = (
            instance.service.price
            * instance.quantity
            * instance.rental_contract.number_of_rental_days
        )
    else:
        instance.service_price = None

    new_subtotal = product_subtotal + service_subtotal
    new_total = new_subtotal - instance.discount

    if instance.subtotal != new_subtotal or instance.total != new_total:
        instance.subtotal = new_subtotal
        instance.total = new_total
        instance.save()

        instance.rental_contract.total = instance.rental_contract.calculate_total()
        instance.rental_contract.save()
