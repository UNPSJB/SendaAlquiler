import graphene  # pyright: ignore

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .localities import Mutation as LocalitiesMutation
from .products import Mutation as ProductMutation
from .rental_contract import Mutation as RentalContractMutation
from .employees import Mutation as EmployeeMutation
from .purchases import Mutation as PurchaseMutation


class Mutation(
    ClientMutation,
    EmployeeMutation,
    LocalitiesMutation,
    InternalOrdersMutation,
    ProductMutation,
    PurchaseMutation,
    RentalContractMutation,
    graphene.ObjectType,
):
    pass
