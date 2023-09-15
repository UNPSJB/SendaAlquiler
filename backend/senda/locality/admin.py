from django.contrib import admin

from senda.locality.models import LocalityModel
from import_export.admin import ImportExportModelAdmin


@admin.register(LocalityModel)
class LocalityModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)
