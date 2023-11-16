from typing import Any

import graphene  # pyright: ignore

from senda.core.models.products import (
    BrandModel,
    ProductModel,
    ProductStockInOfficeModel,
)
from senda.core.schema.custom_types import Brand, Product, ProductStockInOffice
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    products = non_null_list_of(Product)

    def resolve_products(self, info: Any):
        return ProductModel.objects.all()

    brands = non_null_list_of(Brand)

    def resolve_brands(self, info: Any):
        return BrandModel.objects.all()

    products_stocks_by_office_id = graphene.Field(
        non_null_list_of(ProductStockInOffice), office_id=graphene.ID(required=True)
    )

    def resolve_products_stocks_by_office_id(self, info: Any, office_id: int):
        return ProductStockInOfficeModel.objects.filter(office=office_id)

    product_by_id = graphene.Field(Product, id=graphene.ID(required=True))

    def resolve_product_by_id(self, info: Any, id: str):
        return ProductModel.objects.filter(id=id).first()
