import graphene
from senda.core.models import LocalityModel
from senda.core.schema.types import Locality, StateChoicesEnum

from django.core.exceptions import ValidationError, ObjectDoesNotExist


class CreateLocality(graphene.Mutation):
    locality = graphene.Field(Locality)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        state = StateChoicesEnum(required=True)
        postal_code = graphene.String(required=True)

    def mutate(self, info, **kwargs):
        try:
            locality = LocalityModel.objects.create_locality(**kwargs)
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateLocality(error=str(e))

        return CreateLocality(locality=locality)


class Mutation(graphene.ObjectType):
    create_locality = CreateLocality.Field()
