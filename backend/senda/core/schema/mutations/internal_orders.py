import graphene
from senda.core.models import OfficeModel, InternalOrderModel
from senda.core.schema.types import Office

from django.core.exceptions import ValidationError, ObjectDoesNotExist


class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"

class CreateInternalOrderProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    stock = graphene.Int(required=True)


class CreateInternalOrderInput(graphene.InputObjectType):

    office_branch_id = graphene.ID(required=True)
    office_destination_id = graphene.ID(required=True)
    products = graphene.NonNull(graphene.List(graphene.NonNull(CreateInternalOrderProductInput)))


def get_office(office_id: str):
    if office_id:
        try:
            return OfficeModel.objects.get(id=office_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.OFFICE_NOT_FOUND)
    else:
        return None


def internal_order_data_to_dict(data: graphene.InputObjectType):
    """Converts InputObjectType to dictionary."""
    return {field: getattr(data, field) for field in data._meta.fields}


class CreateInternalOrder(graphene.Mutation):
    internal_order = graphene.Field(InternalOrderModel)
    error = graphene.String()

    class Arguments:
        data = CreateInternalOrderInput(required=True)

    def mutate(self, info, data: CreateInternalOrderInput):
        data_dict = internal_order_data_to_dict(data)

        try:
            office_branch_id = data_dict.pop("office_branch_id")
            office_branch = get_office(office_branch_id)
            if office_branch is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            office_destination_id = data_dict.pop("office_origin_id")
            office_destination = get_office(office_destination_id)
            if office_destination is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateInternalOrder(error=str(e))

        return CreateInternalOrder(internal_order=internal_order)


class Mutation(graphene.ObjectType):
    create_internal_order = CreateInternalOrder.Field()
