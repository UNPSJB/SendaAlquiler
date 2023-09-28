import graphene

from senda.core.models import SupplierModel
from senda.core.schema.types import Supplier


class Query(graphene.ObjectType):
    suppliers = graphene.NonNull(graphene.List(graphene.NonNull(Supplier)))

    def resolve_suppliers(self, info):
        return SupplierModel.objects.all()
