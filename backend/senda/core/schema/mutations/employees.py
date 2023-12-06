import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.employees import EmployeeModel
from users.models import UserModel
from senda.core.schema.custom_types import Employee

from senda.core.decorators import employee_required, CustomInfo

from utils.graphene import non_null_list_of


class ErrorMessages:
    USER_NOT_FOUND = "El empleado no existe"


class CreateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    offices = non_null_list_of(graphene.ID)


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
            if UserModel.objects.filter(email=employee_data.email).exists():
                raise ValueError("El correo ya existe")

            user = UserModel.objects.create_user(
                first_name=employee_data.first_name,
                last_name=employee_data.last_name,
                email=employee_data.email,
                password=employee_data.password,
            )

            employee = EmployeeModel.objects.create_employee(
                user=user, offices=employee_data.offices
            )
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


class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()
    delete_employee = DeleteEmployee.Field()
