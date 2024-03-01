from typing import Any, List

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from typing import Optional

from senda.core.models.offices import Office
from senda.core.models.order_internal import (
    InternalOrder,
    InternalOrderHistory,
    InternalOrderHistoryStatusChoices,
    InternalOrderDetailsDict,
    InternalOrderItemDetailsDict,
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
                    contract_item_product_allocation_id=None,
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

    @classmethod
    def get_internal_order(cls, id: str):
        internal_order = InternalOrder.objects.filter(id=id).first()
        if internal_order is None:
            raise Exception("No existe un pedido con ese ID")

        return internal_order

    @classmethod
    def check_internal_order_status_is_one_of_and_update_status(
        cls,
        order: InternalOrder,
        status: List[InternalOrderHistoryStatusChoices],
        new_status: InternalOrderHistoryStatusChoices,
    ):
        if (
            not order.latest_history_entry
            or order.latest_history_entry.status not in status
        ):
            raise Exception("La orden no esta en un estado valido")

        InternalOrderHistory.objects.create(internal_order=order, status=new_status)

    @classmethod
    def mutate(cls, self: "BaseChangeOrderInternalStatus", info: Any, id: str):
        raise NotImplementedError()


class InProgressInternalOrder(BaseChangeOrderInternalStatus):
    @classmethod
    def mutate(cls, self: "InProgressInternalOrder", info: Any, id: str):
        try:
            order = cls.get_internal_order(id)
            cls.check_internal_order_status_is_one_of_and_update_status(
                order,
                [InternalOrderHistoryStatusChoices.PENDING],
                InternalOrderHistoryStatusChoices.IN_PROGRESS,
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class ReceiveInternalOrder(BaseChangeOrderInternalStatus):
    @classmethod
    def mutate(cls, self: "ReceiveInternalOrder", info: Any, id: str):
        try:
            order = cls.get_internal_order(id)
            cls.check_internal_order_status_is_one_of_and_update_status(
                order,
                [InternalOrderHistoryStatusChoices.IN_PROGRESS],
                InternalOrderHistoryStatusChoices.COMPLETED,
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class CancelInternalOrder(BaseChangeOrderInternalStatus):
    @classmethod
    def mutate(cls, self: "CancelInternalOrder", info: Any, id: str):
        try:
            order = cls.get_internal_order(id)
            cls.check_internal_order_status_is_one_of_and_update_status(
                order,
                [InternalOrderHistoryStatusChoices.PENDING],
                InternalOrderHistoryStatusChoices.CANCELED,
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class DeleteInternalOrder(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
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