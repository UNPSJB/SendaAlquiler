from typing import Any

from django.db import models
from django.utils import timezone


class TimeStampedModel(models.Model):
    """
    TimeStampedModel
    An abstract base class model that provides self-managed "created_on" and
    "modified_on" fields.
    """

    created_on = models.DateTimeField(default=timezone.now, editable=False)
    modified_on = models.DateTimeField(default=timezone.now, editable=False)

    def save(self, *args: Any, **kwargs: Any) -> None:
        self.modified_on = timezone.now()
        super(TimeStampedModel, self).save(*args, **kwargs)

    class Meta:  # pyright: ignore
        abstract = True
