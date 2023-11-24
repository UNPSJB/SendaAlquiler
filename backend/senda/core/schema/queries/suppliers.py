from typing import Any

import graphene

from senda.core.models.order_supplier import SupplierOrderModel
from senda.core.models.suppliers import SupplierModel
from senda.core.schema.custom_types import (
    Supplier,
    PaginatedSupplierQueryResult,
    OrderSupplier,
)
from utils.graphene import get_paginated_model, non_null_list_of


class Query(graphene.ObjectType):
    all_suppliers = non_null_list_of(Supplier)

    def resolve_all_suppliers(self, info: Any):
        return SupplierModel.objects.all()

    suppliers = graphene.NonNull(PaginatedSupplierQueryResult, page=graphene.Int())

    def resolve_suppliers(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            SupplierModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_by_id = graphene.Field(Supplier, id=graphene.ID(required=True))

    def resolve_supplier_by_id(self, info: Any, id: str):
        return SupplierModel.objects.filter(id=id).first()

    supplier_orders_by_supplier_id = non_null_list_of(
        OrderSupplier, id=graphene.ID(required=True)
    )

    def resolve_supplier_order_by_supplier_id(self, info: Any, id: str):
        supplier_order_by_supplier_id = SupplierModel.objects.get(id=id)
        orders = supplier_order_by_supplier_id.supplier_orders_branch.all()
        return orders
