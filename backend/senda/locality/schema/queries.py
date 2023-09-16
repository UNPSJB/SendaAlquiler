import graphene

from senda.locality.models import LocalityModel
from senda.locality.schema.types import Locality


class LocalityQuery(graphene.ObjectType):
    localities = graphene.NonNull(graphene.List(graphene.NonNull(Locality)))

    def resolve_localities(self, info):
        return LocalityModel.objects.all()


class Query(LocalityQuery, graphene.ObjectType):
    pass
