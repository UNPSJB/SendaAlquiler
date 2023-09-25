from django.db import models
from users.models import UserModel
from senda.locality.models import LocalityModel


class ClientModel(models.Model):
    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name="client"
    )
    locality = models.ForeignKey(
        LocalityModel, on_delete=models.CASCADE, related_name="clients"
    )
    house_number = models.CharField(
        max_length=10, help_text="Número de la calle donde vive el cliente"
    )
    street_name = models.CharField(
        max_length=255, help_text="Nombre de la calle donde vive el cliente"
    )
    house_unit = models.CharField(
        max_length=10,
        help_text="Número de la casa o departamento",
        blank=True,
        null=True,
    )
    dni = models.CharField(
        max_length=20, help_text="Número de documento de identidad del cliente"
    )
    phone_code = models.CharField(
        max_length=10, help_text="Código de área del teléfono del cliente"
    )
    phone_number = models.CharField(
        max_length=10, help_text="Número de teléfono del cliente"
    )

    def __str__(self) -> str:
        return self.user.email
