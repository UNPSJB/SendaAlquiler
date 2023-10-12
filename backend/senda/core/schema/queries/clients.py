import graphene

from senda.core.models import ClientModel
from senda.core.schema.types import Client
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    clients = non_null_list_of(Client)

    def resolve_clients(self, info):
        return ClientModel.objects.all()

    client_by_id = graphene.Field(Client, id=graphene.ID(required=True))

    def resolve_client_by_id(self, info, id: str):
        return ClientModel.objects.filter(id=id).first()
