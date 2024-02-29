import graphene

from .client import Mutation as ClientMutation
from .order_internal import Mutation as InternalOrdersMutation
from .order_supplier import Mutation as OrderSupplierMutation
from .locality import Mutation as LocalitiesMutation
from .product import Mutation as ProductMutation
from .contract import Mutation as ContractMutation
from .employee import Mutation as EmployeeMutation
from .sale import Mutation as SaleMutation
from .supplier import Mutation as SupplierMutation


class Mutation(
    ClientMutation,
    EmployeeMutation,
    LocalitiesMutation,
    OrderSupplierMutation,
    InternalOrdersMutation,
    ProductMutation,
    SaleMutation,
    ContractMutation,
    SupplierMutation,
    graphene.ObjectType,
):
    pass
