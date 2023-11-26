from django.contrib import admin

from .models.clients import ClientModel
from .models.employees import EmployeeModel
from .models.localities import LocalityModel
from .models.offices import OfficeModel
from .models.order_internal import InternalOrderModel
from .models.order_supplier import (
    SupplierOrderModel,
    SupplierOrderProduct,
    SupplierOrderHistoryModel,
)
from .models.products import (
    BrandModel,
    ProductModel,
    ProductServiceModel,
    ProductStockInOfficeModel,
    ProductSupplierModel,
)
from .models.purchases import PurchaseItemModel, PurchaseModel
from .models.rental_contracts import (
    RentalContractHistoryModel,
    RentalContractItemModel,
    RentalContractModel,
)
from .models.suppliers import SupplierModel


@admin.register(BrandModel)
class BrandModelAdmin(admin.ModelAdmin[BrandModel]):
    search_fields = ("name",)


@admin.register(ClientModel)
class ClientModelAdmin(admin.ModelAdmin[ClientModel]):
    search_fields = ("email",)


@admin.register(EmployeeModel)
class EmployeeModelAdmin(admin.ModelAdmin[EmployeeModel]):
    search_fields = ("user",)


@admin.register(LocalityModel)
class LocalityModelAdmin(admin.ModelAdmin[LocalityModel]):
    list_display = ("name",)


@admin.register(OfficeModel)
class OfficeModelAdmin(admin.ModelAdmin[OfficeModel]):
    list_display = ("name",)


class ServiceModelInline(admin.TabularInline[ProductServiceModel, ProductModel]):
    model = ProductServiceModel


@admin.register(ProductModel)
class ProductModelAdmin(admin.ModelAdmin[ProductModel]):
    inlines = [
        ServiceModelInline,
    ]
    list_display = ("name",)
    raw_id_fields = ("brand",)


@admin.register(SupplierModel)
class SupplierModelAdmin(admin.ModelAdmin[SupplierModel]):
    list_display = ("name",)


@admin.register(SupplierOrderModel)
class OrderSupplierModelAdmin(admin.ModelAdmin[SupplierOrderModel]):
    list_display = ("id",)


@admin.register(InternalOrderModel)
class InternalOrderModelAdmin(admin.ModelAdmin[InternalOrderModel]):
    list_display = ("id",)


@admin.register(ProductStockInOfficeModel)
class ProductStockInOfficeModelAdmin(admin.ModelAdmin[ProductStockInOfficeModel]):
    list_display = ("product", "office", "stock")


@admin.register(RentalContractModel)
class RentalContractModelAdmin(admin.ModelAdmin[RentalContractModel]):
    readonly_fields = ("total",)


@admin.register(RentalContractItemModel)
class RentalContractItemModelAdmin(admin.ModelAdmin[RentalContractItemModel]):
    list_display = ("id", "rental_contract", "product", "quantity")


@admin.register(RentalContractHistoryModel)
class RentalContractHistoryModelAdmin(admin.ModelAdmin[RentalContractHistoryModel]):
    pass


@admin.register(ProductServiceModel)
class ServiceModelAdmin(admin.ModelAdmin[ProductServiceModel]):
    pass


@admin.register(PurchaseItemModel)
class PurchaseItemModelAdmin(admin.ModelAdmin[PurchaseItemModel]):
    pass


@admin.register(PurchaseModel)
class PurchaseModelAdmin(admin.ModelAdmin[PurchaseModel]):
    pass


@admin.register(SupplierOrderProduct)
class SupplierOrderProductAdmin(admin.ModelAdmin[SupplierOrderProduct]):
    pass


@admin.register(SupplierOrderHistoryModel)
class SupplierOrderHistoryModelAdmin(admin.ModelAdmin[SupplierOrderHistoryModel]):
    pass


@admin.register(ProductSupplierModel)
class ProductSupplierModelAdmin(admin.ModelAdmin[ProductSupplierModel]):
    pass
