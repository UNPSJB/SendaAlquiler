from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.models.localities import LocalityModel
from senda.core.managers import SupplierModelManager
from senda.core.validators import only_digits_validator


class SupplierModel(TimeStampedModel):
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

    objects: SupplierModelManager = SupplierModelManager()