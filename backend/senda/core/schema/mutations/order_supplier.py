import graphene
from backend.senda.core.models.order_supplier import SupplierOrderProduct
from senda.core.models import SupplierModel, OfficeModel, OrderSupplierModel

from senda.core.schema.types import Office, Supplier

from django.core.exceptions import ValidationError, ObjectDoesNotExist

class ErrorMessages:
    INVALID_OFFICE = "Debes especificar una sucursal"
    OFFICE_NOT_FOUND = "La sucursal no existe"
    INVALID_SUPPLIER = "Debes especificar un proveedor"
    SUPPLIER_NOT_FOUND = "El proveedor no existe"

class CreateSupplierOrderProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    cant = graphene.Int(required=True)
    
class CreateSupplierOrderInput(graphene.InputObjectType):

    office_destination_id = graphene.ID(required=True)
    Supplier_id = graphene.ID(required=True)
    products = graphene.NonNull(graphene.List(graphene.NonNull(CreateSupplierOrderProductInput)))

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

def supplier_order_data_to_dict(data: graphene.InputObjectType):
    """Converts InputObjectType to dictionary."""
    return {field: getattr(data, field) for field in data._meta.fields}

class CreateSupplierOrder(graphene.Mutation):
    supplier_order = graphene.Field(OrderSupplierModel)
    error = graphene.String()

    class Arguments:
        data = CreateSupplierOrderInput(required=True)

    def mutate(self, info, data: CreateSupplierOrderInput):
        data_dict = supplier_order_data_to_dict(data)

        try:
            office_destination_id = data_dict.pop("office_destination_id")
            office_destination_id = get_office(office_destination_id)
            if office_destination_id is None:
                raise ValueError(ErrorMessages.INVALID_OFFICE)

            Supplier_id = data_dict.pop("Supplier_id")
            Supplier_id = get_office(Supplier_id)
            if Supplier_id is None:
                raise ValueError(ErrorMessages.INVALID_SUPPLIER)

        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateSupplierOrder(error=str(e))

        return CreateSupplierOrder(order_supplier=order_supplier) 
    

class Mutation(graphene.ObjectType):
    CreateSupplierOrder = CreateSupplierOrder.Field()
