from typing import Any, Optional, TYPE_CHECKING

from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import ProductModelManager
from senda.core.models.offices import OfficeModel
from senda.core.models.suppliers import SupplierModel
from datetime import datetime

if TYPE_CHECKING:
    from senda.core.models.rental_contracts import (
        RentalContractItemModel,
    )


class ProductTypeChoices(models.TextChoices):
    """
    Enum-like class representing choices for product types. Inherits from models.TextChoices.

    Provides predefined choices like ALQUILABLE and COMERCIABLE, each being a tuple with the internal identifier and the human-readable name.
    """

    ALQUILABLE = "ALQUILABLE", "ALQUILABLE"
    COMERCIABLE = "COMERCIABLE", "COMERCIABLE"


class BrandModel(TimeStampedModel):
    """
    Represents a brand in the Senda system. Inherits from TimeStampedModel for creation and modification timestamps.

    Attributes:
        name (models.CharField): The name of the brand.

    Methods:
        __str__: Returns the string representation of the brand, which is its name.
    """

    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


class ProductModel(TimeStampedModel):
    """
    Represents a product in the Senda system. Inherits from TimeStampedModel for timestamps.

    Attributes:
        stock (models.QuerySet["ProductStockInOfficeModel"]): A queryset for accessing the product's stock in different offices.
        suppliers (models.QuerySet["ProductSupplierModel"]): A queryset for accessing the product's suppliers.
        services (models.QuerySet["ProductServiceModel"]): A queryset for accessing the services related to the product.
        sku (models.CharField): The unique SKU of the product.
        name (models.CharField): The name of the product.
        description (models.TextField): The description of the product.
        brand (models.ForeignKey): A foreign key to BrandModel, representing the product's brand.
        type (models.CharField): The type of the product, using choices from ProductTypeChoices.
        price (models.DecimalField): The price of the product.

    Meta:
        Defines a check constraint to ensure the price is greater than or equal to 0.

    Methods:
        __str__: Returns the string representation of the product, which is its name.
        clean: Custom validation logic before saving the product.
        save: Overridden save method to include custom validation.

    objects (ProductModelManager): Custom manager for additional functionalities.
    """

    stock: models.QuerySet["ProductStockInOfficeModel"]
    suppliers: models.QuerySet["ProductSupplierModel"]
    services: models.QuerySet["ProductServiceModel"]
    rental_contract_items: models.QuerySet["RentalContractItemModel"]

    sku = models.CharField(
        max_length=10, null=True, blank=True, unique=True, db_index=True
    )
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.ForeignKey(
        BrandModel,
        on_delete=models.CASCADE,
        related_name="products",
        null=True,
        blank=True,
    )
    type = models.CharField(max_length=50, choices=ProductTypeChoices.choices)
    price = models.IntegerField(null=True, blank=True,)

    def __str__(self) -> str:
        return self.name

    def clean(self, *args: Any, **kwargs: Any) -> None:
        if not self.brand and self.type == ProductTypeChoices.COMERCIABLE:
            raise ValueError("Brand is required for COMERCIABLE products")

        return super().clean(*args, **kwargs)

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.clean()
        super().save(*args, **kwargs)

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0), name="price_must_be_greater_than_0"
            ),
        ]

    objects: ProductModelManager = ProductModelManager()  # pyright: ignore

    def get_stock_for_office(
        self, office: OfficeModel
    ) -> Optional["ProductStockInOfficeModel"]:
        stock_data = self.stock.filter(office=office).first()

        if not stock_data:
            return None

        return stock_data

    def get_office_available_stock_between_dates(
        self, office: "OfficeModel", start_date: datetime, end_date: datetime
    ) -> int:
        from senda.core.models.rental_contracts import (
            RentalContractStatusChoices,
            RentalContractItemOfficeOrderModel,
        )

        available_stock = (
            self.stock.filter(office=office).aggregate(total=models.Sum("stock"))[
                "total"
            ]
            or 0
        )

        reserved_stock = (
            RentalContractItemOfficeOrderModel.objects.filter(
                models.Q(
                    item__rental_contract__current_history__status=RentalContractStatusChoices.CON_DEPOSITO
                )
                | models.Q(
                    item__rental_contract__current_history__status=RentalContractStatusChoices.ACTIVO
                ),
                item__product=self,
                item__rental_contract__contract_start_datetime__date__gte=start_date,
                item__rental_contract__contract_start_datetime__date__lte=end_date,
                office=office,
            ).aggregate(total=models.Sum("quantity"))["total"]
            or 0
        )

        return available_stock - reserved_stock

    def get_global_available_stock_between_dates(self, start_date, end_date) -> int:
        from senda.core.models.rental_contracts import (
            RentalContractStatusChoices,
        )

        available_stock_among_offices = (
            self.stock.aggregate(total=models.Sum("stock"))["total"] or 0
        )

        reserved_stock = (
            self.rental_contract_items.filter(
                models.Q(
                    rental_contract__current_history__status=RentalContractStatusChoices.CON_DEPOSITO
                )
                | models.Q(
                    rental_contract__current_history__status=RentalContractStatusChoices.ACTIVO
                ),
                rental_contract__contract_start_datetime__date__gte=start_date,
                rental_contract__contract_start_datetime__date__lte=end_date,
            ).aggregate(total=models.Sum("quantity"))["total"]
            or 0
        )

        return available_stock_among_offices - reserved_stock


class ProductStockInOfficeModel(TimeStampedModel):
    """
    Represents the stock of a specific product in a specific office. Inherits from TimeStampedModel.

    Attributes:
        office (models.ForeignKey): A foreign key to OfficeModel, representing the office where the stock is located.
        product (models.ForeignKey): A foreign key to ProductModel, linking to the specific product.
        stock (models.IntegerField): The quantity of the product in stock at the specified office.

    Meta:
        Defines a unique constraint to ensure uniqueness of the product-office combination.
    """

    office = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="stock", db_index=True
    )
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="stock", db_index=True
    )
    stock = models.PositiveIntegerField()

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(fields=["office", "product"], name="unique_stock")
        ]

    def __str__(self) -> str:
        return f"{self.product} - {self.office}"

    def reduce_stock(self, quantity: int) -> None:
        self.stock -= quantity
        self.save()


class ProductSupplierModel(TimeStampedModel):
    """
    Represents a supplier's offering for a specific product. Inherits from TimeStampedModel.

    Attributes:
        product (models.ForeignKey): A foreign key to ProductModel, linking to the product.
        supplier (models.ForeignKey): A foreign key to SupplierModel, linking to the supplier.
        price (models.DecimalField): The price at which the supplier offers the product.
    """

    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="suppliers"
    )
    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="products"
    )
    price = models.IntegerField()

    def __str__(self) -> str:
        return f"{self.product} - {self.supplier}"


class ProductServiceModel(TimeStampedModel):
    """
    Represents a service associated with a product. Inherits from TimeStampedModel.

    Attributes:
        product (models.ForeignKey): A foreign key to ProductModel, linking to the product.
        name (models.CharField): The name of the service.
        price (models.DecimalField): The price of the service.

    Meta:
        Defines unique constraint for the combination of product and service name, and a check constraint to ensure the price is greater than or equal to 0.

    Methods:
        __str__: Returns a string representation of the service, showing the product and service name.
    """

    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="services"
    )

    name = models.CharField(max_length=100)
    price = models.IntegerField()

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
