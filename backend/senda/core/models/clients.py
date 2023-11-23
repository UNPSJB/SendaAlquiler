from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import ClientModelManager
from senda.core.models.localities import LocalityModel
from senda.core.validators import only_digits_validator


class ClientModel(TimeStampedModel):
    """
    Represents a client in the system. Inherits from TimeStampedModel to include creation and modification timestamps.

    Attributes:
        email (models.EmailField): The client's unique email address.
        first_name (models.CharField): The client's first name.
        last_name (models.CharField): The client's last name.
        locality (models.ForeignKey): A foreign key to the LocalityModel, representing the client's locality.
        house_number (models.CharField): The house number of the client's address, with a helper text explaining its purpose.
        street_name (models.CharField): The street name of the client's address, with a helper text explaining its purpose.
        house_unit (models.CharField): The house unit number, which can be blank or null, with a helper text explaining its purpose.
        dni (models.CharField): The client's unique document identification number, validated to ensure only digits are present.
        phone_code (models.CharField): The area code of the client's phone number, validated to ensure only digits are present.
        phone_number (models.CharField): The client's phone number, validated to ensure only digits are present.

    The `objects` attribute is an instance of ClientModelManager, which provides additional methods for managing client instances.
    """

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

    objects: ClientModelManager = ClientModelManager()  # pyright: ignore

    def __str__(self) -> str:
        return self.email
