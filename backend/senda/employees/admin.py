from django.contrib import admin

from senda.employees.models import EmployeeModel
from import_export.admin import ImportExportModelAdmin


@admin.register(EmployeeModel)
class EmployeeModelAdmin(ImportExportModelAdmin):
    search_fields = ("user", )
