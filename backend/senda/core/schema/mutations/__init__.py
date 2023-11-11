import graphene  # pyright: ignore

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .localities import Mutation as LocalitiesMutation
from .products import Mutation as ProductMutation
from .employees import Mutation as EmployeeMutation

class Mutation(
    ClientMutation,
    EmployeeMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    ProductMutation,
    graphene.ObjectType,
):
    pass
