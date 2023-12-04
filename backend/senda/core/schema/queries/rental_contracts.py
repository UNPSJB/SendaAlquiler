from typing import Any

import graphene

from senda.core.models.rental_contracts import RentalContractModel
from senda.core.schema.custom_types import (
    RentalContract,
    PaginatedRentalContractQueryResult,
)
from utils.graphene import get_paginated_model

import csv
import io

from senda.core.decorators import employee_required, CustomInfo


class Query(graphene.ObjectType):
    rental_contracts = graphene.NonNull(
        PaginatedRentalContractQueryResult, page=graphene.Int()
    )

    @employee_required
    def resolve_rental_contracts(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            RentalContractModel.objects.filter(
                office=info.context.office_id
            ).order_by("-created_on"), page
        )

        return PaginatedRentalContractQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    contract_by_id = graphene.Field(RentalContract, id=graphene.ID(required=True))

    @employee_required
    def resolve_contract_by_id(self, info: CustomInfo, id: str):
        return RentalContractModel.objects.filter(id=id).first()

    rental_contracts_csv = graphene.NonNull(graphene.String)

    @employee_required
    def resolve_rental_contracts_csv(self, info: CustomInfo):
        rental_contracts = RentalContractModel.objects.all().prefetch_related(
            "rental_contract_items",
            "rental_contract_items__product",
            "client",
            "current_history",
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
            "Servicio asociado al producto",
            "Precio de servicio",
            "Cantidad de productos",
            "Precio total por producto y servicio a pagar",
            "Total del contrato",
        ]

        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for rental_contract in rental_contracts:
            for rental_contract_item in rental_contract.rental_contract_items.all():
                writer.writerow(
                    {
                        "ID de contrato": rental_contract.id,
                        "Fecha de creacion": rental_contract.created_on,
                        "Fecha de expiracion": rental_contract.expiration_date,
                        "Fecha de inicio": rental_contract.contract_start_datetime,
                        "Fecha de fin": rental_contract.contract_end_datetime,
                        "Sucursal": rental_contract.office.name,
                        "Estado": rental_contract.current_history.get_status_display(),
                        "Email del cliente": rental_contract.client.email,
                        "Nombre del cliente": rental_contract.client.first_name,
                        "Apellido del cliente": rental_contract.client.last_name,
                        "SKU de producto": rental_contract_item.product.sku,
                        "Nombre de producto": rental_contract_item.product.name,
                        "Marca de producto": rental_contract_item.product.brand.name,
                        "Precio de producto": rental_contract_item.product.price,
                        "Servicio asociado al producto": rental_contract_item.service.name
                        if rental_contract_item.service
                        else None,
                        "Precio de servicio": rental_contract_item.service.price
                        if rental_contract_item.service
                        else None,
                        "Cantidad de productos": rental_contract_item.quantity,
                        "Precio total por producto y servicio a pagar": rental_contract_item.total,
                        "Total del contrato": rental_contract.total,
                    }
                )

        return output.getvalue()
