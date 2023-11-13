import graphene  # pyright: ignore

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .localities import Mutation as LocalitiesMutation
from .products import Mutation as ProductMutation
from .rental_contract import Mutation as RentalContractMutation


class Mutation(
    ClientMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    ProductMutation,
    RentalContractMutation,
    graphene.ObjectType,
):
    pass
