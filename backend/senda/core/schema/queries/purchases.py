from typing import Any

import graphene
from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.custom_types import Purchase, PurchaseItem

from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.custom_types import (
    Purchase,
    PurchaseItem,
    PaginatedPurchaseQueryResult,
)
from utils.graphene import non_null_list_of, get_paginated_model


class Query(graphene.ObjectType):
    purchases = graphene.NonNull(PaginatedPurchaseQueryResult, page=graphene.Int())

    def resolve_purchases(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            PurchaseModel.objects.all().order_by("-created_on"), page
        )
        return PaginatedPurchaseQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    purchase_items = non_null_list_of(PurchaseItem)

    def resolve_purchase_items(self, info: Any):
        return PurchaseItemModel.objects.all()

    purchase_by_id = graphene.Field(Purchase, id=graphene.ID(required=True))

    def resolve_purchase_by_id(self, info: Any, id: str):
        return PurchaseModel.objects.filter(id=id).first()
