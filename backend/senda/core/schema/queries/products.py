from typing import List

import graphene

from senda.core.models.products import (
    BrandModel,
    ProductModel,
    ProductStockInOfficeModel,
    ProductSupplierModel,
    ProductTypeChoices,
    OfficeModel,
)
from senda.core.schema.custom_types import (
    Brand,
    Product,
    ProductStockInOffice,
    PaginatedProductQueryResult,
    Office,
    ProductService,
)
from utils.graphene import non_null_list_of, get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo

from graphene import ObjectType


class ProductsStocksInDateRangeStockByOffice(ObjectType):
    office = graphene.Field(Office)
    stock = graphene.Field(graphene.Int)


class ProductStocksInDateRange(ObjectType):
    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)
    price = graphene.NonNull(graphene.Decimal)
    stocks_by_office = non_null_list_of(ProductsStocksInDateRangeStockByOffice)
    services = non_null_list_of(ProductService)


class Query(graphene.ObjectType):
    products = graphene.NonNull(
        PaginatedProductQueryResult, page=graphene.Int(), query=graphene.String()
    )

    @employee_or_admin_required
    def resolve_products(self, info: CustomInfo, page: int, query: str = None):
        products = ProductModel.objects.all()
        if query:
            products = products.filter(name__icontains=query)

        paginator, selected_page = get_paginated_model(
            products.order_by("-created_on"),
            page,
        )

        return PaginatedProductQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_products = non_null_list_of(Product)

    @employee_or_admin_required
    def resolve_all_products(self, info: CustomInfo):
        return ProductModel.objects.all()

    brands = non_null_list_of(Brand)

    @employee_or_admin_required
    def resolve_brands(self, info: CustomInfo):
        return BrandModel.objects.all()

    products_stocks_by_office_id = graphene.Field(
        non_null_list_of(ProductStockInOffice), office_id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_products_stocks_by_office_id(self, info: CustomInfo, office_id: int):
        return ProductStockInOfficeModel.objects.filter(office=office_id)

    product_by_id = graphene.Field(Product, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_product_by_id(self, info: CustomInfo, id: str):
        return ProductModel.objects.filter(id=id).first()

    products_supplied_by_supplier_id = graphene.Field(
        non_null_list_of(Product), supplier_id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_products_supplied_by_supplier_id(
        self, info: CustomInfo, supplier_id: int
    ):
        result = ProductSupplierModel.objects.filter(
            supplier_id=supplier_id
        ).values_list("product", flat=True)
        products = ProductModel.objects.filter(id__in=result)
        return products

    product_exists = graphene.Field(
        graphene.NonNull(graphene.Boolean), sku=graphene.String(required=True)
    )

    @employee_or_admin_required
    def resolve_product_exists(self, info: CustomInfo, sku: str):
        return ProductModel.objects.filter(sku=sku).exists()

    products_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_products_csv(self, info: CustomInfo):
        products = ProductModel.objects.all().prefetch_related("brand")
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID",
            "SKU",
            "Tipo de producto",
            "Nombre",
            "Descripcion",
            "Marca",
            "Precio",
            "Stock",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for product in products:
            writer.writerow(
                {
                    "ID": product.id,
                    "SKU": product.sku,
                    "Nombre": product.name,
                    "Descripcion": product.description,
                    "Marca": product.brand.name,
                    "Precio": product.price,
                    "Stock": product.stock,
                    "Tipo de producto": product.get_type_display(),
                }
            )

        return csv_buffer.getvalue()

    products_stocks_by_office_in_date_range = non_null_list_of(
        ProductStocksInDateRange,
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
    )

    @employee_or_admin_required
    def resolve_products_stocks_by_office_in_date_range(
        self, info: CustomInfo, start_date: str, end_date: str
    ):
        products_queryset = ProductModel.objects.filter(
            type=ProductTypeChoices.ALQUILABLE
        ).prefetch_related(
            "stock",
            "stock__office",
            "rental_contract_items",
            "rental_contract_items__rental_contract",
            "services",
        )

        result: List[ProductStocksInDateRange]
        result = []

        for product_from_db in products_queryset:
            result.append(
                ProductStocksInDateRange(
                    id=product_from_db.id,
                    name=product_from_db.name,
                    price=product_from_db.price,
                    services=product_from_db.services.all(),
                    stocks_by_office=[
                        ProductsStocksInDateRangeStockByOffice(
                            office=office,
                            stock=product_from_db.get_available_stock_for_office_in_date_range(
                                office, start_date, end_date
                            ),
                        )
                        for office in OfficeModel.objects.all()
                    ],
                )
            )

        return result
