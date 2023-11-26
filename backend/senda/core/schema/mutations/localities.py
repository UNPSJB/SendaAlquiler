from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.localities import LocalityModel
from senda.core.schema.custom_types import Locality, StateChoicesEnum


class CreateLocality(graphene.Mutation):
    locality = graphene.Field(Locality)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        state = StateChoicesEnum(required=True)
        postal_code = graphene.String(required=True)

    def mutate(self, info: Any, **kwargs: Any):
        try:
            locality = LocalityModel.objects.create_locality(**kwargs)
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateLocality(error=str(e))

        return CreateLocality(locality=locality)


class DeleteLocality(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info: Any, id: str):
        try:
            locality = LocalityModel.objects.get(id=id)
            locality.delete()
        except ObjectDoesNotExist:
            return DeleteLocality(success=False)

        return DeleteLocality(success=True)


class Mutation(graphene.ObjectType):
    create_locality = CreateLocality.Field()
    delete_locality = DeleteLocality.Field()
