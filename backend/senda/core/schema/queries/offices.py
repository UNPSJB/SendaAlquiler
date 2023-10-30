import graphene

from senda.core.models.offices import OfficeModel
from senda.core.schema.types import Office
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    offices = non_null_list_of(Office)

    def resolve_offices(self, info):
        return OfficeModel.objects.all()

    office_by_id = graphene.Field(Office, id=graphene.ID(required=True))

    def resolve_office_by_id(self, info, id: str):
        return OfficeModel.objects.filter(id=id).first()
