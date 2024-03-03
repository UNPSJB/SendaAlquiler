from typing import List

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderHistoryStatusChoices,
    SupplierOrderDetailsDict,
    SupplierOrderItemDetailsDict,
    CompletedOrderItemDetailsDict,
)
from senda.core.schema.custom_types import OrderSupplierType
from utils.graphene import non_null_list_of

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
                return CreateSupplierOrder(
                    error="La cantidad de productos debe ser mayor a 0"
                )

            items_data_dicts.append(
                SupplierOrderItemDetailsDict(
                    product_id=product.id,
                    quantity_ordered=product.quantity,
                )
            )

        try:
            supplier_order = SupplierOrder.objects.create_supplier_order(
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

        return CreateSupplierOrder(supplier_order=supplier_order)


class BaseChangeOrderSupplierStatus(graphene.Mutation):
    supplier_order = graphene.Field(OrderSupplierType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        note = graphene.String()

    @classmethod
    def get_supplier_order(cls, id: str):
        supplier_order = SupplierOrder.objects.filter(id=id).first()
        if supplier_order is None:
            raise Exception("No existe un pedido con ese ID")

        return supplier_order

    @classmethod
    def mutate(cls, self: "ReceiveSupplierOrder", info: CustomInfo, id: str):
        raise NotImplementedError()


class ReceiveSupplierOrderItemInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    quantity_received = graphene.Int(required=True, min_value=0)


class ReceiveSupplierOrder(graphene.Mutation):
    supplier_order = graphene.Field(OrderSupplierType)
    error = graphene.String()

    class Arguments(BaseChangeOrderSupplierStatus.Arguments):
        items = non_null_list_of(ReceiveSupplierOrderItemInput)

    @classmethod
    def get_supplier_order(cls, id: str):
        supplier_order = SupplierOrder.objects.filter(id=id).first()
        if supplier_order is None:
            raise Exception("No existe un pedido con ese ID")

        return supplier_order

    @classmethod
    def mutate(
        cls,
        self: "ReceiveSupplierOrder",
        info: CustomInfo,
        id: str,
        items: List[ReceiveSupplierOrderItemInput],
        note: str = None,
    ):
        try:
            order = cls.get_supplier_order(id)
            order.set_status(
                status=SupplierOrderHistoryStatusChoices.COMPLETED,
                responsible_user=info.context.user,
                note=note,
                completed_order_items=[
                    CompletedOrderItemDetailsDict(
                        item_id=int(item.id), quantity_received=item.quantity_received
                    )
                    for item in items
                ],
            )

            return BaseChangeOrderSupplierStatus(supplier_order=order)
        except Exception as e:
            return BaseChangeOrderSupplierStatus(error=str(e))


class CancelSupplierOrder(BaseChangeOrderSupplierStatus):
    @classmethod
    def mutate(
        cls,
        self: "CancelSupplierOrder",
        info: CustomInfo,
        id: str,
        note: str = None,
    ):
        try:
            order = cls.get_supplier_order(id)
            order.set_status(
                status=SupplierOrderHistoryStatusChoices.CANCELED,
                responsible_user=info.context.user,
                note=note,
            )

            return BaseChangeOrderSupplierStatus(supplier_order=order)
        except Exception as e:
            return BaseChangeOrderSupplierStatus(error=str(e))


class DeleteSupplierOrder(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            supplier_order = SupplierOrder.objects.get(id=id)
            supplier_order.delete()
        except ObjectDoesNotExist:
            return DeleteSupplierOrder(success=False)

        return DeleteSupplierOrder(success=True)


class Mutation(graphene.ObjectType):
    create_supplier_order = CreateSupplierOrder.Field()
    cancel_supplier_order = CancelSupplierOrder.Field()
    receive_supplier_order = ReceiveSupplierOrder.Field()
    delete_supplier_order = DeleteSupplierOrder.Field()
