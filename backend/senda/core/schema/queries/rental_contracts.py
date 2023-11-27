from typing import Any

import graphene

from senda.core.models.rental_contracts import RentalContractModel
from senda.core.schema.custom_types import (
    RentalContract,
    PaginatedRentalContractQueryResult,
)
from utils.graphene import get_paginated_model


class Query(graphene.ObjectType):
    rental_contracts = graphene.NonNull(
        PaginatedRentalContractQueryResult, page=graphene.Int()
    )

    def resolve_rental_contracts(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            RentalContractModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedRentalContractQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    contract_by_id = graphene.Field(RentalContract, id=graphene.ID(required=True))

    def resolve_contract_by_id(self, info: Any, id: str):
        return RentalContractModel.objects.filter(id=id).first()
