import graphene
from django.core.exceptions import ObjectDoesNotExist, ValidationError

from senda.core.models import ProductModel, ProductStockInOfficeModel
from senda.core.schema.types import Product, ProductTypeChoicesEnum
from utils.graphene import input_object_type_to_dict


class ErrorMessages:
    NOT_FOUND = "El cliente no existe"


class CreateProductInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    sku = graphene.String(required=True)
    description = graphene.String(required=True)
    brand_id = graphene.ID(required=True)
    type = ProductTypeChoicesEnum(required=True)
    price = graphene.String(requiered=True)
