import graphene

from senda.core.models.employees import EmployeeModel
from senda.core.schema.custom_types import Employee, PaginatedEmployeeQueryResult
from utils.graphene import get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    employees = graphene.NonNull(PaginatedEmployeeQueryResult, page=graphene.Int())

    @employee_or_admin_required
    def resolve_employees(self, info, page: int):
        paginator, selected_page = get_paginated_model(
            EmployeeModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedEmployeeQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    employee_by_id = graphene.Field(Employee, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_employee_by_id(self, info, id: str):
        return EmployeeModel.objects.filter(id=id).first()

    employees_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_employees_csv(self, info: CustomInfo):
        employees = EmployeeModel.objects.all()
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID",
            "Nombre",
            "Apellido",
            "Email",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for employee in employees:
            writer.writerow(
                {
                    "ID": employee.id,
                    "Nombre": employee.user.first_name,
                    "Apellido": employee.user.last_name,
                    "Email": employee.user.email,
                }
            )

        return csv_buffer.getvalue()
