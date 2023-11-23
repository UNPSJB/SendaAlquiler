from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import EmployeeModelManager
from users.models import UserModel


class EmployeeModel(TimeStampedModel):
    """
    Represents an employee in the system, extending the TimeStampedModel to include timestamps for creation and modification.

    Attributes:
        user (models.OneToOneField): A one-to-one relationship with the UserModel. This field represents the user account associated with the employee. The related name 'employee' is used for reverse querying.
        objects (EmployeeModelManager): Custom manager for EmployeeModel providing additional functionalities like creating and updating employee instances.

    Methods:
        __str__: Returns a string representation of the EmployeeModel instance, which is the email of the associated user.
    """

    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name="employee"
    )

    def __str__(self) -> str:
        return self.user.email

    objects: EmployeeModelManager = EmployeeModelManager()
