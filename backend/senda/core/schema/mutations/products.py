from typing import Any

import graphene

from senda.core.models.products import BrandModel, ProductModel
from senda.core.schema.custom_types import Brand, Product, ProductTypeChoicesEnum
from utils.graphene import input_object_type_to_dict, non_null_list_of

from senda.core.decorators import employee_required, CustomInfo
from django.core.exceptions import ObjectDoesNotExist


class ServiceInput(graphene.InputObjectType):
    id = graphene.ID()
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
    sku = graphene.String()
    description = graphene.String()
    brand_id = graphene.ID(required=True)
    type = ProductTypeChoicesEnum(required=True)
    price = graphene.String(required=True)
    services = non_null_list_of(ServiceInput)
    stock = non_null_list_of(StockInput)
    suppliers = non_null_list_of(ProductSupplierInput)


class UpdateProductInput(graphene.InputObjectType):
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

    @employee_required
    def mutate(self, info: CustomInfo, product_data: CreateProductInput):
        try:
            product_data_dict = input_object_type_to_dict(product_data)

            try:
                product = ProductModel.objects.create_product(**product_data_dict)
                return CreateProduct(product=product)
            except ValueError as e:
                return CreateProduct(error=str(e))
        except Exception as e:
            return CreateProduct(error=e)


class UpdateProduct(graphene.Mutation):
    product = graphene.Field(Product)
    error = graphene.String()

    class Arguments:
        id = graphene.ID(required=True)
        product_data = UpdateProductInput(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str, product_data: UpdateProductInput):
        try:
            product = ProductModel.objects.filter(id=id).first()

            if not product:
                return UpdateProduct(error="El producto no existe")

            product.sku = product_data.sku
            product.name = product_data.name
            product.description = product_data.description
            product.brand_id = product_data.brand_id
            product.type = product_data.type
            product.price = product_data.price

            for service in product.services.all():
                if service.id not in [
                    service_data.id for service_data in product_data.services
                ]:
                    service.delete()

            for service_data in product_data.services:
                service_id = service_data.id

                if not service_id:
                    product.services.create(
                        name=service_data.name, price=service_data.price
                    )
                else:
                    service = product.services.filter(id=service_id).first()
                    if service:
                        service.price = service_data.price
                        service.save()

            for stock in product.stock.all():
                if stock.office_id not in [
                    stock_data.office_id for stock_data in product_data.stock
                ]:
                    stock.delete()

            for stock_data in product_data.stock:
                stock = product.stock.filter(office_id=stock_data.office_id).first()
                if not stock:
                    product.stock.create(
                        office_id=stock_data.office_id, stock=stock_data.stock
                    )
                else:
                    stock.stock = stock_data.stock
                    stock.save()

            for supplier in product.suppliers.all():
                if supplier.supplier_id not in [
                    supplier_data.supplier_id
                    for supplier_data in product_data.suppliers
                ]:
                    supplier.delete()

            for supplier_data in product_data.suppliers:
                supplier = product.suppliers.filter(
                    supplier_id=supplier_data.supplier_id
                ).first()
                if not supplier:
                    product.suppliers.create(
                        supplier_id=supplier_data.supplier_id, price=supplier_data.price
                    )
                else:
                    supplier.price = supplier_data.price
                    supplier.save()

            product.save()

            return UpdateProduct(product=product)
        except Exception as e:
            return UpdateProduct(error=e)


class CreateBrand(graphene.Mutation):
    brand = graphene.Field(Brand)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, name: str):
        try:
            brand = BrandModel.objects.create(name=name)
            return CreateBrand(brand=brand)
        except Exception as e:
            return CreateBrand(error=e)


class DeleteProduct(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_required
    def mutate(self, info: CustomInfo, id: str):
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
    update_product = UpdateProduct.Field()
