from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.models.localities import LocalityModel
from senda.core.validators import only_digits_validator


class SupplierModel(TimeStampedModel):
    """
    Represents a supplier in the Senda system. Inherits from TimeStampedModel for creation and modification timestamps.

    Attributes:
        cuit (models.CharField): The CUIT (unique tax identification code) of the supplier.
        name (models.CharField): The name of the supplier.
        email (models.EmailField): The unique email address of the supplier.
        locality (models.ForeignKey): A foreign key to LocalityModel, representing the locality where the supplier is located.
        house_number (models.CharField): The house number of the supplier's address, with a helper text explaining its purpose.
        street_name (models.CharField): The street name of the supplier's address, with a helper text explaining its purpose.
        house_unit (models.CharField): The house unit number, which can be blank or null, with a helper text explaining its purpose.
        phone_code (models.CharField): The area code of the supplier's phone number, validated to ensure only digits are present.
        phone_number (models.CharField): The phone number of the supplier, validated to ensure only digits are present.
        note (models.TextField): An optional field for additional notes about the supplier.

    Methods:
        __str__: Returns a string representation of the supplier, which is its name.
    """

    cuit = models.CharField(max_length=12)
    name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)

    locality = models.ForeignKey(
        LocalityModel, on_delete=models.CASCADE, related_name="suppliers"
    )
    house_number = models.CharField(
        max_length=10, help_text="Número de la calle donde vive el proveedor"
    )
    street_name = models.CharField(
        max_length=255, help_text="Nombre de la calle donde vive el proveedor"
    )
    house_unit = models.CharField(
        max_length=10,
        help_text="Número de la casa o departamento",
        blank=True,
        null=True,
    )
    phone_code = models.CharField(
        max_length=10,
        help_text="Código de área del teléfono del proveedor",
        validators=[
            only_digits_validator,
        ],
    )
    phone_number = models.CharField(
        max_length=10,
        help_text="Número de teléfono del proveedor",
        validators=[
            only_digits_validator,
        ],
    )

    note = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name
