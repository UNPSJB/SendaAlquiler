import graphene
from django.core.exceptions import ObjectDoesNotExist

from senda.core.models.sale import Sale, Client, SaleItemDict
from senda.core.schema.custom_types import SaleType
from utils.graphene import input_object_type_to_dict, non_null_list_of

from senda.core.decorators import employee_or_admin_required, CustomInfo


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_CLIENT = "Debes especificar un cliente"
    CLIENT_NOT_FOUND = "El cliente no existe"
    INVALID_PRODUCT = "No se ingreso ningun producto"


class SaleOrderItemInput(graphene.InputObjectType):
    product = graphene.String(required=True)
    quantity = graphene.Int(required=True)
    discount = graphene.Int(required=True)


class CreateSaleInput(graphene.InputObjectType):
    client = graphene.ID(required=True)
    orders = non_null_list_of(SaleOrderItemInput)


class CreateSale(graphene.Mutation):
    sale = graphene.Field(SaleType)
    error = graphene.String()

    class Arguments:
        data = CreateSaleInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, data: CreateSaleInput):
        data_dict = input_object_type_to_dict(data)

        try:
            sale = Sale.objects.create_sale(
                client_id=data.client,
                office_id=int(info.context.office_id),
                sale_item_dicts=[
                    SaleItemDict(
                        product_id=item["product"],
                        quantity=item["quantity"],
                        discount=item["discount"],
                    )
                    for item in data_dict["orders"]
                ],
            )

            return CreateSale(sale=sale)
        except Exception as e:
            return CreateSale(error=e)


class DeleteSale(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            sale = Sale.objects.get(id=id)
            sale.delete()
        except ObjectDoesNotExist:
            return DeleteSale(success=False)

        return DeleteSale(success=True)


class Mutation(graphene.ObjectType):
    create_sale = CreateSale.Field()
    delete_sale = DeleteSale.Field()
