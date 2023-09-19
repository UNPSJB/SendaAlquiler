import graphene

from senda.office.models import OfficeModel
from senda.office.schema.types import Office


class OfficesQuery(graphene.ObjectType):
    offices = graphene.NonNull(graphene.List(graphene.NonNull(Office)))

    def resolve_offices(self, info):
        return OfficeModel.objects.all()


class Query(OfficesQuery, graphene.ObjectType):
    pass
