from django.contrib import admin

from senda.client.models import ClientModel
from import_export.admin import ImportExportModelAdmin


@admin.register(ClientModel)
class ClientModelAdmin(ImportExportModelAdmin):
    search_fields = ("user",)
