import graphene  # pyright: ignore

from .clients import Query as ClientQuery
from .localities import Query as LocalityQuery
from .offices import Query as OfficeQuery
from .order_internal import Query as InteralOrderQuery
from .products import Query as ProductQuery
from .purchases import Query as PurchaseQuery
from .suppliers import Query as SupplierQuery


class Query(
    ClientQuery,
    LocalityQuery,
    OfficeQuery,
    ProductQuery,
    PurchaseQuery,
    SupplierQuery,
    InteralOrderQuery,
    graphene.ObjectType,
):
    pass
