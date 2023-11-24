from typing import Any

import graphene

from senda.core.models.clients import ClientModel
from senda.core.schema.custom_types import Client, PaginatedClientQueryResult
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
    clients = graphene.NonNull(PaginatedClientQueryResult, page=graphene.Int())

    def resolve_clients(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            ClientModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedClientQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    client_by_id = graphene.Field(Client, id=graphene.ID(required=True))

    def resolve_client_by_id(self, info: Any, id: str):
        return ClientModel.objects.filter(id=id).first()
