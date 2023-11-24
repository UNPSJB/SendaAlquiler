from typing import Any

import graphene

from senda.core.models.order_internal import InternalOrderModel
from senda.core.schema.custom_types import (
    PaginatedInternalOrderQueryResult,
)
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
    internal_orders = graphene.NonNull(PaginatedInternalOrderQueryResult, page=graphene.Int())

    def resolve_internal_orders(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            InternalOrderModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedInternalOrderQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )
