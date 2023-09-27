import graphene

from senda.client.models import ClientModel
from senda.client.schema.types import Client


class ClientQuery(graphene.ObjectType):
    clients = graphene.NonNull(graphene.List(graphene.NonNull(Client)))

    def resolve_clients(self, info):
        return ClientModel.objects.all()


class Query(ClientQuery, graphene.ObjectType):
    pass
