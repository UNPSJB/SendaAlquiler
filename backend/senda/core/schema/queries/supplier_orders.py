from typing import Any

import graphene  # pyright: ignore

from senda.core.models.order_supplier import SupplierOrderModel 
from senda.core.schema.custom_types import OrderSupplier
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    supplier_orders = non_null_list_of(OrderSupplier)

    def resolve_supplier_orders(self, info: Any):
        return SupplierOrderModel.objects.all()

    supplier_order_by_id = graphene.Field(OrderSupplier, id=graphene.ID(required=True))

    def resolve_supplier_order_by_id(self, info: Any, id: str):
        return SupplierOrderModel.objects.filter(id=id).first()
