from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.models.localities import LocalityModel


class OfficeModel(TimeStampedModel):
    """
    Represents an office or branch of Senda. Inherits from TimeStampedModel to include creation and modification timestamps.

    Attributes:
        name (models.CharField): The name of the office.
        street (models.CharField): The street on which the office is located.
        house_number (models.CharField): The house or building number of the office's location.
        locality (models.ForeignKey): A foreign key to the LocalityModel, representing the locality where the office is located. The relationship is set to cascade on delete.
        note (models.CharField): An optional field for additional notes about the office. It can be left blank or null.

    Methods:
        __str__: Returns a string representation of the OfficeModel instance, which is the name of the office.
    """

    name = models.CharField(max_length=255)
    street = models.CharField(max_length=20)
    house_number = models.CharField(max_length=10)
    locality = models.ForeignKey(LocalityModel, on_delete=models.CASCADE)
    note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return self.name
