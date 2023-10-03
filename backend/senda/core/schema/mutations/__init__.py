import graphene

from .clients import Mutation as ClientMutation
from .localities import Mutation as LocalitiesMutation


class Mutation(
    ClientMutation,
    LocalitiesMutation,
    graphene.ObjectType,
):
    pass
