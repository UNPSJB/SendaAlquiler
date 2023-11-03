import graphene

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .localities import Mutation as LocalitiesMutation
from .products import Mutation as ProductMutation


class Mutation(
    ClientMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    ProductMutation,
    graphene.ObjectType,
):
    pass
