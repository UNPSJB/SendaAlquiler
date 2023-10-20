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


@admin.register(ProductModel)
class ProductModelAdmin(ImportExportModelAdmin):
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
