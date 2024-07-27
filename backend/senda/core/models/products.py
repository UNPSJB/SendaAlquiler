from typing import Optional, TYPE_CHECKING, TypedDict, List

from django.db import models, transaction

from extensions.db.models import TimeStampedModel
from senda.core.models.offices import Office
from senda.core.models.suppliers import SupplierModel
from datetime import datetime
from django.core.exceptions import ValidationError

if TYPE_CHECKING:
    from senda.core.models.contract import ContractItem


class ProductDataDict(TypedDict):
    sku: str
    name: str
    description: Optional[str]
    brand_id: Optional[int]
    type: "ProductTypeChoices"
    price: Optional[int]


class ProductStockItemDataDict(TypedDict):
    product_id: int
    office_id: int
    quantity: int


class ProductSupplierDataDict(TypedDict):
    product_id: int
    supplier_id: int
    price: int


class ProductServiceDataDict(TypedDict):
    product_id: int
    service_id: Optional[int]
    name: str
    price: int
    billing_type: "ProductServiceBillingTypeChoices"
    billing_period: Optional[int]


class ProductManager(models.Manager["Product"]):
    def create_product(self, product_data: ProductDataDict) -> "Product":
        try:
            product = self.create(
                sku=product_data.get("sku"),
                name=product_data.get("name"),
                description=product_data.get("description"),
                brand_id=product_data.get("brand_id"),
                type=product_data.get("type"),
                price=product_data.get("price"),
            )

            return product
        except ValidationError as e:
            raise ValueError(f"Invalid product data: {e}")

    def edit_product(self, product_id: int, product_data: ProductDataDict) -> "Product":
        try:
            product = self.get(pk=product_id)
            product.sku = product_data.get("sku")
            product.name = product_data.get("name")
            product.description = product_data.get("description")
            product.brand_id = product_data.get("brand_id")
            product.type = product_data.get("type")
            product.price = product_data.get("price")
            product.full_clean()
            product.save()

            return product
        except self.model.DoesNotExist:
            raise ValueError("Product with the given ID does not exist.")
        except ValidationError as e:
            raise ValueError(f"Invalid product data: {e}")

    def update_or_create_stock_items(
        self, product_id: int, stocks_data: List[ProductStockItemDataDict]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            for item_data in stocks_data:
                office_id = item_data["office_id"]
                quantity = item_data["quantity"]

                # Validate quantity
                if quantity < 0:
                    raise ValueError("Quantity cannot be negative.")

                stock_item, created = StockItem.objects.get_or_create(
                    product=product,
                    office_id=office_id,
                    defaults={"quantity": quantity},
                )

                if not created:
                    stock_item.quantity = quantity
                    stock_item.save()

    def update_or_create_product_suppliers(
        self, product_id: int, suppliers_data: List[ProductSupplierDataDict]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            for supplier_data in suppliers_data:
                supplier_id = supplier_data["supplier_id"]
                price = supplier_data["price"]

                # Validate price
                if price < 0:
                    raise ValueError("Price cannot be negative.")

                product_supplier, created = ProductSupplier.objects.get_or_create(
                    product=product, supplier_id=supplier_id, defaults={"price": price}
                )

                if not created:
                    product_supplier.price = price
                    product_supplier.save()

    def update_or_create_product_services(
        self, product_id: int, services_data: List[ProductServiceDataDict]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            for service_data in services_data:
                service_id = service_data.get("service_id")
                name = service_data["name"]
                price = service_data["price"]

                # Validate price
                if price < 0:
                    raise ValueError("Price cannot be negative.")

                if service_id:
                    product_service = product.services.get(pk=service_id)
                    product_service.name = name
                    product_service.price = price
                    product_service.billing_type = service_data["billing_type"]
                    product_service.billing_period = service_data.get("billing_period")
                    product_service.save()
                else:
                    product_service = ProductService.objects.create(
                        product=product,
                        name=name,
                        price=price,
                        billing_type=service_data.get("billing_type"),
                        billing_period=service_data.get("billing_period"),
                    )

    def delete_product_suppliers(
        self, product_id: int, suppliers_ids: List[int]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            product.suppliers.filter(supplier_id__in=suppliers_ids).delete()

    def delete_product_services(
        self, product_id: int, services_ids: List[int]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            product.services.filter(id__in=services_ids).delete()

    def delete_stock_items(
        self, product_id: int, office_ids: List[int]
    ) -> None:
        with transaction.atomic():
            product = self.get(pk=product_id)
            product.stock_items.filter(office_id__in=office_ids).delete()

class ProductTypeChoices(models.TextChoices):
    ALQUILABLE = "ALQUILABLE", "ALQUILABLE"
    COMERCIABLE = "COMERCIABLE", "COMERCIABLE"


class Brand(TimeStampedModel):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name

    objects = models.Manager()


class Product(TimeStampedModel):
    stock_items: models.QuerySet["StockItem"]
    suppliers: models.QuerySet["SupplierModel"]
    services: models.QuerySet["ProductService"]
    contract_items: models.QuerySet["ContractItem"]
    brand_id: int

    sku = models.CharField(
        max_length=10, null=True, blank=True, unique=True, db_index=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.ForeignKey(
        Brand,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=50, choices=ProductTypeChoices.choices)
    price = models.PositiveBigIntegerField(
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return self.name

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0), name="price_must_be_greater_than_0"
            ),
        ]

    objects: ProductManager = ProductManager()

    @property
    def available_stock(self) -> int:
        return (
            self.stock_items.aggregate(total_stock=models.Sum("quantity"))[
                "total_stock"
            ]
            or 0
        )

    def decrease_stock_in_office(self, office_id: int, quantity: int) -> None:
        stock_item = self.stock_items.filter(office_id=office_id).first()

        if not stock_item:
            stock_item = StockItem.objects.create(
                product=self, office_id=office_id, quantity=0
            )

        if stock_item.quantity < quantity:
            raise ValueError("Not enough stock in office.")

        stock_item.quantity -= quantity
        stock_item.save()

    def increase_stock_in_office(self, office_id: int, quantity: int) -> None:
        stock_item = self.stock_items.filter(office_id=office_id).first()

        if not stock_item:
            stock_item = StockItem.objects.create(
                product=self, office_id=office_id, quantity=0
            )

        stock_item.quantity += quantity
        stock_item.save()

    def get_stock_for_office(self, office_id: int) -> Optional[int]:
        stock_item = self.stock_items.filter(office_id=office_id).first()

        if not stock_item:
            return None

        return stock_item.quantity

    def calculate_stock_availability(
        self, office_id: int, start_date: str, end_date: str
    ) -> int:
        """Calculates available stock subtracting reserved items within a date range for a specific office."""

        # TODO: TAKE INTO ACCOUNT INTERNAL ORDERS

        from senda.core.models.contract import (
            ContractHistoryStatusChoices,
            ContractItemProductAllocation,
        )

        available_stock = self.get_stock_for_office(office_id) or 0

        # take into account ContractItemProductAllocation "office_id" field
        allocated_stock_qs = ContractItemProductAllocation.objects.filter(
            item__product_id=self.id,
            item__contract__latest_history_entry__status__in=[
                ContractHistoryStatusChoices.CON_DEPOSITO,
                ContractHistoryStatusChoices.ACTIVO,
            ],
            item__contract__contract_start_datetime__date__range=(
                start_date,
                end_date,
            ),
            office_id=office_id,
        ).aggregate(total_allocated=models.Sum("quantity"))

        allocated_stock = allocated_stock_qs["total_allocated"] or 0

        return available_stock - allocated_stock

    def calculate_global_stock_availability(
        self, start_date: datetime, end_date: datetime
    ) -> int:
        """Calculates global available stock subtracting reserved items within a date range across all offices."""
        from senda.core.models.contract import ContractHistoryStatusChoices

        available_stock = self.available_stock
        reserved_stock_qs = self.contract_items.filter(
            contract__latest_history_entry__status__in=[
                ContractHistoryStatusChoices.CON_DEPOSITO,
                ContractHistoryStatusChoices.ACTIVO,
            ],
            contract__contract_start_datetime__date__range=(
                start_date,
                end_date,
            ),
        ).aggregate(total_reserved=models.Sum("quantity"))

        reserved_stock = reserved_stock_qs["total_reserved"] or 0

        return available_stock - reserved_stock


class StockItem(TimeStampedModel):
    office = models.ForeignKey(
        Office, on_delete=models.CASCADE, related_name="stock_items", db_index=True
    )
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="stock_items", db_index=True
    )
    quantity = models.PositiveIntegerField()

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(fields=["office", "product"], name="unique_stock")
        ]

    def __str__(self) -> str:
        return f"{self.product} - {self.office}"

    objects = models.Manager()


class ProductSupplier(TimeStampedModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="suppliers"
    )
    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="products"
    )
    price = models.PositiveBigIntegerField()

    def __str__(self) -> str:
        return f"{self.product} - {self.supplier}"

    objects = models.Manager()


class ProductServiceBillingTypeChoices(models.TextChoices):
    ONE_TIME = "ONE_TIME", "ONE_TIME"
    WEEKLY = "WEEKLY", "WEEKLY"
    MONTHLY = "MONTHLY", "MONTHLY"
    CUSTOM = "CUSTOM", "CUSTOM"


class ProductService(TimeStampedModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="services"
    )

    name = models.CharField(max_length=100)
    price = models.PositiveBigIntegerField()
    billing_type = models.CharField(
        max_length=50, choices=ProductServiceBillingTypeChoices.choices
    )
    billing_period = models.PositiveIntegerField(
        null=True, blank=True, help_text="Periodo de facturación en días"
    )

    def __str__(self) -> str:
        return f"{self.product} - {self.name}"

    class Meta(TimeStampedModel.Meta):
        verbose_name = "Service"
        verbose_name_plural = "Services"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "name"], name="unique_service_name_by_product"
            ),
            models.CheckConstraint(check=models.Q(price__gte=0), name="price_gte_0"),
        ]

    objects = models.Manager()
