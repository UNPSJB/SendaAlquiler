import graphene

from senda.core.models.localities import LocalityModel
from senda.core.schema.types import Locality


class Query(graphene.ObjectType):
    localities = graphene.NonNull(graphene.List(graphene.NonNull(Locality)))

    def resolve_localities(self, info):
        return LocalityModel.objects.all()
