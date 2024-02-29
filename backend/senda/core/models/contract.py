from typing import Any, TypedDict, List, Optional, Tuple

from django.core.exceptions import ValidationError
from django.db import models, transaction

from extensions.db.models import TimeStampedModel

from .clients import Client
from .localities import LocalityModel
from .offices import Office
from .products import (
    Product,
    ProductService,
    ProductTypeChoices,
    ProductServiceBillingTypeChoices,
)

from datetime import datetime


class ContractCreationError(Exception):
    """Custom exception for rental contract creation errors."""


class ContractDetailsDict(TypedDict):
    client_id: int
    office_id: int
    contract_start: datetime
    contract_end: datetime
    locality_id: int
    house_number: str
    street_name: str
    house_unit: str


class ContractItemProductAllocationDetailsDict(TypedDict):
    office_id: int
    quantity: int
    shipping_cost: Optional[int]
    shipping_discount: Optional[int]


class ContractItemServiceDetailsDict(TypedDict):
    service_id: int
    service_discount: Optional[int]


class ContractItemDetailsDict(TypedDict):
    product_id: int
    allocations: List[ContractItemProductAllocationDetailsDict]
    product_discount: Optional[int]
    services: List[ContractItemServiceDetailsDict]


class ContractItemTotalDetailsDict(TypedDict):
    product_subtotal: int

    services_subtotal: int
    services_discount: int

    shipping_subtotal: int
    shipping_discount: int

    quantity: int
    total: int


class ContractItemServiceTotalDetailsDict(TypedDict):
    service_subtotal: int
    total: int


