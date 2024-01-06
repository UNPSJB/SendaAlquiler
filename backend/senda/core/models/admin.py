from django.db import models
from users.models import UserModel


class AdminModel(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name='admin')
