from typing import Any

import graphene  # pyright: ignore

from senda.core.models.order_supplier import SupplierOrderModel
from senda.core.models.suppliers import SupplierModel
from senda.core.schema.custom_types import Supplier, OrderSupplier


class Query(graphene.ObjectType):
    suppliers = graphene.NonNull(graphene.List(graphene.NonNull(Supplier)))

    def resolve_suppliers(self, info: Any):
        return SupplierModel.objects.all()

    supplier_by_id = graphene.Field(Supplier, id=graphene.ID(required=True))

    def resolve_supplier_by_id(self, info: Any, id: str):
        return SupplierModel.objects.filter(id=id).first()

    # TODO supplier_order_by_supplier_id = graphene.NonNull(graphene.List(graphene.NonNull))

    supplier_order_by_supplier_id = graphene.Field(
        graphene.List(OrderSupplier), id=graphene.ID(required=True)
    )

    def resolve_supplier_order_by_supplier_id(self, info: Any, id: str):
        supplier_order_by_supplier_id = SupplierModel.objects.get(id=id)
        orders = supplier_order_by_supplier_id.supplier_orders_branch.all()
        return orders
