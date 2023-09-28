import graphene

from senda.core.models.offices import OfficeModel
from senda.core.schema.types import Office


class Query(graphene.ObjectType):
    offices = graphene.NonNull(graphene.List(graphene.NonNull(Office)))

    def resolve_offices(self, info):
        return OfficeModel.objects.all()
