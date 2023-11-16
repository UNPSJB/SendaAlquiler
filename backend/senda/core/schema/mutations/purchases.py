from typing import Any

import graphene  # pyright: ignore
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.purchases import PurchaseModel, PurchaseItemModel, ClientModel
from senda.core.models.offices import  OfficeModel
from senda.core.schema.custom_types import Product, PurchaseItem, Purchase
from utils.graphene import input_object_type_to_dict, non_null_list_of


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
    # office = graphene.ID(required=True)

def get_client(client: str):
    if client:
        try:
            return ClientModel.objects.get(id=client)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.CLIENT_NOT_FOUND)
    else:
        return None

# def get_office(office: str):
#     if office:
#         try:
#             return OfficeModel.objects.get(id=office)
#         except ObjectDoesNotExist:
#             raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
#     else:
#         return None

class CreatePurchase(graphene.Mutation):
    purchase = graphene.Field(Purchase)
    error = graphene.String()

    class Arguments:
        data = CreatePurchaseInput(required=True)

    def mutate(self, info: Any, data: CreatePurchaseInput):
        data_dict = input_object_type_to_dict(data)

        try:
            client = data_dict.pop("client")
            client = get_client(client)
            if client is None:
                raise ValueError(ErrorMessages.INVALID_CLIENT)

            # office = data_dict.pop("office")
            # office = get_office(office)
            # if office is None:
            #     raise ValueError(ErrorMessages.INVALID_OFFICE)

            purchase = PurchaseModel.objects.create_purchase(client=client, **data_dict)
            return CreatePurchase(purchase=purchase)
        except Exception as e:
            return CreatePurchase(error=e)


#TODO falta update


class Mutation(graphene.ObjectType):
    create_purchase = CreatePurchase.Field()
