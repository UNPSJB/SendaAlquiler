import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.offices import OfficeModel
from senda.core.models.order_supplier import SupplierOrderModel
from senda.core.models.suppliers import SupplierModel
from utils.graphene import input_object_type_to_dict


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
    products = graphene.NonNull(
        graphene.List(graphene.NonNull(CreateSupplierOrderProductInput))
    )


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

    def mutate(self, info, data: CreateSupplierOrderInput):
        data_dict = input_object_type_to_dict(data)

        try:
            office_destination_id = data_dict.pop("office_destination_id")
            office_destination = get_office(office_destination_id)
            if office_destination is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            supplier_id = data_dict.pop("supplier_id")
            supplier = get_office(supplier_id)
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


class Mutation(graphene.ObjectType):
    CreateSupplierOrder = CreateSupplierOrder.Field()
