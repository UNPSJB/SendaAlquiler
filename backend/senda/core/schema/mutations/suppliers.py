from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.suppliers import SupplierModel, LocalityModel
from senda.core.schema.custom_types import Supplier
from utils.graphene import input_object_type_to_dict

from senda.core.decorators import employee_required, CustomInfo



class ErrorMessages:
    INVALID_LOCALITY = "Debes especificar una localidad"
    LOCALITY_NOT_FOUND = "La localidad no existe"
    NOT_FOUND = "El proveedor no existe"


class CreateSupplierInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    name = graphene.String(required=True)
    locality = graphene.ID(required=True)
    street_name = graphene.String(required=True)
    house_number = graphene.String(required=True)
    house_unit = graphene.String()
    cuit = graphene.String(required=True)
    phone_code = graphene.String(required=True)
    phone_number = graphene.String(required=True)
    note = graphene.String()


class UpdateSupplierInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    name = graphene.String()
    locality_id = graphene.ID()
    street_name = graphene.String()
    house_number = graphene.String()
    house_unit = graphene.String()
    cuit = graphene.String()
    phone_code = graphene.String()
    phone_number = graphene.String()
    note = graphene.String()


def get_locality(locality: str):
    if locality:
        try:
            return LocalityModel.objects.get(id=locality)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.LOCALITY_NOT_FOUND)
    else:
        return None


class CreateSupplier(graphene.Mutation):
    supplier = graphene.Field(Supplier)
    error = graphene.String()

    class Arguments:
        data = CreateSupplierInput(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, data: CreateSupplierInput) -> "CreateSupplier":
        data_dict = input_object_type_to_dict(data)

        try:
            locality_id = data_dict.pop("locality")
            locality = get_locality(locality_id)
            if locality is None:
                raise ValueError(ErrorMessages.INVALID_LOCALITY)

            supplier = SupplierModel.objects.create_supplier(
                locality=locality, **data_dict
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateSupplier(error=str(e))
        except Exception as e:
            return CreateSupplier(error="Error desconocido")

        return CreateSupplier(supplier=supplier)


class DeleteSupplier(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            supplier = SupplierModel.objects.get(id=id)
            supplier.delete()
        except ObjectDoesNotExist:
            return DeleteSupplier(success=False)

        return DeleteSupplier(success=True)


class Mutation(graphene.ObjectType):
    create_supplier = CreateSupplier.Field()
    delete_supplier = DeleteSupplier.Field()
