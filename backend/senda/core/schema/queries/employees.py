import graphene

from senda.core.models.employees import EmployeeModel
from senda.core.schema.custom_types import Employee, PaginatedEmployeeQueryResult
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
    employees = graphene.NonNull(PaginatedEmployeeQueryResult, page=graphene.Int())

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

    def resolve_employee_by_id(self, info, id: str):
        return EmployeeModel.objects.filter(id=id).first()
