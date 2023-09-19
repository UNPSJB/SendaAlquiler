from graphene_django.types import DjangoObjectType

from senda.office.models import OfficeModel


class Office(DjangoObjectType):
    class Meta:
        model = OfficeModel
