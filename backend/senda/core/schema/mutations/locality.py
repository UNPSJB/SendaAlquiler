from typing import Any

import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models.localities import LocalityModel
from senda.core.schema.custom_types import LocalityType, StateChoicesEnum

from senda.core.decorators import employee_or_admin_required, CustomInfo


class CreateLocality(graphene.Mutation):
    locality = graphene.Field(LocalityType)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)
        state = StateChoicesEnum(required=True)
        postal_code = graphene.String(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, **kwargs: Any):
        try:
            locality = LocalityModel.objects.create_locality(**kwargs)
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return CreateLocality(error=str(e))

        return CreateLocality(locality=locality)


class UpdateLocality(graphene.Mutation):
    locality = graphene.Field(LocalityType)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        state = StateChoicesEnum()
        postal_code = graphene.String()

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str, **kwargs: Any):
        try:
            locality = LocalityModel.objects.get(id=id)
            LocalityModel.objects.update_locality(locality=locality, **kwargs)
        except (ValidationError, ValueError, ObjectDoesNotExist) as e:
            return UpdateLocality(error=str(e))

        return UpdateLocality(locality=locality)


class DeleteLocality(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            locality = LocalityModel.objects.get(id=id)
            locality.delete()
        except ObjectDoesNotExist:
            return DeleteLocality(success=False)

        return DeleteLocality(success=True)


class Mutation(graphene.ObjectType):
    create_locality = CreateLocality.Field()
    delete_locality = DeleteLocality.Field()
    update_locality = UpdateLocality.Field()
