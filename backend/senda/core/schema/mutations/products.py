import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models import ProductModel
from senda.core.schema.types import Product, ProductTypeChoicesEnum
from utils.graphene import input_object_type_to_dict, non_null_list_of


class ServiceInput(graphene.InputObjectType):
    service_id = graphene.ID(required=True)
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
    description = graphene.String(required=True)
    brand_id = graphene.ID(required=True)
    type = ProductTypeChoicesEnum(required=True)
    price = graphene.String(required=True)
    services = non_null_list_of(ServiceInput)
    stock = non_null_list_of(StockInput)
    supplier = non_null_list_of(ProductSupplierInput)

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

    def mutate(self, info, product_data):
        product_data_dict = input_object_type_to_dict(product_data)
            
        product = ProductModel.objects.create_product(
            **product_data_dict
        )
    
# class UpdateProducts(graphene.Mutation):

class Mutation(graphene.ObjectType):
    create_product = CreateProduct.Field()