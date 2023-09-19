from django.contrib import admin

from senda.office.models import OfficeModel
from import_export.admin import ImportExportModelAdmin


@admin.register(OfficeModel)
class OfficeModelAdmin(ImportExportModelAdmin):
    list_display = ("name",)
