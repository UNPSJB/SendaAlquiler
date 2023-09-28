import graphene

from .localities import Query as LocalityQuery
from .offices import Query as OfficeQuery
from .products import Query as ProductQuery
from .clients import Query as ClientQuery


class Query(ClientQuery, LocalityQuery, OfficeQuery, ProductQuery, graphene.ObjectType):
    pass
