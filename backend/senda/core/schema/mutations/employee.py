import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.employees import EmployeeModel
from users.models import UserModel
from senda.core.schema.custom_types import EmployeeType

from senda.core.services.mail_service import MailService
from senda.core.services.token_service import TokenService

from senda.core.decorators import employee_or_admin_required, CustomInfo

from utils.graphene import non_null_list_of
from django.core.mail import send_mail
from django.conf import settings
import random


class ErrorMessages:
    USER_NOT_FOUND = "El empleado no existe"


class CreateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    offices = non_null_list_of(graphene.ID)


class UpdateEmployeeInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    email = graphene.String(required=True)
    offices = non_null_list_of(graphene.ID)


def get_user(user_id: int):
    if user_id:
        try:
            return UserModel.objects.get(id=user_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.USER_NOT_FOUND)
    else:
        return None


class CreateEmployee(graphene.Mutation):
    employee = graphene.Field(EmployeeType)
    error = graphene.String()

    class Arguments:
        employee_data = CreateEmployeeInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, employee_data: CreateEmployeeInput):
        try:
            if UserModel.objects.filter(email=employee_data.email).exists():
                raise ValueError("El correo ya existe")

            random_password = EmployeeModel.create_random_password()

            user = UserModel.objects.create_user(
                first_name=employee_data.first_name,
                last_name=employee_data.last_name,
                email=employee_data.email,
                password=random_password,
            )

            employee = EmployeeModel.objects.create_employee(
                user=user, offices=employee_data.offices
            )

            # send email with new password
            MailService.send_welcome_email(employee=employee, password=random_password)

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
    employee = graphene.Field(EmployeeType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        employee_data = UpdateEmployeeInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str, employee_data: UpdateEmployeeInput):
        try:
            employee = EmployeeModel.objects.get(id=id)

            user = get_user(employee.user.pk)
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


class SendPasswordRecoveryEmail(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)

    success = graphene.Boolean()
    error = graphene.String()

    def mutate(self, info, email):
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return SendPasswordRecoveryEmail(
                success=False, error="No existe un usuario con ese correo"
            )

        reset_token = TokenService.generate_token(user)
        reset_url = (
            f"{settings.FRONTEND_ADDRESS}/recuperar-contrasena?token={reset_token}"
        )

        try:
            MailService.send_password_reset_email(user=user, reset_url=reset_url)
        except Exception as e:
            print(e)
            return SendPasswordRecoveryEmail(
                success=False, error="Ha ocurrido un error al enviar el correo"
            )

        return SendPasswordRecoveryEmail(success=True, error=None)


class ChangePasswordLoggedIn(graphene.Mutation):
    success = graphene.Boolean()
    error = graphene.String()

    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, old_password, new_password):
        user = info.context.user
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return ChangePasswordLoggedIn(success=True, error=None)
        else:
            return ChangePasswordLoggedIn(
                success=False, error="La contraseña actual es incorrecta"
            )


class ChangePasswordWithToken(graphene.Mutation):
    class Arguments:
        token = graphene.String(required=True)
        new_password = graphene.String(required=True)

    success = graphene.Boolean()
    error = graphene.String()

    def mutate(self, info, token, new_password):
        check_token = TokenService.check_token(token)
        user = check_token["user"]
        if check_token["error"] is not None or user is None:
            return ChangePasswordWithToken(success=False, error="El token es inválido")

        # Update the password
        user.set_password(new_password)
        user.save()

        # Invalidate the token
        TokenService.invalidate_token(user)

        return ChangePasswordWithToken(success=True, error=None)


class UpdateMyBasicInfo(graphene.Mutation):
    success = graphene.Boolean()
    error = graphene.String()

    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, first_name, last_name, email):
        user = info.context.user

        if UserModel.objects.filter(email=email).exclude(id=user.id).exists():
            return UpdateMyBasicInfo(success=False, error="El correo ya existe")

        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()
        return UpdateMyBasicInfo(success=True, error=None)


class Mutation(graphene.ObjectType):
    create_employee = CreateEmployee.Field()
    delete_employee = DeleteEmployee.Field()
    update_employee = UpdateEmployee.Field()

    send_password_recovery_email = SendPasswordRecoveryEmail.Field()

    change_password_logged_in = ChangePasswordLoggedIn.Field()
    change_password_with_token = ChangePasswordWithToken.Field()

    update_my_basic_info = UpdateMyBasicInfo.Field()
