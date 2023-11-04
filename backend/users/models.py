"""The Improved User Model
Mixin classes used to create this class may be found in mixins.py
The UserManager is found in managers.py
"""
from .model_mixins import AbstractUser

from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from senda.core.models.employees import EmployeeModel


class UserModel(AbstractUser):
    """
    The Improved User Model is intended to be used out-of-the-box.
    Do **not** import this model directly: use
    :py:func:`~django.contrib.auth.get_user_model`.
    """

    employee: Optional["EmployeeModel"]

    def is_employee(self):
        return hasattr(self, "employee") and self.employee is not None

    def get_employee(self):
        if self.is_employee():
            return self.employee

        return None
