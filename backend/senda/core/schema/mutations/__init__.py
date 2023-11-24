import graphene

from .clients import Mutation as ClientMutation
from .internal_orders import Mutation as InternalOrdersMutation
from .order_supplier import Mutation as OrderSupplierMutation
from .localities import Mutation as LocalitiesMutation
from .products import Mutation as ProductMutation
from .rental_contract import Mutation as RentalContractMutation
from .employees import Mutation as EmployeeMutation
from .purchases import Mutation as PurchaseMutation
from .suppliers import Mutation as SupplierMutation


class Mutation(
    ClientMutation,
    EmployeeMutation,
    LocalitiesMutation,
    OrderSupplierMutation,
    InternalOrdersMutation,
    ProductMutation,
    PurchaseMutation,
    RentalContractMutation,
    SupplierMutation,
    graphene.ObjectType,
):
    pass
