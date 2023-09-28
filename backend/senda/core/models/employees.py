from django.db import models
from users.models import UserModel


class EmployeeModel(models.Model):
    user = models.OneToOneField(UserModel, on_delete=models.CASCADE, related_name="employee")

    def __str__(self) -> str:
        return self.user.email