from typing import Any

import graphene

from senda.core.models.contract import Contract
from senda.core.schema.custom_types import (
    ContractType,
    PaginatedContractQueryResult,
)
from utils.graphene import get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    contracts = graphene.NonNull(PaginatedContractQueryResult, page=graphene.Int())

    @employee_or_admin_required
    def resolve_contracts(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            Contract.objects.filter(office=info.context.office_id).order_by(
                "-created_on"
            ),
            page,
        )

        return PaginatedContractQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    contract_by_id = graphene.Field(ContractType, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_contract_by_id(self, info: CustomInfo, id: str):
        return Contract.objects.filter(id=id).first()

    contracts_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_contracts_csv(self, info: CustomInfo):
        contracts = Contract.objects.all().prefetch_related(
            "contract_items",
            "contract_items__product",
            "client",
            "latest_history_entry",
        )
        output = io.StringIO()

        fieldnames = [
            "ID de contrato",
            "Fecha de creacion",
            "Fecha de expiracion",
            "Fecha de inicio",
            "Fecha de fin",
            "Sucursal",
            "Estado",
            "Email del cliente",
            "Nombre del cliente",
            "Apellido del cliente",
            "SKU de producto",
            "Nombre de producto",
            "Marca de producto",
            "Precio de producto",
            # "Servicio asociado al producto",
            # "Precio de servicio",
            # "Cantidad de productos",
            # "Precio total por producto y servicio a pagar",
            # "Total del contrato",
        ]

        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for contract in contracts:
            for contract_item in contract.contract_items.all():
                writer.writerow(
                    {
                        "ID de contrato": contract.id,
                        "Fecha de creacion": contract.created_on,
                        "Fecha de expiracion": contract.expiration_date,
                        "Fecha de inicio": contract.contract_start_datetime,
                        "Fecha de fin": contract.contract_end_datetime,
                        "Sucursal": contract.office.name,
                        "Estado": contract.latest_history_entry.get_status_display(),
                        "Email del cliente": contract.client.email,
                        "Nombre del cliente": contract.client.first_name,
                        "Apellido del cliente": contract.client.last_name,
                        "SKU de producto": contract_item.product.sku,
                        "Nombre de producto": contract_item.product.name,
                        "Marca de producto": contract_item.product.brand.name,
                        "Precio de producto": contract_item.product.price,
                        # TODO: Add service to product
                    }
                )

        return output.getvalue()
