from typing import List, TypedDict

from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.models.offices import OfficeModel
from senda.core.models.suppliers import SupplierModel


class ProductTypeChoices(models.TextChoices):
    ALQUILABLE = "ALQUILABLE", "ALQUILABLE"
    COMERCIABLE = "COMERCIABLE", "COMERCIABLE"


class BrandModel(TimeStampedModel):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


ProductStockInOfficeModelDict = TypedDict(
    "ProductStockInOfficeModelDict", {"office_id": str, "stock": int}
)

ProductSupplierDict = TypedDict(
    "ProductSupplierDict", {"supplier_id": str, "price": str}
)

ProductServiceDict = TypedDict("ProductServiceDict", {"name": str, "price": str})


class ProductModelManager(models.Manager["ProductModel"]):
    def create_product(
        self,
        sku: str,
        name: str,
        brand_id: str,
        description: str,
        type: ProductTypeChoices,
        price: str,
        stock: List[ProductStockInOfficeModelDict],
        services: List[ProductServiceDict],
        suppliers: List[ProductSupplierDict],
    ):
        if self.filter(sku=sku).exists():
            raise ValueError("Ya existe un producto con ese sku")

        product = self.create(
            sku=sku,
            name=name,
            brand_id=brand_id,
            description=description,
            type=type,
            price=price,
        )

        for stock_data in stock:
            ProductStockInOfficeModel.objects.create(
                office_id=stock_data["office_id"],
                product=product,
                stock=stock_data["stock"],
            )

        for service_data in services:
            ProductServiceModel.objects.create(
                product=product, name=service_data["name"], price=service_data["price"]
            )

        for supplier_data in suppliers:
            ProductSupplierModel.objects.create(
                product=product,
                supplier_id=supplier_data["supplier_id"],
                price=supplier_data["price"],
            )

        return product


class ProductModel(TimeStampedModel):
    """
    Modelo que representa un producto en el sistema.

    Atributos:
    - sku: Código único del producto.
    - name: Nombre del producto.
    - description: Descripción detallada del producto.
    - brand: Marca asociada al producto.
    - type: Tipo de producto (por ejemplo, COMERCIABLE).
    - price: Precio del producto.

    Métodos:
    - clean: Valida que los productos COMERCIABLES tengan una marca asociada.
    - save: Llama al método clean y luego guarda el producto.
    """

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
    price = models.DecimalField(null=True, blank=True, decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return self.name

    def clean(self, *args, **kwargs):
        if not self.brand and self.type == ProductTypeChoices.COMERCIABLE:
            raise ValueError("Brand is required for COMERCIABLE products")

        return super().clean(*args, **kwargs)

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(price__gte=0), name="price_must_be_greater_than_0"
            ),
        ]

    objects: ProductModelManager = ProductModelManager()


class ProductStockInOfficeModel(TimeStampedModel):
    """
    Modelo que representa el stock de un producto en una oficina específica.

    Atributos:
    - office: Oficina donde se encuentra el stock del producto.
    - product: Producto del cual se está llevando el registro de stock.
    - stock: Cantidad de stock del producto en la oficina.

    Restricciones:
    - La combinación de oficina y producto debe ser única.
    """

    office = models.ForeignKey(
        OfficeModel, on_delete=models.CASCADE, related_name="stock"
    )
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="stock"
    )
    stock = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["office", "product"], name="unique_stock")
        ]


class ProductSupplierModel(TimeStampedModel):
    """
    Modelo que representa la relación entre un producto y un proveedor.

    Atributos:
    - product: Producto que es suministrado.
    - supplier: Proveedor que suministra el producto.
    - price: Precio al que el proveedor suministra el producto.

    Nota:
    - Un producto puede tener múltiples proveedores y un proveedor puede suministrar múltiples productos.
    """

    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="suppliers"
    )
    supplier = models.ForeignKey(
        SupplierModel, on_delete=models.CASCADE, related_name="products"
    )
    price = models.DecimalField(decimal_places=2, max_digits=10)


class ProductServiceModel(models.Model):
    product = models.ForeignKey(
        ProductModel, on_delete=models.CASCADE, related_name="services"
    )

    name = models.CharField(max_length=100)
    price = models.DecimalField(decimal_places=2, max_digits=10)

    def __str__(self) -> str:
        return f"{self.product} - {self.name}"

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "name"], name="unique_service_name_by_product"
            ),
            models.CheckConstraint(check=models.Q(price__gte=0), name="price_gte_0"),
        ]
