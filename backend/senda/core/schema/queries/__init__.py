import graphene

from .client import Query as ClientQuery
from .locality import Query as LocalityQuery
from .office import Query as OfficeQuery
from .order_internal import Query as InteralOrderQuery
from .product import Query as ProductQuery
from .sale import Query as SaleQuery
from .contract import Query as ContractQuery
from .supplier import Query as SupplierQuery
from .employee import Query as EmployeeQuery
from .order_supplier import Query as SupplierOrderQuery


class Query(
    ClientQuery,
    EmployeeQuery,
    LocalityQuery,
    OfficeQuery,
    ProductQuery,
    SaleQuery,
    SupplierQuery,
    SupplierOrderQuery,
    InteralOrderQuery,
    ContractQuery,
    graphene.ObjectType,
):
    pass
