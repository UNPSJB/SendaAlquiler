from typing import Any,List

import graphene  # pyright: ignore
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.offices import OfficeModel
from senda.core.models.order_supplier import (
    SupplierOrderModel, 
    SupplierOrderHistoryModel, 
    SupplierOrderHistoryStatusChoices,
)
from senda.core.schema.custom_types import OrderSupplier
from senda.core.models.suppliers import SupplierModel
from utils.graphene import input_object_type_to_dict, non_null_list_of


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_SUPPLIER = "Debes especificar un proveedor"
    SUPPLIER_NOT_FOUND = "El proveedor no existe"


class CreateSupplierOrderProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)


class CreateSupplierOrderInput(graphene.InputObjectType):
    office_destination_id = graphene.ID(required=True)
    supplier_id = graphene.ID(required=True)
    products = non_null_list_of(CreateSupplierOrderProductInput)


def get_office(office_id: str):
    if office_id:
        try:
            return OfficeModel.objects.get(id=office_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
    else:
        return None


def get_supplier(supplier_id: str):
    if supplier_id:
        try:
            return SupplierModel.objects.get(id=supplier_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.SUPPLIER_NOT_FOUND)
    else:
        return None


class CreateSupplierOrder(graphene.Mutation):
    supplier_order = graphene.Field(SupplierOrderModel)
    error = graphene.String()

    class Arguments:
        data = CreateSupplierOrderInput(required=True)

    def mutate(self, info: Any, data: CreateSupplierOrderInput):
        data_dict = input_object_type_to_dict(data)

        try:
            office_destination_id = data_dict.pop("office_destination_id")
            office_destination = get_office(office_destination_id)
            if office_destination is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            supplier_id = data_dict.pop("supplier_id")
            supplier = get_supplier(supplier_id)
            if supplier is None:
                raise ValueError(ErrorMessages.INVALID_SUPPLIER)

            order_supplier = SupplierOrderModel.objects.create_supplier_order(
                supplier=supplier,
                office_destination=office_destination,
                user=info.context.user,
                **data_dict,
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateSupplierOrder(error=str(e))
        except Exception as e:
            return CreateSupplierOrder(error="Error desconocido")

        return CreateSupplierOrder(order_supplier=order_supplier)



class BaseChangeOrderSupplierStatus(graphene.Mutation):
    order_supplier = graphene.ID(OrderSupplier)
    error = graphene.String()

    class Arguments:
        order_supplier_id =graphene.ID(required=True)

    @classmethod
    def get_order_supplier(cls, id: str):
        order_supplier = SupplierOrderModel.objects.filter(id=id).first()
        if order_supplier is None:
            raise Exception("No existe un pedido con ese ID")

        return order_supplier
    
    @classmethod
    def check_order_supplier_status_is_one_of_and_update_status(
        cls,
        order:SupplierOrderModel,
        status: List[SupplierOrderHistoryStatusChoices],
        new_status: SupplierOrderHistoryStatusChoices,
    ):
        if (
            not order.current_history
            or order.current_history.status not in status
        ):
            raise Exception("La orden no esta en un estado valido")

        SupplierOrderHistoryModel.objects.create(
            order_supplier=order, status=new_status
        )

class ReceiveOrderSupplier(BaseChangeOrderSupplierStatus):
    @classmethod
    def mutate (cls, self: "ReceiveOrderSupplier", info: Any, order_supplier_id: str):
        try:
            order = cls.get_order_supplier(order_supplier_id)
            cls.check_order_supplier_status_is_one_of_and_update_status(
                order,
                [SupplierOrderHistoryStatusChoices.PENDING],
                SupplierOrderHistoryStatusChoices.COMPLETED,
            )

            return BaseChangeOrderSupplierStatus(order_supplier=order)
        except Exception as e:
            return BaseChangeOrderSupplierStatus(error=str(e))


class CancelOrderSupplier(BaseChangeOrderSupplierStatus):
    @classmethod
    def mutate (cls, self: "CancelOrderSupplier", info: Any, order_supplier_id: str):
        try:
            order = cls.get_order_supplier(order_supplier_id)
            cls.check_order_supplier_status_is_one_of_and_update_status(
                order,
                [SupplierOrderHistoryStatusChoices.PENDING],
                SupplierOrderHistoryStatusChoices.CANCELED,
            )

            return BaseChangeOrderSupplierStatus(order_supplier=order)
        except Exception as e:
            return BaseChangeOrderSupplierStatus(error=str(e))

class Mutation(graphene.ObjectType):
    create_supplier_order = CreateSupplierOrder.Field()
    cancel_order_supplier = CancelOrderSupplier.Field()
    receive_order_supplier = ReceiveOrderSupplier.Field()