import graphene
from core.models.purchases import PurchaseHistoryModel, PurchaseItemModel, PurchaseModel
from core.schema.types import Purchase, PurchaseHistory, PurchaseItem

from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    purchases = non_null_list_of(Purchase)

    def resolve_purchases(self, info):
        return PurchaseModel.objects.all()

    purchase_items = non_null_list_of(PurchaseItem)

    def resolve_purchase_items(self, info):
        return PurchaseItemModel.objects.all()

    purchase_history = non_null_list_of(PurchaseHistory)

    def resolve_purchase_history(self, info):
        return PurchaseHistoryModel.objects.all()
