from typing import Any

import graphene

from senda.core.models.suppliers import SupplierModel
from senda.core.schema.custom_types import Supplier, PaginatedSupplierQueryResult
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
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
