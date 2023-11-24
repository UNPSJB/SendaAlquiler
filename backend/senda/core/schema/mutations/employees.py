from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.employees import EmployeeModel
from users.models import UserModel
from senda.core.schema.custom_types import Employee


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

    def mutate(self, info: Any, employee_data: CreateEmployeeInput):
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


class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()
