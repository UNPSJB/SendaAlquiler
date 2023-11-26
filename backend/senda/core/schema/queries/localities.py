from typing import Any

import graphene

from senda.core.models.localities import LocalityModel
from senda.core.schema.custom_types import PaginatedLocalityQueryResult, Locality
from utils.graphene import get_paginated_model, non_null_list_of


class Query(graphene.ObjectType):
    localities = graphene.NonNull(PaginatedLocalityQueryResult, page=graphene.Int())

    def resolve_localities(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            LocalityModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedLocalityQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_localities = non_null_list_of(Locality)

    def resolve_all_localities(self, info: Any):
        return LocalityModel.objects.all()
