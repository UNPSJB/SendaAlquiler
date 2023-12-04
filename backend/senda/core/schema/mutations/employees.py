from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.employees import EmployeeModel
from users.models import UserModel
from senda.core.schema.custom_types import Employee

from senda.core.decorators import employee_required, CustomInfo


class ErrorMessages:
    USER_NOT_FOUND = "El empleado no existe"


class CreateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)


class UpdateEmployeeInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    user_id = graphene.ID()


def get_user(user_id: str):
    if user_id:
        try:
            return UserModel.objects.get(id=user_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.USER_NOT_FOUND)
    else:
        return None


class CreateEmployee(graphene.Mutation):
    employee = graphene.Field(Employee)
    error = graphene.String()

    class Arguments:
        employee_data = CreateEmployeeInput(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, employee_data: CreateEmployeeInput):
        try:
            user = UserModel.objects.create_user(
                first_name=employee_data.first_name,
                last_name=employee_data.last_name,
                email=employee_data.email,
                password=employee_data.password,
            )

            employee = EmployeeModel.objects.create_employee(user=user)
            return CreateEmployee(employee=employee)
        except Exception as e:
            return CreateEmployee(error=e)


class DeleteEmployee(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            employee = EmployeeModel.objects.get(id=id)
            employee.delete()
            return DeleteEmployee(success=True)
        except Exception as e:
            return DeleteEmployee(success=False)


class SetSessionOfficeCookie(graphene.Mutation):
    class Arguments:
        office_id = graphene.ID()
        clear_cookie = graphene.Boolean(default_value=False)

    success = graphene.Boolean()

    @employee_required
    def mutate(self, info, office_id, clear_cookie):
        context = info.context
        if clear_cookie:
            context.cookie_to_clear = True
        else:
            context.office_id_to_set = office_id
        return SetSessionOfficeCookie(success=True)


class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()
    delete_employee = DeleteEmployee.Field()

    set_session_office_cookie = SetSessionOfficeCookie.Field()
