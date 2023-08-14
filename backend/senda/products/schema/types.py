from graphene_django.types import DjangoObjectType

from senda.products.models import ProductModel


class Product(DjangoObjectType):
    class Meta:
        model = ProductModel
