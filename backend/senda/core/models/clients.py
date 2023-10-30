from django.db import models

from senda.core.models.localities import LocalityModel
from senda.core.validators import only_digits_validator


class ClientModelManager(models.Manager["ClientModel"]):
    def create_client(
        self,
        email: str,
        first_name: str,
        last_name: str,
        locality: LocalityModel,
        house_number: str,
        street_name: str,
        house_unit: str,
        dni: str,
        phone_code: str,
        phone_number: str,
    ):
        if self.filter(email=email).exists():
            raise ValueError("Ya existe un cliente con ese email")

        if self.filter(dni=dni).exists():
            raise ValueError("Ya existe un cliente con ese DNI")

        return self.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            locality=locality,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            dni=dni,
            phone_code=phone_code,
            phone_number=phone_number,
        )

    def update_client(self, client, locality, **kwargs):
        client.locality = locality
        for field, value in kwargs.items():
            setattr(client, field, value)
        client.save()
        return client


class ClientModel(models.Model):
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

    objects: ClientModelManager = ClientModelManager()

    def __str__(self) -> str:
        return self.email
