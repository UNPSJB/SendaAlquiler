from typing import Any, List

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from typing import Optional

from senda.core.models.offices import Office
from senda.core.models.order_internal import (
    InternalOrder,
    InternalOrderHistoryStatusChoices,
    InternalOrderDetailsDict,
    InternalOrderItemDetailsDict,
    CompletedOrderItemDetailsDict,
    InProgressOrderItemDetailsDict,
)
from senda.core.schema.custom_types import InternalOrderType
from utils.graphene import non_null_list_of

from senda.core.decorators import employee_or_admin_required, CustomInfo


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"


class CreateInternalOrderProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity = graphene.Int(required=True, min_value=0)


class CreateInternalOrderInput(graphene.InputObjectType):
    source_office_id = graphene.ID(required=True)
    target_office_id = graphene.ID(required=True)
    products = non_null_list_of(CreateInternalOrderProductInput)


def get_office(office_id: str) -> Optional[Office]:
    if office_id:
        try:
            return Office.objects.get(id=office_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
    else:
        return None


class CreateInternalOrder(graphene.Mutation):
    internal_order = graphene.Field(InternalOrderType)
    error = graphene.String()

    class Arguments:
        data = CreateInternalOrderInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, data: CreateInternalOrderInput):
        products: List[CreateInternalOrderProductInput] = data.products
        items_data_dicts: List[InternalOrderItemDetailsDict] = []
        for product in products:
            if product.quantity <= 0:
                return CreateInternalOrder(
                    error="La cantidad de productos debe ser mayor a 0"
                )

            items_data_dicts.append(
                InternalOrderItemDetailsDict(
                    product_id=product.id,
                    quantity_ordered=product.quantity,
                )
            )

        try:
            internal_order = InternalOrder.objects.create_internal_order(
                items_data=items_data_dicts,
                order_data=InternalOrderDetailsDict(
                    approximate_delivery_date=None,
                    note=None,
                    requested_for_date=None,
                    source_office_id=data.source_office_id,
                    target_office_id=data.target_office_id,
                ),
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateInternalOrder(error=str(e))
        except Exception as e:
            return CreateInternalOrder(error="Error desconocido")

        return CreateInternalOrder(internal_order=internal_order)


class BaseChangeOrderInternalStatus(graphene.Mutation):
    internal_order = graphene.Field(InternalOrderType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        note = graphene.String()

    @classmethod
    def get_internal_order(cls, id: str):
        internal_order = InternalOrder.objects.filter(id=id).first()
        if internal_order is None:
            raise Exception("No existe un pedido con ese ID")

        return internal_order

    @classmethod
    def mutate(
        cls,
        self: "BaseChangeOrderInternalStatus",
        info: CustomInfo,
        id: str,
        note: str = None,
    ):
        raise NotImplementedError()


class InProgressInternalOrderItemInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity_sent = graphene.Int(required=True, min_value=0)


class InProgressInternalOrder(graphene.Mutation):
    internal_order = graphene.Field(InternalOrderType)
    error = graphene.String()

    class Arguments(BaseChangeOrderInternalStatus.Arguments):
        items = non_null_list_of(InProgressInternalOrderItemInput)

    @classmethod
    def get_internal_order(cls, id: str):
        internal_order = InternalOrder.objects.filter(id=id).first()
        if internal_order is None:
            raise Exception("No existe un pedido con ese ID")

        return internal_order

    @classmethod
    def mutate(
        cls,
        self: "InProgressInternalOrder",
        info: CustomInfo,
        id: str,
        items: List[InProgressInternalOrderItemInput],
        note: str = None,
    ):
        try:
            order = cls.get_internal_order(id)
            order.set_status(
                status=InternalOrderHistoryStatusChoices.IN_PROGRESS,
                responsible_user=info.context.user,
                note=note,
                in_progress_order_items=[
                    InProgressOrderItemDetailsDict(
                        item_id=int(item.id), quantity_sent=item.quantity_sent
                    )
                    for item in items
                ],
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class ReceiveInternalOrderItemInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity_received = graphene.Int(required=True, min_value=0)


class ReceiveInternalOrder(graphene.Mutation):
    internal_order = graphene.Field(InternalOrderType)
    error = graphene.String()

    class Arguments(BaseChangeOrderInternalStatus.Arguments):
        items = non_null_list_of(ReceiveInternalOrderItemInput)

    @classmethod
    def get_internal_order(cls, id: str):
        internal_order = InternalOrder.objects.filter(id=id).first()
        if internal_order is None:
            raise Exception("No existe un pedido con ese ID")

        return internal_order

    @classmethod
    def mutate(
        cls,
        self: "ReceiveInternalOrder",
        info: CustomInfo,
        id: str,
        items: List[ReceiveInternalOrderItemInput],
        note: str = None,
    ):
        try:
            order = cls.get_internal_order(id)
            order.set_status(
                status=InternalOrderHistoryStatusChoices.COMPLETED,
                responsible_user=info.context.user,
                note=note,
                completed_order_items=[
                    CompletedOrderItemDetailsDict(
                        item_id=int(item.id), quantity_received=item.quantity_received
                    )
                    for item in items
                ],
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class CancelInternalOrder(BaseChangeOrderInternalStatus):
    @classmethod
    def mutate(
        cls, self: "CancelInternalOrder", info: CustomInfo, id: str, note: str = None
    ):
        try:
            order = cls.get_internal_order(id)
            order.set_status(
                status=InternalOrderHistoryStatusChoices.CANCELED,
                responsible_user=info.context.user,
                note=note,
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class DeleteInternalOrder(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str, note: str = None):
        try:
            order = InternalOrder.objects.get(id=id)
            order.delete()
            return DeleteInternalOrder(success=True)
        except Exception as e:
            return DeleteInternalOrder(success=False)


class Mutation(graphene.ObjectType):
    create_internal_order = CreateInternalOrder.Field()
    in_progress_internal_order = InProgressInternalOrder.Field()
    receive_internal_order = ReceiveInternalOrder.Field()
    cancel_internal_order = CancelInternalOrder.Field()
    delete_internal_order = DeleteInternalOrder.Field()
