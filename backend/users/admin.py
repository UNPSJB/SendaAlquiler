from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import UserModel


@admin.register(UserModel)
class UserAdmin(ImportExportModelAdmin):
    search_fields = ("email", "first_name", "last_name")
    list_display = ("email", "first_name", "last_name")
