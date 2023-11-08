from typing import Any

import graphene  # pyright: ignore
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.employees import EmployeeModel
from senda.core.schema.types import Employee
from utils.graphene import input_object_type_to_dict

class ErrorMessages:
    USER_NOT_FOUND = "El empleado no existe"

class CreateEmployeeInput(graphene.InputObjectType):
    user_id = graphene.ID(required=True) 

class UpdateEmployeeInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    user_id = graphene.ID()

def get_user(user_id: str):
    if user_id:
        try:
            return UserModel.objects.get(id=user_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.USER_NOT_FOUND)

class CreateEmployee(graphene.Mutation):
    employee = graphene.Field(Employee)
    error = graphene.String()

    class Arguments:
        employee_data = CreateEmployeeInput(required=True)

    def mutate(self, info: Any, employee_data: CreateEmployeeInput):
        try:
            employee_data_dict = input_object_type_to_dict(employee_data)
            employee = EmployeeModel.objects.create_employee(**employee_data_dict)
        except Exception as e:
            return CreateEmployee(error=e)

class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()