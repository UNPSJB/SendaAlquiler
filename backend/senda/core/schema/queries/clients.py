from typing import Any

import graphene

from senda.core.models.clients import ClientModel
from senda.core.schema.custom_types import (
    Client,
    PaginatedClientQueryResult,
    RentalContract,
    Purchase,
)
from utils.graphene import get_paginated_model, non_null_list_of

import csv
import io

from senda.core.decorators import employee_required, CustomInfo


class Query(graphene.ObjectType):
    clients = graphene.NonNull(PaginatedClientQueryResult, page=graphene.Int())

    @employee_required
    def resolve_clients(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            ClientModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedClientQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_clients = non_null_list_of(Client)

    @employee_required
    def resolve_all_clients(self, info: CustomInfo):
        return ClientModel.objects.all()

    client_by_id = graphene.Field(Client, id=graphene.ID(required=True))

    @employee_required
    def resolve_client_by_id(self, info: CustomInfo, id: str):
        return ClientModel.objects.filter(id=id).first()

    client_exists = graphene.Field(
        graphene.NonNull(graphene.Boolean),
        email=graphene.String(),
        dni=graphene.String(),
    )

    @employee_required
    def resolve_client_exists(
        self, info: CustomInfo, email: str = None, dni: str = None
    ):
        if email is None and dni is None:
            return False

        if email is not None:
            return ClientModel.objects.filter(email=email).exists()

        if dni is not None:
            return ClientModel.objects.filter(dni=dni).exists()

    clients_csv = graphene.NonNull(graphene.String)

    @employee_required
    def resolve_clients_csv(self, info: CustomInfo):
        clients = ClientModel.objects.all().prefetch_related("locality")
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID",
            "Nombre",
            "Apellido",
            "Email",
            "DNI",
            "Teléfono",
            "Localidad",
            "Calle",
            "Número de calle",
            "Número de casa",
            "Código Postal",
            "Provincia",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for client in clients:
            writer.writerow(
                {
                    "ID": client.id,
                    "Nombre": client.first_name,
                    "Apellido": client.last_name,
                    "Email": client.email,
                    "DNI": client.dni,
                    "Teléfono": client.phone_number,
                    "Localidad": client.locality.name,
                    "Calle": client.street_name,
                    "Número de calle": client.house_number,
                    "Número de casa": client.house_unit,
                    "Código Postal": client.locality.postal_code,
                    "Provincia": client.locality.state,
                }
            )

        return csv_buffer.getvalue()

    rental_contracts_by_client_id = non_null_list_of(
        RentalContract, id=graphene.ID(required=True)
    )

    @employee_required
    def resolve_rental_contracts_by_client_id(self, info: CustomInfo, id: str):
        rental_contracts_by_client_id = ClientModel.objects.get(id=id)
        contracts = rental_contracts_by_client_id.rental_contracts.all()
        return contracts

    purchases_by_client_id = non_null_list_of(Purchase, id=graphene.ID(required=True))

    @employee_required
    def resolve_purchases_by_client_id(self, info: Any, id: str):
        purchases_by_client_id = ClientModel.objects.get(id=id)
        purchases = purchases_by_client_id.purchases.all()
        return purchases
