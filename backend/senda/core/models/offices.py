from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.models.localities import LocalityModel


class OfficeModel(TimeStampedModel):
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=20)
    house_number = models.CharField(max_length=10)
    locality = models.ForeignKey(LocalityModel, on_delete=models.CASCADE)
    note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return self.name
