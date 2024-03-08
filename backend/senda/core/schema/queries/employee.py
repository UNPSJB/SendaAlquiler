import graphene

from senda.core.models.employees import EmployeeModel
from senda.core.schema.custom_types import EmployeeType, PaginatedEmployeeQueryResult
from utils.graphene import get_paginated_model

from django.db.models import Value
from django.db.models.functions import Concat
from django.db import models
import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo

from senda.core.services.token_service import TokenService


class ValidateToken(graphene.ObjectType):
    is_valid = graphene.Boolean()
    error = graphene.String()


class Query(graphene.ObjectType):
    employees = graphene.NonNull(
        PaginatedEmployeeQueryResult,
        page=graphene.Int(),
        query=graphene.String(),
    )

    @employee_or_admin_required
    def resolve_employees(
        self,
        info,
        page: int,
        query: str = None,
    ):
        results = EmployeeModel.objects.all().order_by("-created_on")

        if query is not None:
            results = results.annotate(
                full_name=Concat("user__first_name", Value(" "), "user__last_name")
            ).filter(
                models.Q(user__first_name__icontains=query)
                | models.Q(user__last_name__icontains=query)
                | models.Q(user__email__icontains=query)
                | models.Q(user__full_name__icontains=query)
            )

        paginator, selected_page = get_paginated_model(results, page)

        return PaginatedEmployeeQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    employee_by_id = graphene.Field(EmployeeType, id=graphene.ID(required=True))

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

    validate_token = graphene.Field(
        ValidateToken,
        token=graphene.String(required=True),
    )

    def resolve_validate_token(self, info, token):
        check_token = TokenService.check_token(token)
        if check_token["user"] is not None:
            return ValidateToken(is_valid=True, error=None)

        return ValidateToken(is_valid=False, error="El token no es válido")
