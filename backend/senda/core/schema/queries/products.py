import graphene

from senda.core.models.products import ProductModel, ProductStockInOfficeModel
from senda.core.schema.types import Product, ProductStockInOffice
from utils.graphene import non_null_list_of


class Query(graphene.ObjectType):
    products = non_null_list_of(Product)

    def resolve_products(self, info):
        return ProductModel.objects.all()

    products_stocks_by_office_id = graphene.Field(
        non_null_list_of(ProductStockInOffice), office_id=graphene.ID(required=True)
    )

    def resolve_products_stocks_by_office_id(self, info, office_id: str):
        return ProductStockInOfficeModel.objects.filter(office=office_id)
