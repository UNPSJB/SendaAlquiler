from graphene_django.types import DjangoObjectType

from senda.client.models import ClientModel


class Client(DjangoObjectType):
    class Meta:
        model = ClientModel
