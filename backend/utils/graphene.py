from typing import Any, Dict
from django.core.paginator import Paginator

import graphene
from django.db import models
from graphene.types import objecttype


def non_null_list_of(model_type: objecttype.BaseTypeMeta, **fields: Any):
    return graphene.NonNull(graphene.List(graphene.NonNull(model_type)), **fields)


def get_all_objects(model: models.Model):
    return model.objects.all()


def input_object_type_to_dict(data: graphene.InputObjectType) -> Dict[str, Any]:
    """Converts InputObjectType to dictionary."""
    return {field: getattr(data, field) for field in data._meta.fields}


def get_paginated_model(queryset, page_number: int, **kwargs):
    paginator = Paginator(queryset, 1)

    selected_page = paginator.page(page_number)
    if paginator.num_pages < page_number:
        selected_page = paginator.page(1)
    else:
        selected_page = paginator.page(page_number)

    return paginator, selected_page
