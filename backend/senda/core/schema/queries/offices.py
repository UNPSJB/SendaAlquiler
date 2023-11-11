from typing import Any

import graphene  # pyright: ignore

from senda.core.models.offices import OfficeModel
from senda.core.schema.custom_types import Office
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    offices = non_null_list_of(Office)

    def resolve_offices(self, info: Any):
        return OfficeModel.objects.all()

    office_by_id = graphene.Field(Office, id=graphene.ID(required=True))

    def resolve_office_by_id(self, info: Any, id: str):
        return OfficeModel.objects.filter(id=id).first()
