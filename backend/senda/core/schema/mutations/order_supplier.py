from typing import Any, List

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.offices import Office
from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderHistory,
    SupplierOrderHistoryStatusChoices,
    SupplierOrderDetailsDict,
    SupplierOrderItemDetailsDict,
)
from senda.core.schema.custom_types import OrderSupplierType
from senda.core.models.suppliers import SupplierModel
from utils.graphene import input_object_type_to_dict, non_null_list_of

from senda.core.decorators import employee_or_admin_required, CustomInfo


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


class CreateSupplierOrder(graphene.Mutation):
    supplier_order = graphene.Field(OrderSupplierType)
    error = graphene.String()

    class Arguments:
        data = CreateSupplierOrderInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, data: CreateSupplierOrderInput):
        office_id = info.context.office_id

        products: List[CreateSupplierOrderProductInput] = data.products
        items_data_dicts: List[SupplierOrderItemDetailsDict] = []
        for product in products:
            if product.quantity <= 0:
                return CreateSupplierOrder(error="La cantidad de productos debe ser mayor a 0")

            items_data_dicts.append(
                SupplierOrderItemDetailsDict(
                    product_id=product.id,
                    quantity_ordered=product.quantity,
                )
            )

        try:
            order_supplier = SupplierOrder.objects.create_supplier_order(
                items_data=items_data_dicts,
                order_data=SupplierOrderDetailsDict(
                    supplier_id=data.supplier_id,
                    target_office_id=int(office_id),
                    requested_for_date=None,
                    approximate_delivery_date=None,
                    note=None,
                ),
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateSupplierOrder(error=str(e))
        except Exception as e:
            return CreateSupplierOrder(error="Error desconocido")

        return CreateSupplierOrder(supplier_order=order_supplier)


class BaseChangeOrderSupplierStatus(graphene.Mutation):
    order_supplier = graphene.ID(required=True)
    error = graphene.String()

    class Arguments:
        order_supplier_id = graphene.ID(required=True)

    @classmethod
    def get_order_supplier(cls, id: str):
        order_supplier = SupplierOrder.objects.filter(id=id).first()
        if order_supplier is None:
            raise Exception("No existe un pedido con ese ID")

        return order_supplier

    @classmethod
    def check_order_supplier_status_is_one_of_and_update_status(
        cls,
        order: SupplierOrder,
        status: List[SupplierOrderHistoryStatusChoices],
        new_status: SupplierOrderHistoryStatusChoices,
    ):
        if (
            not order.latest_history_entry
            or order.latest_history_entry.status not in status
        ):
            raise Exception("La orden no esta en un estado valido")

        SupplierOrderHistory.objects.create(supplier_order=order, status=new_status)

    @classmethod
    def mutate(cls, self: "ReceiveOrderSupplier", info: Any, order_supplier_id: str):
        raise NotImplementedError()


class ReceiveOrderSupplier(BaseChangeOrderSupplierStatus):
    @classmethod
    def mutate(cls, self: "ReceiveOrderSupplier", info: Any, order_supplier_id: str):
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
    def mutate(cls, self: "CancelOrderSupplier", info: Any, order_supplier_id: str):
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


class DeleteSupplierOrder(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            order_supplier = SupplierOrder.objects.get(id=id)
            order_supplier.delete()
        except ObjectDoesNotExist:
            return DeleteSupplierOrder(success=False)

        return DeleteSupplierOrder(success=True)


class Mutation(graphene.ObjectType):
    create_supplier_order = CreateSupplierOrder.Field()
    cancel_order_supplier = CancelOrderSupplier.Field()
    receive_order_supplier = ReceiveOrderSupplier.Field()
    delete_supplier_order = DeleteSupplierOrder.Field()
