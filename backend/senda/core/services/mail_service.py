from typing import TYPE_CHECKING

from django.core.mail import send_mail
from django.template.loader import render_to_string

if TYPE_CHECKING:
    from senda.core.models.employees import EmployeeModel
    from users.models import UserModel


class MailService:
    @staticmethod
    def send_welcome_email(employee: "EmployeeModel", password: str):
        context = {
            "employee": employee,
            "password": password,
        }

        html_content = render_to_string("employees/welcome_email.html", context)
        text_content = render_to_string("employees/welcome_email.txt", context)

        send_mail(
            subject="Bienvenido a Senda",
            message=text_content,
            from_email="noreply@mg.senda.com",
            recipient_list=[employee.user.email],
            html_message=html_content,
            fail_silently=False,
        )

    @staticmethod
    def send_password_reset_email(user: "UserModel", reset_url: str):
        context = {
            "reset_url": reset_url,
        }

        html_content = render_to_string("employees/password_reset.html", context)
        text_content = render_to_string("employees/password_reset.txt", context)

        send_mail(
            subject="Recuperación de Contraseña - Senda",
            message=text_content,
            from_email="noreply@mg.senda.com",
            recipient_list=[user.email],
            html_message=html_content,
            fail_silently=False,
        )