class ContractManager(models.Manager["Contract"]):
    def _diff_month(self, start_date: datetime, end_date: datetime):
        return (start_date - end_date).days / 30

    def _diff_week(self, start_date: datetime, end_date: datetime):
        """Return the number of weeks between two dates."""
        return (start_date - end_date).days / 7

    def _calculate_service_totals(
        self,
        service: ProductService,
        discount: int,
        start_date: datetime,
        end_date: datetime,
    ) -> ContractItemServiceTotalDetailsDict:
        service_subtotal = 0

        if (
            service.billing_type == ProductServiceBillingTypeChoices.CUSTOM
            and service.billing_period
        ):
            service_subtotal = (
                int((start_date - end_date).days / service.billing_period)
                * service.price
            )
        elif service.billing_type == ProductServiceBillingTypeChoices.ONE_TIME:
            service_subtotal = service.price
        elif service.billing_type == ProductServiceBillingTypeChoices.MONTHLY:
            service_subtotal = self._diff_month(start_date, end_date) * service.price
        elif service.billing_type == ProductServiceBillingTypeChoices.WEEKLY:
            service_subtotal = self._diff_week(start_date, end_date) * service.price
        else:
            raise ValidationError(f"Invalid billing type {service.billing_type}")

        total = service_subtotal - discount

        return ContractItemServiceTotalDetailsDict(
            service_subtotal=service_subtotal,
            total=total,
        )

    def _validate_product_and_services(
        self, item: ContractItemDetailsDict
    ) -> Tuple[Product, List[ProductService]]:
        product = Product.objects.filter(id=item["product_id"]).first()
        if not product:
            raise ValidationError(f"Product with ID {item['product_id']} not found.")
        if product.type != ProductTypeChoices.ALQUILABLE:
            raise ValidationError(f"Product ID {item['product_id']} is not rentable.")

        services = []
        for service in item.get("services", []):
            service_instance = ProductService.objects.filter(
                id=service["service_id"]
            ).first()
            if not service_instance:
                raise ValidationError(
                    f"Service with ID {service['service_id']} not found."
                )
            services.append(service_instance)

        return product, services

    def _calculate_item_totals(
        self,
        item: ContractItemDetailsDict,
        product_price: int,
        service_instances: List[ProductService],
        start_date: datetime,
        end_date: datetime,
    ) -> ContractItemTotalDetailsDict:

        quantity = 0
        shipping_subtotal = 0
        shipping_discount = 0
        for allocation in item.get("allocations"):
            quantity += allocation.get("quantity")
            shipping_subtotal += allocation.get("shipping_cost") or 0
            shipping_discount += allocation.get("shipping_discount") or 0
        product_subtotal = product_price * quantity

        services_subtotal = 0
        services_discount = 0
        for index, service in enumerate(service_instances):
            service_dict = item.get("services")[index]
            service_discount = service_dict.get("service_discount") or 0
            service_totals = self._calculate_service_totals(
                service,
                service_discount,
                start_date,
                end_date,
            )
            services_subtotal += service_totals.get("service_subtotal")
            services_discount += service_discount

        product_discount = item.get("product_discount") or 0

        total = (
            (product_subtotal - product_discount)
            + (services_subtotal - services_discount)
            + (shipping_subtotal - shipping_discount)
        )

        return ContractItemTotalDetailsDict(
            product_subtotal=product_subtotal,
            services_subtotal=services_subtotal,
            services_discount=services_discount,
            shipping_subtotal=shipping_subtotal,
            shipping_discount=shipping_discount,
            quantity=quantity,
            total=total,
        )

    def create_contract(
        self,
        contract_data: ContractDetailsDict,
        items_data: List[ContractItemDetailsDict],
        created_by_user_id: int,
    ) -> "Contract":
        try:
            contract_start = contract_data.get("contract_start")
            contract_end = contract_data.get("contract_end")

            if contract_end < contract_start:
                raise ValidationError("Contract end date must be after start date.")

            number_of_rental_days = (contract_end - contract_start).days

            with transaction.atomic():
                contract = self.create(
                    client_id=contract_data.get("client_id"),
                    office_id=contract_data.get("office_id"),
                    contract_start_datetime=contract_start,
                    contract_end_datetime=contract_end,
                    locality_id=contract_data.get("locality_id"),
                    house_number=contract_data.get("house_number"),
                    street_name=contract_data.get("street_name"),
                    house_unit=contract_data.get("house_unit"),
                    number_of_rental_days=number_of_rental_days,
                    created_by_id=created_by_user_id,
                )

                for item_data in items_data:
                    product, services = self._validate_product_and_services(item_data)

                    item_totals = self._calculate_item_totals(
                        item_data, product.price, services, contract_start, contract_end
                    )

                    product_discount = item_data.get("product_discount") or 0

                    item = ContractItem.objects.create(
                        contract=contract,
                        product=product,
                        product_price=product.price,
                        quantity=item_totals.get("quantity"),
                        product_subtotal=item_totals.get("product_subtotal"),
                        product_discount=product_discount,
                        services_subtotal=item_totals.get("services_subtotal"),
                        services_discount=item_totals.get("services_discount"),
                        shipping_subtotal=item_totals.get("shipping_subtotal"),
                        shipping_discount=item_totals.get("shipping_discount"),
                        total=item_totals.get("total"),
                    )

                    for index, service_dict in enumerate(item_data.get("services", [])):
                        service_instance = services[index]
                        service_totals = self._calculate_service_totals(
                            service_instance,
                            service_dict.get("service_discount") or 0,
                            contract_start,
                            contract_end,
                        )

                        ContractItemService.objects.create(
                            item=item,
                            service=service_instance,
                            price=service_instance.price,
                            discount=service_dict.get("service_discount") or 0,
                            subtotal=service_totals.get("service_subtotal"),
                            total=service_totals.get("total"),
                        )

                contract.update_totals()
                contract.set_status(ContractStatusChoices.PRESUPUESTADO)

                return contract
        except ValidationError as e:
            raise ContractCreationError(f"Validation failed: {e}")
        except Exception as e:
            raise ContractCreationError(f"Failed to create sale: {e}")


