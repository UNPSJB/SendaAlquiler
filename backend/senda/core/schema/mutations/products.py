from typing import Any

import graphene

from senda.core.models.products import BrandModel, ProductModel
from senda.core.schema.custom_types import Brand, Product, ProductTypeChoicesEnum
from utils.graphene import input_object_type_to_dict, non_null_list_of
from django.core.exceptions import ObjectDoesNotExist


class ServiceInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    price = graphene.String(required=True)


class StockInput(graphene.InputObjectType):
    office_id = graphene.ID(required=True)
    stock = graphene.Int(required=True)


class ProductSupplierInput(graphene.InputObjectType):
    supplier_id = graphene.ID(required=True)
    price = graphene.String(required=True)


class CreateProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    sku = graphene.String(required=True)
    description = graphene.String()
    brand_id = graphene.ID(required=True)
    type = ProductTypeChoicesEnum(required=True)
    price = graphene.String(required=True)
    services = non_null_list_of(ServiceInput)
    stock = non_null_list_of(StockInput)
    suppliers = non_null_list_of(ProductSupplierInput)


class UpdateProductInput(graphene.InputObjectType):
    id = graphene.ID(required=True)
    name = graphene.ID()
    sku = graphene.String()
    description = graphene.String()
    brand_id = graphene.ID()
    type = ProductTypeChoicesEnum()
    price = graphene.String()
    services = non_null_list_of(ServiceInput)
    stock = non_null_list_of(StockInput)
    suppliers = non_null_list_of(ProductSupplierInput)


class CreateProduct(graphene.Mutation):
    product = graphene.Field(Product)
    error = graphene.String()

    class Arguments:
        product_data = CreateProductInput(required=True)

    def mutate(self, info: Any, product_data: CreateProductInput):
        try:
            product_data_dict = input_object_type_to_dict(product_data)

            try:
                product = ProductModel.objects.create_product(**product_data_dict)
                return CreateProduct(product=product)
            except ValueError as e:
                return CreateProduct(error=str(e))
        except Exception as e:
            return CreateProduct(error=e)


class CreateBrand(graphene.Mutation):
    brand = graphene.Field(Brand)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)

    def mutate(self, info: Any, name: str):
        try:
            brand = BrandModel.objects.create(name=name)
            return CreateBrand(brand=brand)
        except Exception as e:
            return CreateBrand(error=e)


class DeleteProduct(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info: Any, id: str):
        try:
            product = ProductModel.objects.get(id=id)
            product.delete()
        except ObjectDoesNotExist:
            return DeleteProduct(success=False)

        return DeleteProduct(success=True)


class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()
    create_brand = CreateBrand.Field()
    delete_product = DeleteProduct.Field()
