from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import EmployeeModelManager
from users.models import UserModel

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from senda.core.models.offices import OfficeModel


class EmployeeModel(TimeStampedModel):
    """
    Represents an employee in the system, extending the TimeStampedModel to include timestamps for creation and modification.

    Attributes:
        user (models.OneToOneField): A one-to-one relationship with the UserModel. This field represents the user account associated with the employee. The related name 'employee' is used for reverse querying.
        objects (EmployeeModelManager): Custom manager for EmployeeModel providing additional functionalities like creating and updating employee instances.

    Methods:
        __str__: Returns a string representation of the EmployeeModel instance, which is the email of the associated user.
    """

    offices: models.QuerySet["OfficeModel"]

    user = models.OneToOneField(
        UserModel, on_delete=models.CASCADE, related_name="employee"
    )

    def __str__(self) -> str:
        return self.user.email

    objects: EmployeeModelManager = EmployeeModelManager()


class EmployeeOfficeModel(TimeStampedModel):
    """
    Represents an employee office in the system, extending the TimeStampedModel to include timestamps for creation and modification.

    Attributes:
        employee (models.ForeignKey): A many-to-one relationship with the EmployeeModel. This field represents the employee associated with the office. The related name 'offices' is used for reverse querying.
        office (models.ForeignKey): A many-to-one relationship with the OfficeModel. This field represents the office associated with the employee. The related name 'employees' is used for reverse querying.

    Methods:
        __str__: Returns a string representation of the EmployeeOfficeModel instance, which is the email of the associated user.
    """

    employee = models.ForeignKey(
        EmployeeModel, on_delete=models.CASCADE, related_name="offices"
    )
    office = models.ForeignKey(
        "core.OfficeModel", on_delete=models.CASCADE, related_name="employees"
    )

    def __str__(self) -> str:
        return f"{self.employee.user.email} - {self.office.name}"
