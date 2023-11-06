from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models.clients import ClientModel
from .models.employees import EmployeeModel
from .models.localities import LocalityModel
from .models.offices import OfficeModel
from .models.order_internal import InternalOrderModel
from .models.order_supplier import SupplierOrderModel
from .models.products import (
    BrandModel,
    ProductModel,
    ProductServiceModel,
    ProductStockInOfficeModel,
)
from .models.purchases import PurchaseItemModel, PurchaseModel
from .models.rental_contracts import (
    RentalContractHistoryModel,
    RentalContractItemModel,
    RentalContractModel,
)
from .models.suppliers import SupplierModel


@admin.register(BrandModel)
class BrandModelAdmin(ImportExportModelAdmin):
    search_fields = ("name",)


@admin.register(ClientModel)
class ClientModelAdmin(ImportExportModelAdmin):
    search_fields = ("email",)


@admin.register(EmployeeModel)
class EmployeeModelAdmin(ImportExportModelAdmin):
    search_fields = ("user",)


@admin.register(LocalityModel)
class LocalityModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)


@admin.register(OfficeModel)
class OfficeModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)


class ServiceModelInline(admin.TabularInline):
    model = ProductServiceModel


@admin.register(ProductModel)
class ProductModelAdmin(ImportExportModelAdmin):
    inlines = [
        ServiceModelInline,
    ]
    list_display = ("name",)
    raw_id_fields = ("brand",)


@admin.register(SupplierModel)
class SupplierModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)


@admin.register(SupplierOrderModel)
class OrderSupplierModelAdmin(ImportExportModelAdmin):
    list_display = ("id",)


@admin.register(InternalOrderModel)
class InternalOrderModelAdmin(ImportExportModelAdmin):
    list_display = ("id",)


@admin.register(ProductStockInOfficeModel)
class ProductStockInOfficeModelAdmin(ImportExportModelAdmin):
    list_display = ("product", "office", "stock")


@admin.register(RentalContractModel)
class RentalContractModelAdmin(ImportExportModelAdmin):
    pass


@admin.register(RentalContractItemModel)
class RentalContractItemModelAdmin(ImportExportModelAdmin):
    pass


@admin.register(RentalContractHistoryModel)
class RentalContractHistoryModelAdmin(ImportExportModelAdmin):
    pass


@admin.register(ProductServiceModel)
class ServiceModelAdmin(ImportExportModelAdmin):
    pass


@admin.register(PurchaseItemModel)
class PurchaseItemModelAdmin(ImportExportModelAdmin):
    pass


@admin.register(PurchaseModel)
class PurchaseModelAdmin(ImportExportModelAdmin):
    pass
