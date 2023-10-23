from django.contrib import admin

from senda.core.models import (
    EmployeeModel,
    LocalityModel,
    OfficeModel,
    ProductModel,
    ClientModel,
    BrandModel,
    SupplierModel,
    OrderSupplierModel,
    InternalOrderModel,
    ProductStockInOfficeModel,
    RentalContractModel,
    RentalContractItemModel,
    RentalContractHistoryModel,
    ServiceModel,
)
from import_export.admin import ImportExportModelAdmin


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
    model = ServiceModel


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


@admin.register(OrderSupplierModel)
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


@admin.register(ServiceModel)
class ServiceModelAdmin(ImportExportModelAdmin):
    pass
