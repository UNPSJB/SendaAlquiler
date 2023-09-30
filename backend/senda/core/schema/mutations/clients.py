import graphene
from senda.core.models import ClientModel, LocalityModel
from senda.core.schema.types import Client, StateChoicesEnum

from django.core.exceptions import ValidationError, ObjectDoesNotExist


class ErrorMessages:
    INVALID_LOCALITY = "Debes especificar una localidad"
    LOCALITY_NOT_FOUND = "La localidad no existe"
    NOT_FOUND = "El cliente no existe"


class BaseClientInput(graphene.InputObjectType):
    email = graphene.String()
    first_name = graphene.String()
    last_name = graphene.String()
    locality_id = graphene.ID()
    locality_name = graphene.String()
    locality_postal_code = graphene.Int()
    locality_state = StateChoicesEnum()
    street_name = graphene.String()
    house_number = graphene.String()
    house_unit = graphene.String()
    dni = graphene.String()
    phone_code = graphene.String()
    phone_number = graphene.String()


class CreateClientInput(BaseClientInput):
    email = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    street_name = graphene.String(required=True)
    house_number = graphene.String(required=True)
    dni = graphene.String(required=True)
    phone_code = graphene.String(required=True)
    phone_number = graphene.String(required=True)


class UpdateClientInput(BaseClientInput):
    id = graphene.ID(required=True)


def get_locality(data):
    locality_id = data.get("locality_id")
    locality_name = data.get("locality_name")
    locality_postal_code = data.get("locality_postal_code")
    locality_state = data.get("locality_state")

    if locality_id:
        try:
            return LocalityModel.objects.get(id=locality_id)
        except ObjectDoesNotExist:
            raise ValueError(ErrorMessages.LOCALITY_NOT_FOUND)
    elif locality_name and locality_postal_code and locality_state:
        return LocalityModel.objects.get_or_create_locality(
            name=locality_name,
            postal_code=locality_postal_code,
            state=locality_state,
        )
    else:
        raise ValueError(ErrorMessages.INVALID_LOCALITY)


def client_data_to_dict(client_data: BaseClientInput):
    """Converts InputObjectType to dictionary."""
    return {field: getattr(client_data, field) for field in client_data._meta.fields}


class CreateClient(graphene.Mutation):
    client = graphene.Field(Client)
    error = graphene.String()

    class Arguments:
        client_data = CreateClientInput(required=True)

    def mutate(self, info, client_data):
        client_data_dict = client_data_to_dict(client_data)

        try:
            locality = get_locality(client_data_dict)
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
        client_data = UpdateClientInput(required=True)

    def mutate(self, info, client_data):
        client_data_dict = client_data_to_dict(client_data)

        client_id = client_data_dict.pop("id")
        try:
            client = ClientModel.objects.get(id=client_id)
        except ObjectDoesNotExist:
            return UpdateClient(error=ErrorMessages.NOT_FOUND)

        try:
            locality = get_locality(client_data_dict)
            updated_client = ClientModel.objects.update_client(
                client=client, locality=locality, **client_data_dict
            )
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return UpdateClient(error=str(e))

        return UpdateClient(client=updated_client)


class Mutation(graphene.ObjectType):
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
