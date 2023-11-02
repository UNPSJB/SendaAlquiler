import graphene

from .clients import Mutation as ClientMutation
from .localities import Mutation as LocalitiesMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .products import Mutation as ProductMutation

class Mutation(
    ClientMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    ProductMutation,
    graphene.ObjectType,
):
    pass
