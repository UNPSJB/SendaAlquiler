import graphene

from senda.core.models.suppliers import SupplierModel
from senda.core.schema.types import Supplier


class Query(graphene.ObjectType):
    suppliers = graphene.NonNull(graphene.List(graphene.NonNull(Supplier)))

    def resolve_suppliers(self, info):
        return SupplierModel.objects.all()

    supplier_by_id = graphene.Field(Supplier, id=graphene.ID(required=True))

    def resolve_supplier_by_id(self, info, id: str):
        return SupplierModel.objects.filter(id=id).first()
