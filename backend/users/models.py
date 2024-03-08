"""The Improved User Model
Mixin classes used to create this class may be found in mixins.py
The UserManager is found in managers.py
"""

from .model_mixins import AbstractUser

from django.db import models

from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from senda.core.models.employees import EmployeeModel
    from senda.core.models.admin import AdminModel


class UserModel(AbstractUser):
    """
    The Improved User Model is intended to be used out-of-the-box.
    Do **not** import this model directly: use
    :py:func:`~django.contrib.auth.get_user_model`.
    """

    employee: Optional["EmployeeModel"]
    admin: Optional["AdminModel"]

    token_version = models.IntegerField(default=0)

    def is_employee(self):
        return hasattr(self, "employee") and self.employee is not None

    def get_employee(self):
        if self.is_employee():
            return self.employee

        return None

    def is_admin(self):
        return hasattr(self, "admin") and self.admin is not None

    def get_admin(self):
        if self.is_admin():
            return self.admin

        return None
