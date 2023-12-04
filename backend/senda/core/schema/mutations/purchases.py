from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.purchases import PurchaseModel, PurchaseItemModel, ClientModel
from senda.core.models.offices import OfficeModel
from senda.core.schema.custom_types import Product, PurchaseItem, Purchase
from utils.graphene import input_object_type_to_dict, non_null_list_of

from senda.core.decorators import employee_required, CustomInfo


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_CLIENT = "Debes especificar un cliente"
    CLIENT_NOT_FOUND = "El cliente no existe"
    INVALID_PRODUCT = "No se ingreso ningun producto"


class PurchaseItemsInput(graphene.InputObjectType):
    product = graphene.String(required=True)
    quantity = graphene.Int(required=True)


class CreatePurchaseInput(graphene.InputObjectType):
    client = graphene.ID(required=True)
    products = non_null_list_of(PurchaseItemsInput)


def get_client(client: str):
    if client:
        try:
            return ClientModel.objects.get(id=client)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.CLIENT_NOT_FOUND)
    else:
        return None


class CreatePurchase(graphene.Mutation):
    purchase = graphene.Field(Purchase)
    error = graphene.String()

    class Arguments:
        data = CreatePurchaseInput(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, data: CreatePurchaseInput):
        data_dict = input_object_type_to_dict(data)

        try:
            client = data_dict.pop("client")
            client = get_client(client)
            if client is None:
                raise ValueError(ErrorMessages.INVALID_CLIENT)

            purchase = PurchaseModel.objects.create_purchase(
                client=client, office=info.context.office_id, **data_dict
            )
            return CreatePurchase(purchase=purchase)
        except Exception as e:
            return CreatePurchase(error=e)


class DeletePurchase(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            purchase = PurchaseModel.objects.get(id=id)
            purchase.delete()
        except ObjectDoesNotExist:
            return DeletePurchase(success=False)

        return DeletePurchase(success=True)


class Mutation(graphene.ObjectType):
    create_purchase = CreatePurchase.Field()
    delete_purchase = DeletePurchase.Field()
