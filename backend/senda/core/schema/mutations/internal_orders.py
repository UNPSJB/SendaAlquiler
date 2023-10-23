import graphene
from senda.core.models import OfficeModel, InternalOrderModel
from senda.core.schema.types import InternalOrder
from senda.core.models.order_internal import InternalOrderProductsDict

from django.core.exceptions import ValidationError, ObjectDoesNotExist

from utils.graphene import non_null_list_of, input_object_type_to_dict


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


def get_office(office_id: str):
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

    def mutate(self, info, data: CreateInternalOrderInput):
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

            products: InternalOrderProductsDict = data_dict.pop("products")

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


class Mutation(graphene.ObjectType):
    create_internal_order = CreateInternalOrder.Field()
