import graphene

from .clients import Mutation as ClientMutation


class Mutation(
    ClientMutation,
    graphene.ObjectType,
):
    pass
