from typing import List

import graphene

from senda.core.models.products import (
    Brand,
    Product,
    ProductDataDict,
    ProductStockItemDataDict,
    ProductServiceDataDict,
    ProductSupplierDataDict,
)
from senda.core.schema.custom_types import (
    BrandType,
    ProductType,
    ProductServiceBillingTypeChoicesEnum,
)
from utils.graphene import non_null_list_of

from senda.core.decorators import employee_or_admin_required, CustomInfo
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction


class ProductDataInput(graphene.InputObjectType):
    sku = graphene.String(required=False)
    name = graphene.String(required=True)
    description = graphene.String(required=False)
    brand_id = graphene.ID(required=False)
    type = graphene.String(required=True)
    price = graphene.Float(required=False)


class ProductStockItemInput(graphene.InputObjectType):
    office_id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)


class ProductSupplierInput(graphene.InputObjectType):
    supplier_id = graphene.ID(required=True)
    price = graphene.Float(required=True)


class ProductServiceInput(graphene.InputObjectType):
    service_id = graphene.ID(required=False)

    name = graphene.String(required=True)
    price = graphene.Float(required=True)
    billing_period = graphene.Int(required=False)
    billing_type = ProductServiceBillingTypeChoicesEnum(required=True)


class CreateProduct(graphene.Mutation):
    class Arguments:
        product_data = ProductDataInput(required=True)
        stock_items = graphene.List(ProductStockItemInput, required=False)
        suppliers = graphene.List(ProductSupplierInput, required=False)
        services = graphene.List(ProductServiceInput, required=False)

    product = graphene.Field(ProductType)
    error = graphene.String()

    @staticmethod
    def mutate(
        root,
        info,
        product_data: ProductDataInput,
        stock_items: List[ProductStockItemInput] = None,
        suppliers: List[ProductSupplierInput] = None,
        services: List[ProductServiceInput] = None,
    ):
        try:
            with transaction.atomic():
                product = Product.objects.create_product(
                    product_data=ProductDataDict(
                        brand_id=product_data.brand_id,
                        description=product_data.description,
                        name=product_data.name,
                        price=product_data.price,
                        sku=product_data.sku,
                        type=product_data.type,
                    )
                )

                if stock_items:
                    Product.objects.update_or_create_stock_items(
                        product_id=product.pk,
                        stocks_data=[
                            ProductStockItemDataDict(
                                office_id=stock_item.office_id,
                                quantity=stock_item.quantity,
                                product_id=product.pk,
                            )
                            for stock_item in stock_items
                        ],
                    )

                if suppliers:
                    Product.objects.update_or_create_product_suppliers(
                        product_id=product.pk,
                        suppliers_data=[
                            ProductSupplierDataDict(
                                supplier_id=supplier.supplier_id,
                                price=supplier.price,
                                product_id=product.pk,
                            )
                            for supplier in suppliers
                        ],
                    )

                if services:
                    Product.objects.update_or_create_product_services(
                        product_id=product.pk,
                        services_data=[
                            ProductServiceDataDict(
                                service_id=int(service.service_id) if service.service_id else None,
                                name=service.name,
                                price=service.price,
                                product_id=product.pk,
                                billing_period=service.billing_period,
                                billing_type=service.billing_type,
                            )
                            for service in services
                        ],
                    )

                return CreateProduct(product=product)
        except Exception as e:
            return CreateProduct(error=str(e))


class UpdateProduct(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        product_data = ProductDataInput(required=True)
        stock_items = non_null_list_of(ProductStockItemInput, required=False)
        suppliers = non_null_list_of(ProductSupplierInput, required=False)
        services = non_null_list_of(ProductServiceInput, required=False)
        suppliers_ids_to_delete = non_null_list_of(graphene.ID, required=False)
        services_ids_to_delete = non_null_list_of(graphene.ID, required=False)
        stock_items_ids_to_delete = non_null_list_of(graphene.ID, required=False)

    product = graphene.Field(ProductType)
    error = graphene.String()

    @employee_or_admin_required
    @staticmethod
    def mutate(
        root,
        info,
        id: str,
        product_data: ProductDataInput,
        stock_items: List[ProductStockItemInput] = None,
        suppliers: List[ProductSupplierInput] = None,
        services: List[ProductServiceInput] = None,
        suppliers_ids_to_delete: List[str] = None,
        services_ids_to_delete: List[str] = None,
        stock_items_ids_to_delete: List[str] = None,
    ):
        try:
            with transaction.atomic():
                product = Product.objects.edit_product(
                    product_id=int(id),
                    product_data=ProductDataDict(
                        brand_id=product_data.brand_id,
                        description=product_data.description,
                        name=product_data.name,
                        price=product_data.price,
                        sku=product_data.sku,
                        type=product_data.type,
                    ),
                )

                if stock_items:
                    Product.objects.update_or_create_stock_items(
                        product_id=product.pk,
                        stocks_data=[
                            ProductStockItemDataDict(
                                office_id=stock_item.office_id,
                                quantity=stock_item.quantity,
                                product_id=product.pk,
                            )
                            for stock_item in stock_items
                        ],
                    )

                if suppliers:
                    Product.objects.update_or_create_product_suppliers(
                        product_id=product.pk,
                        suppliers_data=[
                            ProductSupplierDataDict(
                                supplier_id=supplier.supplier_id,
                                price=supplier.price,
                                product_id=product.pk,
                            )
                            for supplier in suppliers
                        ],
                    )

                if services:
                    Product.objects.update_or_create_product_services(
                        product_id=product.pk,
                        services_data=[
                            ProductServiceDataDict(
                                service_id=service.service_id,
                                name=service.name,
                                price=service.price,
                                product_id=product.pk,
                                billing_period=service.billing_period,
                                billing_type=service.billing_type,
                            )
                            for service in services
                        ],
                    )

                if suppliers_ids_to_delete:
                    Product.objects.delete_product_suppliers(
                        product_id=product.pk, suppliers_ids=suppliers_ids_to_delete
                    )

                if services_ids_to_delete:
                    Product.objects.delete_product_services(
                        product_id=product.pk, services_ids=services_ids_to_delete
                    )

                if stock_items_ids_to_delete:
                    Product.objects.delete_stock_items(
                        product_id=product.pk, office_ids=stock_items_ids_to_delete
                    )

                return UpdateProduct(product=product)
        except Exception as e:
            return UpdateProduct(error=str(e))


class CreateBrand(graphene.Mutation):
    brand = graphene.Field(BrandType)
    error = graphene.String()

    class Arguments:
        name = graphene.String(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, name: str):
        try:
            brand = Brand.objects.create(name=name)
            return CreateBrand(brand=brand)
        except Exception as e:
            return CreateBrand(error=e)


class DeleteProduct(graphene.Mutation):
    success = graphene.Boolean(required=True)

    class Arguments:
        id = graphene.ID(required=True)

    @employee_or_admin_required
    def mutate(self, info: CustomInfo, id: str):
        try:
            product = Product.objects.get(id=id)
            product.delete()
        except ObjectDoesNotExist:
            return DeleteProduct(success=False)

        return DeleteProduct(success=True)


class Mutation(graphene.ObjectType):
    create_brand = CreateBrand.Field()

    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()
