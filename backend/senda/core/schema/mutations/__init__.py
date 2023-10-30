import graphene

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .localities import Mutation as LocalitiesMutation


class Mutation(
    ClientMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    graphene.ObjectType,
):
    pass
