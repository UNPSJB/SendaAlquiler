from typing import Any

import graphene  # pyright: ignore

from senda.core.models.order_supplier import SupplierOrderModel
from senda.core.schema.custom_types import (
    OrderSupplier,
    PaginatedOrderSupplierQueryResult,
)
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
    supplier_orders = graphene.NonNull(
        PaginatedOrderSupplierQueryResult,
        page=graphene.Int(),
    )

    def resolve_supplier_orders(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            SupplierOrderModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedOrderSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_order_by_id = graphene.Field(OrderSupplier, id=graphene.ID(required=True))

    def resolve_supplier_order_by_id(self, info: Any, id: str):
        return SupplierOrderModel.objects.filter(id=id).first()
