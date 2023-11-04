from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import ClientModelManager
from senda.core.models.localities import LocalityModel
from senda.core.validators import only_digits_validator


class ClientModel(TimeStampedModel):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
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
        max_length=20,
        help_text="Número de documento de identidad del cliente",
        unique=True,
        validators=[
            only_digits_validator,
        ],
    )
    phone_code = models.CharField(
        max_length=10,
        help_text="Código de área del teléfono del cliente",
        validators=[
            only_digits_validator,
        ],
    )
    phone_number = models.CharField(
        max_length=10,
        help_text="Número de teléfono del cliente",
        validators=[
            only_digits_validator,
        ],
    )

    objects: ClientModelManager = ClientModelManager() # pyright: ignore

    def __str__(self) -> str:
        return self.email
