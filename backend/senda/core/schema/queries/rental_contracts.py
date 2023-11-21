from typing import Any

import graphene  # pyright: ignore

from senda.core.models.rental_contracts import RentalContractModel
from senda.core.schema.custom_types import RentalContract
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    rental_contracts = non_null_list_of(RentalContract)

    def resolve_rental_contracts(self, info: Any):
        return RentalContractModel.objects.all()
    
    contract_by_id = graphene.Field(RentalContract, id=graphene.ID(required=True))

    def resolve_contract_by_id(self, info: Any, id: str):
        return RentalContractModel.objects.filter(id=id).first()