from django.db import models

from extensions.db.models import TimeStampedModel
from users.models import UserModel


class EmployeeModel(TimeStampedModel):
    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name="employee"
    )

    def __str__(self) -> str:
        return self.user.email
