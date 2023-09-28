from django.db import models
from senda.core.models.localities import LocalityModel


class OfficeModel(models.Model):
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=20)
    house_number = models.CharField(max_length=10)
    locality = models.ForeignKey(LocalityModel, on_delete=models.CASCADE)
    note = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name
