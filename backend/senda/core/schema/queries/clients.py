import graphene

from senda.core.models import ClientModel
from senda.core.schema.types import Client


class Query(graphene.ObjectType):
    clients = graphene.NonNull(graphene.List(graphene.NonNull(Client)))

    def resolve_clients(self, info):
        return ClientModel.objects.all()
