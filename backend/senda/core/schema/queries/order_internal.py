import graphene

from senda.core.models.order_internal import InternalOrderModel
from senda.core.schema.types import InternalOrder

from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    internal_orders = non_null_list_of(InternalOrder)

    def resolve_internal_orders(self, info):
        return InternalOrderModel.objects.all()
