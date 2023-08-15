from django.contrib import admin

from senda.products.models import ProductModel
from import_export.admin import ImportExportModelAdmin


@admin.register(ProductModel)
class ProductModelAdmin(ImportExportModelAdmin):
    list_display = ("title",)
