from django.contrib import admin

from senda.core.models import (
    EmployeeModel,
    LocalityModel,
    OfficeModel,
    ProductModel,
    ClientModel,
    SupplierModel
)
from import_export.admin import ImportExportModelAdmin


@admin.register(ClientModel)
class ClientModelAdmin(ImportExportModelAdmin):
    search_fields = ("user",)


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
    list_display = ("title",)

@admin.register(SupplierModel)
class SupplierModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)