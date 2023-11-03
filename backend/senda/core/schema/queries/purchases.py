import graphene
from core.models.purchases import PurchaseItemModel, PurchaseModel
from core.schema.types import Purchase, PurchaseItem

from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    purchases = non_null_list_of(Purchase)

    def resolve_purchases(self, info):
        return PurchaseModel.objects.all()

    purchase_items = non_null_list_of(PurchaseItem)

    def resolve_purchase_items(self, info):
        return PurchaseItemModel.objects.all()
