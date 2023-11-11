from typing import Any, List

import graphene  # pyright: ignore
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from typing import Optional

from senda.core.managers import InternalOrderProductsDict
from senda.core.models.offices import OfficeModel
from senda.core.models.order_internal import (
    InternalOrderModel,
    InternalOrderHistoryModel,
    InternalOrderHistoryStatusChoices,
)
from senda.core.schema.custom_types import InternalOrder
from utils.graphene import input_object_type_to_dict, non_null_list_of


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"


class CreateInternalOrderProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity = graphene.Int(required=True, min_value=0)


class CreateInternalOrderInput(graphene.InputObjectType):
    office_branch_id = graphene.ID(required=True)
    office_destination_id = graphene.ID(required=True)
    products = non_null_list_of(CreateInternalOrderProductInput)


def get_office(office_id: str) -> Optional[OfficeModel]:
    if office_id:
        try:
            return OfficeModel.objects.get(id=office_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
    else:
        return None


class CreateInternalOrder(graphene.Mutation):
    internal_order = graphene.Field(InternalOrder)
    error = graphene.String()

    class Arguments:
        data = CreateInternalOrderInput(required=True)

    def mutate(self, info: Any, data: CreateInternalOrderInput):
        data_dict = input_object_type_to_dict(data)

        try:
            office_branch_id = data_dict.pop("office_branch_id")
            office_branch = get_office(office_branch_id)
            if office_branch is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            office_destination_id = data_dict.pop("office_destination_id")
            office_destination = get_office(office_destination_id)
            if office_destination is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            products: List[InternalOrderProductsDict] = data_dict.pop("products")

            internal_order = InternalOrderModel.objects.create_internal_order(
                office_branch=office_branch,
                office_destination=office_destination,
                products=products,
                user=None,
            )

        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateInternalOrder(error=str(e))
        except Exception as e:
            return CreateInternalOrder(error="Error desconocido")

        return CreateInternalOrder(internal_order=internal_order)


class BaseChangeOrderInternalStatus(graphene.Mutation):
    internal_order = graphene.ID(InternalOrder)
    error = graphene.String()

    class Arguments:
        internal_order_id =graphene.ID(required=True)

    @classmethod
    def get_internal_order(cls, id: str):
        internal_order = InternalOrderModel.objects.filter(id=id).first()
        if internal_order is None:
            raise Exception("No existe un pedido con ese ID")

        return internal_order
    
    @classmethod
    def check_internal_order_status_is_one_of_and_update_status(
        cls,
        order:InternalOrderModel,
        status: List[InternalOrderHistoryStatusChoices],
        new_status: InternalOrderHistoryStatusChoices,
    ):
        if (
            not order.current_history
            or order.current_history.status not in status
        ):
            raise Exception("La orden no esta en un estado valido")

        InternalOrderHistoryModel.objects.create(
            internal_order=order, status=new_status
        )


class InProgressInternalOrder(BaseChangeOrderInternalStatus):
    @classmethod
    def mutate (cls, self: "InProgressInternalOrder", info: Any, internal_order_id: str):
        try:
            order = cls.get_internal_order(internal_order_id)
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
    def mutate (cls, self: "ReceiveInternalOrder", info: Any, internal_order_id: str):
        try:
            order = cls.get_internal_order(internal_order_id)
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
    def mutate (cls, self: "CancelInternalOrder", info: Any, internal_order_id: str):
        try:
            order = cls.get_internal_order(internal_order_id)
            cls.check_internal_order_status_is_one_of_and_update_status(
                order,
                [InternalOrderHistoryStatusChoices.PENDING],
                InternalOrderHistoryStatusChoices.CANCELED,
            )

            return BaseChangeOrderInternalStatus(internal_order=order)
        except Exception as e:
            return BaseChangeOrderInternalStatus(error=str(e))


class Mutation(graphene.ObjectType):
    create_internal_order = CreateInternalOrder.Field()
    in_progress_internal_order = InProgressInternalOrder.Field()
    receive_internal_order = ReceiveInternalOrder.Field()
    cancel_internal_order = CancelInternalOrder.Field()

