from django.db import models
from users.models import UserModel
from senda.core.models import LocalityModel


class SupplierModel(models.Model):
    cuit = models.CharField(max_length=12)
    name = models.CharField(max_length=30)
    phone_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=10)
    email = models.EmailField(unique=True)
    locality = models.ForeignKey(LocalityModel, on_delete=models.CASCADE)
    street = models.CharField(max_length=30)
    house_number = models.CharField(max_length=30)
    apartment = models.CharField(max_length=30)
    note = models.TextField()

    def __str__(self):
        return self.name
    