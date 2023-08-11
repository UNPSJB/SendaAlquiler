from django.contrib import admin

from .models import UserModel
from import_export.admin import ImportExportModelAdmin


@admin.register(UserModel)
class UserAdmin(ImportExportModelAdmin):
    search_fields = ("email", "first_name", "last_name")
    list_display = ("email", "first_name", "last_name")
