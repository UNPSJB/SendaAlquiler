import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.employees import EmployeeModel
from users.models import UserModel
from senda.core.schema.custom_types import Employee

from senda.core.decorators import employee_or_admin_required, CustomInfo

from utils.graphene import non_null_list_of
from django.core.mail import send_mail
from django.conf import settings


class ErrorMessages:
    USER_NOT_FOUND = "El empleado no existe"


class CreateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    offices = non_null_list_of(graphene.ID)


class UpdateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    offices = non_null_list_of(graphene.ID)


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

    @employee_or_admin_required
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

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            employee = EmployeeModel.objects.get(id=id)
            employee.delete()
            return DeleteEmployee(success=True)
        except Exception as e:
            return DeleteEmployee(success=False)


class UpdateEmployee(graphene.Mutation):
    employee = graphene.Field(Employee)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        employee_data = UpdateEmployeeInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str, employee_data: UpdateEmployeeInput):
        try:
            employee = EmployeeModel.objects.get(id=id)

            user = get_user(employee.user.id)
            user.first_name = employee_data.first_name
            user.last_name = employee_data.last_name
            user.email = employee_data.email
            user.save()

            EmployeeModel.objects.update_employee_offices(
                employee=employee, offices=employee_data.offices
            )

            return UpdateEmployee(employee=employee)
        except Exception as e:
            return UpdateEmployee(error=e)


class ResetEmployeePassword(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            user = get_user(id)

            random_password = UserModel.objects.make_random_password(
                length=6,
                allowed_chars="abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ0123456789",
            )

            user.set_password(random_password)
            user.save()

            # send email with new password
            try:
                send_mail(
                    "Nueva contraseña",
                    f"Tu nueva contraseña es: {random_password}",
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(e)
                return ResetEmployeePassword(success=False)

            return ResetEmployeePassword(success=True)
        except Exception as e:
            return ResetEmployeePassword(success=False)


class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()
    delete_employee = DeleteEmployee.Field()
    update_employee = UpdateEmployee.Field()
    reset_employee_password = ResetEmployeePassword.Field()
