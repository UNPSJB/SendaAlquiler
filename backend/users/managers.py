"""User Manager used by Improved User; may be extended"""

from typing import TYPE_CHECKING, Any, Tuple, Union

from django.contrib.auth.models import BaseUserManager

if TYPE_CHECKING:
    from .models import UserModel


class UserManager(BaseUserManager['UserModel']):
    """Manager for Users; overrides create commands for new fields
    Meant to be interacted with via the user model.
    .. code:: python
        User.objects  # the UserManager
        User.objects.all()  # has normal Manager/UserManager methods
        User.objects.create_user  # overrides methods for Improved User
    Set to :attr:`~django.db.models.Model.objects` by
    :attr:`~improved_user.models.AbstractUser`
    """

    def _create_user(
            self, email: str, password: Union[str, None] = None, is_staff: bool = False, is_superuser: bool = False, **extra_fields: Any
    ) -> 'UserModel':
        """Save a User with improved user fields; helper method"""
        if not email:
            raise ValueError("An email address must be provided.")
        if "username" in extra_fields:
            raise ValueError(
                "The Improved User model does not have a username; "
                "it uses only email"
            )

        user = self.model(
            email=self.normalize_email(email),
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email: str, password: Union[str, None] = None, **extra_fields: Any) -> "UserModel":
        """Save new User with email and password"""
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def user_exists(self, email: str) -> bool:
        user = self.model.objects.filter(email=email).first()
        return user is not None

    def get_or_create_user(self, email: str, password: str, **extra_fields: Any) -> Tuple['UserModel', bool]:
        user = self.filter(email=email).first()
        existed = True

        if user is None:
            existed = False
            user = self.create_user(email, password, **extra_fields)

        return user, existed

    def create_superuser(self, email: str, password: str, **extra_fields: Any) -> 'UserModel':
        """Save new User with is_staff and is_superuser set to True"""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)
