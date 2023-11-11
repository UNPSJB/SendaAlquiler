from typing import Any

import graphene  # pyright: ignore

from senda.core.models.localities import LocalityModel
from senda.core.schema.custom_types import Locality


class Query(graphene.ObjectType):
    localities = graphene.NonNull(graphene.List(graphene.NonNull(Locality)))

    def resolve_localities(self, info: Any):
        return LocalityModel.objects.all()
