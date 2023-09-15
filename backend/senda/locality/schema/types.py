from graphene_django.types import DjangoObjectType

from senda.locality.models import LocalityModel


class Locality(DjangoObjectType):
    class Meta:
        model = LocalityModel