class Contract(TimeStampedModel):
    contract_items: models.QuerySet["ContractItem"]
    contract_history: models.QuerySet["ContractHistory"]

    office = models.ForeignKey(
        Office,
        on_delete=models.CASCADE,
        related_name="contracts",
    )
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="contracts"
    )
    latest_history_entry = models.OneToOneField(
        "ContractHistory",
        on_delete=models.SET_NULL,
        related_name="current_contract",
        blank=True,
        null=True,
    )
    created_by = models.ForeignKey(
        "users.UserModel",
        on_delete=models.CASCADE,
        related_name="contracts_created",
    )

    expiration_date = models.DateTimeField(blank=True, null=True)

    contract_start_datetime = models.DateTimeField()
    contract_end_datetime = models.DateTimeField()

    locality = models.ForeignKey(
        LocalityModel, on_delete=models.CASCADE, related_name="contracts"
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

    subtotal = models.PositiveBigIntegerField(default=0)
    discount_amount = models.PositiveBigIntegerField(default=0)
    total = models.PositiveBigIntegerField(default=0)

    objects: ContractManager = ContractManager()

    def __str__(self) -> str:
        return self.client.email

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Rental Contract"
        verbose_name_plural = "Rental Contracts"

    def update_totals(self):
        self.total = (
            self.contract_items.aggregate(total=models.Sum("total"))["total"] or 0
        )

        self.save()

    def set_status(self, status: str):
        self.latest_history_entry = ContractHistory.objects.create(
            contract=self, status=status
        )
        self.save()


class ContractStatusChoices(models.TextChoices):
    PRESUPUESTADO = "PRESUPUESTADO", "PRESUPUESTADO"
    CON_DEPOSITO = "CON_DEPOSITO", "SEÑADO"
    PAGADO = "PAGADO", "PAGADO"
    CANCELADO = "CANCELADO", "CANCELADO"
    ACTIVO = "ACTIVO", "ACTIVO"
    VENCIDO = "VENCIDO", "VENCIDO"
    FINALIZADO = "FINALIZADO", "FINALIZADO"
    DEVOLUCION_EXITOSA = "DEVOLUCION_EXITOSA", "DEVOLUCION EXITOSA"
    DEVOLUCION_FALLIDA = "DEVOLUCION_FALLIDA", "DEVOLUCION FALLIDA"


class ContractHistory(TimeStampedModel):
    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="history",
    )
    status = models.CharField(max_length=50, choices=ContractStatusChoices.choices)

    def __str__(self) -> str:
        return f"{self.contract} - {self.status}"

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Rental Contract History"
        verbose_name_plural = "Rental Contract Histories"


class ContractItem(TimeStampedModel):
    allocations: models.QuerySet["ContractItemProductAllocation"]

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="contract_items",
        db_index=True,
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="contract_items",
        db_index=True,
    )
    product_price = models.PositiveBigIntegerField(default=0)

    quantity = models.PositiveIntegerField(default=0)
    quantity_returned = models.PositiveIntegerField(default=0)

    product_subtotal = models.PositiveBigIntegerField(default=0)
    services_subtotal = models.PositiveIntegerField(default=0)
    shipping_subtotal = models.PositiveIntegerField(default=0)

    product_discount = models.PositiveBigIntegerField(default=0)
    services_discount = models.PositiveBigIntegerField(default=0)
    shipping_discount = models.PositiveBigIntegerField(default=0)

    total = models.PositiveBigIntegerField(default=0)

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.contract} - {self.product}"

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Rental Contract Item"
        verbose_name_plural = "Rental Contract Items"
        constraints = [
            models.UniqueConstraint(
                fields=["contract", "product"],
                name="unique_contract_item",
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
                "Product must be rentable for inclusion in a rental contract."
            )
        if self.quantity < 1 or (
            self.quantity_returned is not None
            and self.quantity_returned > self.quantity
        ):
            raise ValidationError("Invalid quantity or quantity returned.")

        super().clean()

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.clean()
        return super().save(*args, **kwargs)


class ContractItemService(TimeStampedModel):
    item = models.ForeignKey(
        ContractItem,
        on_delete=models.CASCADE,
        related_name="service_items",
    )
    service = models.ForeignKey(
        ProductService,
        on_delete=models.CASCADE,
        related_name="contract_items",
    )

    price = models.PositiveBigIntegerField(default=0)

    discount = models.PositiveBigIntegerField(default=0)

    subtotal = models.PositiveBigIntegerField(default=0)
    total = models.PositiveBigIntegerField(default=0)

    objects = models.Manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["item", "service"],
                name="unique_contract_item_service",
            ),
        ]


class ContractItemProductAllocation(models.Model):
    office = models.ForeignKey(
        "Office",
        on_delete=models.CASCADE,
        related_name="contract_items_allocations",
    )
    item = models.ForeignKey(
        ContractItem,
        on_delete=models.CASCADE,
        related_name="allocations",
    )
    quantity = models.PositiveIntegerField()

    shipping_cost = models.PositiveIntegerField(default=0)

    objects = models.Manager()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["item", "office"],
                name="unique_contract_item_allocation_per_office",
            ),
        ]
