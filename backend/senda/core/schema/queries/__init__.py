import graphene

from .clients import Query as ClientQuery
from .localities import Query as LocalityQuery
from .offices import Query as OfficeQuery
from .order_internal import Query as InteralOrderQuery
from .products import Query as ProductQuery
from .purchases import Query as PurchaseQuery
from .rental_contracts import Query as RentalContractQuery
from .suppliers import Query as SupplierQuery
from .employees import Query as EmployeeQuery
from .supplier_orders import Query as SupplierOrderQuery

class Query(
    ClientQuery,
    EmployeeQuery,
    LocalityQuery,
    OfficeQuery,
    ProductQuery,
    PurchaseQuery,
    SupplierQuery,
    SupplierOrderQuery,
    InteralOrderQuery,
    RentalContractQuery,
    graphene.ObjectType,
):
    pass
