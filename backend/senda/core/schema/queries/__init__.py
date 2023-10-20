import graphene

from .localities import Query as LocalityQuery
from .offices import Query as OfficeQuery
from .products import Query as ProductQuery
from .clients import Query as ClientQuery
from .suppliers import Query as SupplierQuery
from .order_internal import Query as InteralOrderQuery


class Query(
    ClientQuery,
    LocalityQuery,
    OfficeQuery,
    ProductQuery,
    SupplierQuery,
    InteralOrderQuery,
    graphene.ObjectType,
):
    pass
