from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.clients import ClientModel, LocalityModel
from senda.core.schema.custom_types import Client
from utils.graphene import input_object_type_to_dict

from senda.core.decorators import employee_or_admin_required, CustomInfo



class ErrorMessages:
    INVALID_LOCALITY = "Debes especificar una localidad"
    LOCALITY_NOT_FOUND = "La localidad no existe"
    NOT_FOUND = "El cliente no existe"


class CreateClientInput(graphene.InputObjectType):
    email = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    locality_id = graphene.ID(required=True)
    street_name = graphene.String(required=True)
    house_number = graphene.String(required=True)
    house_unit = graphene.String()
    dni = graphene.String(required=True)
    phone_code = graphene.String(required=True)
    phone_number = graphene.String(required=True)


class UpdateClientInput(graphene.InputObjectType):
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    locality_id = graphene.ID()
    street_name = graphene.String()
    house_number = graphene.String()
    house_unit = graphene.String()
    dni = graphene.String()
    phone_code = graphene.String()
    phone_number = graphene.String()


def get_locality(locality_id: str):
    if locality_id:
        try:
            return LocalityModel.objects.get(id=locality_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.LOCALITY_NOT_FOUND)
    else:
        return None


class CreateClient(graphene.Mutation):
    client = graphene.Field(Client)
    error = graphene.String()

    class Arguments:
        client_data = CreateClientInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, client_data: CreateClientInput):
        client_data_dict = input_object_type_to_dict(client_data)

        try:
            locality_id = client_data_dict.pop("locality_id")
            locality = get_locality(locality_id)
            if locality is None:
                raise ValueError(ErrorMessages.INVALID_LOCALITY)

            client = ClientModel.objects.create_client(
                locality=locality, **client_data_dict
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateClient(error=str(e))

        return CreateClient(client=client)


class UpdateClient(graphene.Mutation):
    client = graphene.Field(Client)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        client_data = UpdateClientInput(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str, client_data: UpdateClientInput):
        client_data_dict = input_object_type_to_dict(client_data)

        try:
            client = ClientModel.objects.get(id=id)
        except ObjectDoesNotExist:
            return UpdateClient(error=ErrorMessages.NOT_FOUND)

        try:
            locality_id = client_data_dict.pop("locality_id")
            locality = get_locality(locality_id)
            if locality is None:
                raise ValueError(ErrorMessages.INVALID_LOCALITY)

            updated_client = ClientModel.objects.update_client(
                client=client, locality=locality, **client_data_dict
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return UpdateClient(error=str(e))

        return UpdateClient(client=updated_client)


class DeleteClient(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            ClientModel.objects.get(id=id).delete()
        except ObjectDoesNotExist:
            return DeleteClient(success=False)

        return DeleteClient(success=True)


class Mutation(graphene.ObjectType):
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    delete_client = DeleteClient.Field()
