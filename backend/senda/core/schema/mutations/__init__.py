import graphene

from .clients import Mutation as ClientMutation
from .localities import Mutation as LocalitiesMutation
from .internal_orders import Mutation as InternalOrdersMutation


class Mutation(
    ClientMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    graphene.ObjectType,
):
    pass
