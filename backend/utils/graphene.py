from typing import Any, Dict

import graphene  # pyright: ignore
from django.db import models
from graphene.types import objecttype


def non_null_list_of(model_type: objecttype.BaseTypeMeta, **fields: Any):
    return graphene.NonNull(graphene.List(graphene.NonNull(model_type)), **fields)


def get_all_objects(model: models.Model):
    return model.objects.all()


def input_object_type_to_dict(data: graphene.InputObjectType) -> Dict[str, Any]:
    """Converts InputObjectType to dictionary."""
    return {field: getattr(data, field) for field in data._meta.fields}
