from django.db import models
from senda.core.models import LocalityModel
from senda.core.validators import only_digits_validator


class SupplierModel(models.Model):
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

    def __str__(self):
        return self.name
