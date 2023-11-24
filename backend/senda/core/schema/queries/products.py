from typing import Any

import graphene

from senda.core.models.products import (
    BrandModel,
    ProductModel,
    ProductStockInOfficeModel,
)
from senda.core.schema.custom_types import (
    Brand,
    Product,
    ProductStockInOffice,
    PaginatedProductQueryResult,
)
from utils.graphene import non_null_list_of, get_paginated_model


class Query(graphene.ObjectType):
    products = graphene.NonNull(PaginatedProductQueryResult, page=graphene.Int())

    def resolve_products(self, info, page: int):
        paginator, selected_page = get_paginated_model(
            ProductModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedProductQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    brands = non_null_list_of(Brand)

    def resolve_brands(self, info: Any, page: int):
        return BrandModel.objects.all()

    products_stocks_by_office_id = graphene.Field(
        non_null_list_of(ProductStockInOffice), office_id=graphene.ID(required=True)
    )

    def resolve_products_stocks_by_office_id(self, info: Any, office_id: int):
        return ProductStockInOfficeModel.objects.filter(office=office_id)

    product_by_id = graphene.Field(Product, id=graphene.ID(required=True))

    def resolve_product_by_id(self, info: Any, id: str):
        return ProductModel.objects.filter(id=id).first()
