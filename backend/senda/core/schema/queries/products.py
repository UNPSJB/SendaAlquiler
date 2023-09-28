import graphene

from senda.core.models.products import ProductModel
from senda.core.schema.types import Product


class Query(graphene.ObjectType):
    products = graphene.NonNull(graphene.List(graphene.NonNull(Product)))

    def resolve_products(self, info):
        return ProductModel.objects.all()
