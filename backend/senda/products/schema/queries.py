import graphene

from senda.products.models import ProductModel
from senda.products.schema.types import Product


class ProductsQuery(graphene.ObjectType):
    products = graphene.NonNull(graphene.List(graphene.NonNull(Product)))

    def resolve_products(self, info):
        return ProductModel.objects.all()


class Query(ProductsQuery, graphene.ObjectType):
    pass
