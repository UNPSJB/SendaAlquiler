"""Mix-in Classes intended for use with Django Models"""
from typing import List

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.mail import send_mail
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class DjangoIntegrationMixin(TimeStampedModel):
    """Mixin provides fields for Django integration to work correctly
    Provides permissions for Django Admin integration, as well as date
    field used by authentication code.
    """

    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_(
            "Designates whether the user can log into the admin site."
        ),
    )
    date_joined = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


class FirstNameMixin(TimeStampedModel):
    """A mixin to provide an optional first name field"""

    first_name = models.CharField(max_length=200, blank=True)

    class Meta:
        abstract = True

    def get_full_name(self):
        """Return the first name of the user."""
        return self.first_name


class LastNameMixin(TimeStampedModel):
    """A mixin to provide an optional last name field"""

    last_name = models.CharField(max_length=200, blank=True)

    class Meta:
        abstract = True

    def get_full_name(self):
        """Return the last name of the user."""
        return self.last_name


class EmailAuthMixin(TimeStampedModel):
    """A mixin to use email as the username"""

    email = models.EmailField(_("email address"), max_length=254, unique=True)

    class Meta:
        abstract = True

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this User."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def clean(self):
        """Override default clean method to normalize email.
        Call :code:`super().clean()` if overriding.
        """
        super().clean()
        self.email = UserManager.normalize_email(self.email)


class AbstractUser(
    DjangoIntegrationMixin,
    FirstNameMixin,
    LastNameMixin,
    EmailAuthMixin,
    PermissionsMixin,
    AbstractBaseUser,
):
    """Abstract User base class to be inherited.
    Do not instantiate this class directly. The class provides a fully
    featured User model with admin-compliant permissions. Differs from
    Django's :class:`~django.contrib.auth.models.AbstractUser`:
    1. Login occurs with an email and password instead of username.
    2. Provides short_name and full_name instead of first_name and
       last_name.
    All fields other than email and password are optional.
    Sets :attr:`~django.db.models.Model.objects` to
    :class:`~improved_user.managers.UserManager`.
    Documentation about Django's
    :class:`~django.contrib.auth.models.AbstractBaseUser` may be helpful
    in understanding this class.
    """
    id = models.AutoField(primary_key=True)
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as "
            "active. Unselect this instead of deleting accounts."
        ),
    )

    objects = UserManager()
   
    # misnomer; fields Dj prompts for when user calls createsuperuser
    # https://docs.djangoproject.com/en/stable/topics/auth/customizing/#django.contrib.auth.models.CustomUser.REQUIRED_FIELDS
    REQUIRED_FIELDS: List[str] = []

    class Meta:
        abstract = True
        verbose_name = _("user")
        verbose_name_plural = _("users")
