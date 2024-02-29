from django.contrib import admin

from .models.clients import Client
from .models.employees import EmployeeModel, EmployeeOffice
from .models.localities import LocalityModel
from .models.offices import Office
from .models.order_internal import (
    InternalOrder,
    InternalOrderHistory,
    InternalOrderLineItem,
)
from .models.order_supplier import (
    SupplierOrder,
    SupplierOrderLineItem,
    SupplierOrderHistory,
)
from .models.products import Brand, Product, ProductService, StockItem, ProductSupplier
from .models.sale import SaleItemModel, Sale
from .models.contract import (
    ContractHistory,
    ContractItem,
    Contract,
)
from .models.suppliers import SupplierModel
from .models.admin import AdminModel


@admin.register(Brand)
class BrandModelAdmin(admin.ModelAdmin[Brand]):
    search_fields = ("name",)


@admin.register(Client)
class ClientModelAdmin(admin.ModelAdmin[Client]):
    search_fields = ("email",)


class EmployeeOfficeInline(
    admin.TabularInline[EmployeeOffice, EmployeeModel]
):
    model = EmployeeOffice


@admin.register(EmployeeModel)
class EmployeeModelAdmin(admin.ModelAdmin[EmployeeModel]):
    search_fields = ("user",)
    inlines = [
        EmployeeOfficeInline,
    ]


@admin.register(LocalityModel)
class LocalityModelAdmin(admin.ModelAdmin[LocalityModel]):
    list_display = ("name",)


@admin.register(Office)
class OfficeAdmin(admin.ModelAdmin[Office]):
    list_display = ("name",)


class ServiceModelInline(admin.TabularInline[ProductService, Product]):
    model = ProductService


@admin.register(Product)
class ProductModelAdmin(admin.ModelAdmin[Product]):
    inlines = [
        ServiceModelInline,
    ]
    list_display = ("name",)
    raw_id_fields = ("brand",)


@admin.register(SupplierModel)
class SupplierModelAdmin(admin.ModelAdmin[SupplierModel]):
    list_display = ("name",)


@admin.register(SupplierOrder)
class OrderSupplierModelAdmin(admin.ModelAdmin[SupplierOrder]):
    list_display = ("id",)


@admin.register(InternalOrder)
class InternalOrderModelAdmin(admin.ModelAdmin[InternalOrder]):
    list_display = ("id",)


@admin.register(StockItem)
class ProductStockInOfficeAdmin(admin.ModelAdmin[StockItem]):
    list_display = ("product", "office")


@admin.register(Contract)
class ContractModelAdmin(admin.ModelAdmin[Contract]):
    readonly_fields = ("total",)
    raw_id_fields = ("client", "office")


@admin.register(ContractItem)
class ContractItemModelAdmin(admin.ModelAdmin[ContractItem]):
    list_display = ("id", "contract", "product", "quantity")


@admin.register(ContractHistory)
class ContractHistoryModelAdmin(admin.ModelAdmin[ContractHistory]):
    raw_id_fields = ("contract",)


@admin.register(ProductService)
class ServiceModelAdmin(admin.ModelAdmin[ProductService]):
    pass


@admin.register(SaleItemModel)
class SaleItemModelAdmin(admin.ModelAdmin[SaleItemModel]):
    pass


@admin.register(Sale)
class SaleModelAdmin(admin.ModelAdmin[Sale]):
    pass


@admin.register(SupplierOrderLineItem)
class SupplierOrderProductAdmin(admin.ModelAdmin[SupplierOrderLineItem]):
    pass


@admin.register(SupplierOrderHistory)
class SupplierOrderHistoryModelAdmin(admin.ModelAdmin[SupplierOrderHistory]):
    pass


@admin.register(ProductSupplier)
class ProductSupplierModelAdmin(admin.ModelAdmin[ProductSupplier]):
    pass


@admin.register(InternalOrderHistory)
class InternalOrderHistoryModelAdmin(admin.ModelAdmin[InternalOrderHistory]):
    pass


@admin.register(InternalOrderLineItem)
class InternalOrderProductModelAdmin(admin.ModelAdmin[InternalOrderLineItem]):
    pass


@admin.register(AdminModel)
class AdminModelAdmin(admin.ModelAdmin[AdminModel]):
    pass
