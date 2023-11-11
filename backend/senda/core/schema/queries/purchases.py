from typing import Any

import graphene  # pyright: ignore
from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.types import Purchase, PurchaseItem

from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.custom_types import Purchase, PurchaseItem
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    purchases = non_null_list_of(Purchase)

    def resolve_purchases(self, info: Any):
        return PurchaseModel.objects.all()

    purchase_items = non_null_list_of(PurchaseItem)

    def resolve_purchase_items(self, info: Any):
        return PurchaseItemModel.objects.all()
