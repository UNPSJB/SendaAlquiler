from typing import Any

import graphene

from senda.core.models.clients import ClientModel
from senda.core.schema.custom_types import Client, PaginatedClientQueryResult, RentalContract
from utils.graphene import get_paginated_model, non_null_list_of


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

    all_clients = non_null_list_of(Client)

    def resolve_all_clients(self, info):
        return ClientModel.objects.all()

    client_by_id = graphene.Field(Client, id=graphene.ID(required=True))

    def resolve_client_by_id(self, info: Any, id: str):
        return ClientModel.objects.filter(id=id).first()

    client_exists = graphene.Field(
        graphene.NonNull(graphene.Boolean),
        email=graphene.String(),
        dni=graphene.String(),
    )

    def resolve_client_exists(self, info: Any, email: str = None, dni: str = None):
        if email is None and dni is None:
            return False

        if email is not None:
            return ClientModel.objects.filter(email=email).exists()

        if dni is not None:
            return ClientModel.objects.filter(dni=dni).exists()

    rental_contracts_by_client_id = non_null_list_of(
        RentalContract, id=graphene.ID(required=True)
    )

    def resolve_rental_contracts_by_client_id(self, info: Any, id: str):
        rental_contracts_by_client_id = ClientModel.objects.get(id=id)
        contracts = rental_contracts_by_client_id.rental_contracts.all()
        return contracts