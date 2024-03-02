from typing import List

import graphene

from senda.core.models.products import (
    Brand,
    Product,
    StockItem,
    ProductTypeChoices,
    Office,
    ProductSupplier,
)
from senda.core.schema.custom_types import (
    StockItemType,
    BrandType,
    PaginatedProductQueryResult,
    OfficeType,
    ProductServiceType,
    ProductType,
)
from utils.graphene import non_null_list_of, get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo

from graphene import ObjectType


class ProductStocksInDateRange(ObjectType):
    office = graphene.Field(graphene.NonNull(OfficeType))
    quantity = graphene.Field(graphene.NonNull(graphene.Int))


class Query(graphene.ObjectType):
    products = graphene.NonNull(
        PaginatedProductQueryResult, page=graphene.Int(), query=graphene.String()
    )

    @employee_or_admin_required
    def resolve_products(self, info: CustomInfo, page: int, query: str = None):
        products = Product.objects.all()
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

    all_products = non_null_list_of(ProductType)

    @employee_or_admin_required
    def resolve_all_products(self, info: CustomInfo):
        return Product.objects.all()

    brands = non_null_list_of(BrandType)

    @employee_or_admin_required
    def resolve_brands(self, info: CustomInfo):
        return Brand.objects.all()

    products_stocks_by_office_id = graphene.Field(
        non_null_list_of(StockItemType), office_id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_products_stocks_by_office_id(self, info: CustomInfo, office_id: int):
        return StockItem.objects.filter(office=office_id)

    product_by_id = graphene.Field(ProductType, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_product_by_id(self, info: CustomInfo, id: str):
        return Product.objects.filter(id=id).first()

    products_supplied_by_supplier_id = graphene.Field(
        non_null_list_of(ProductType), supplier_id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_products_supplied_by_supplier_id(
        self, info: CustomInfo, supplier_id: int
    ):
        result = ProductSupplier.objects.filter(supplier_id=supplier_id).values_list(
            "product", flat=True
        )
        products = Product.objects.filter(id__in=result)
        return products

    product_stock_in_office = graphene.Field(
        StockItemType, product_id=graphene.ID(required=True), office_id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_product_stock_in_office(self, info: CustomInfo, product_id: int, office_id: int):
        return StockItem.objects.filter(product=product_id, office=office_id).first()

    product_exists = graphene.Field(
        graphene.NonNull(graphene.Boolean), sku=graphene.String(required=True)
    )

    @employee_or_admin_required
    def resolve_product_exists(self, info: CustomInfo, sku: str):
        return Product.objects.filter(sku=sku).exists()

    products_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_products_csv(self, info: CustomInfo):
        products = Product.objects.all().prefetch_related("brand")
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
                    "ID": product.pk,
                    "SKU": product.sku,
                    "Nombre": product.name,
                    "Descripcion": product.description,
                    "Marca": product.brand.name,
                    "Precio": product.price,
                    "Stock": product.available_stock,
                    "Tipo de producto": product.type,
                }
            )

        return csv_buffer.getvalue()

    product_stocks_in_date_range = non_null_list_of(
        ProductStocksInDateRange,
        product_id=graphene.ID(required=True),
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
    )

    @employee_or_admin_required
    def resolve_product_stocks_in_date_range(
        self, info: CustomInfo, product_id: str, start_date: str, end_date: str
    ):
        product_from_db = (
            Product.objects.filter(id=product_id, type=ProductTypeChoices.ALQUILABLE)
            .prefetch_related(
                "stock_items",
                "stock_items__office",
                "contract_items",
                "contract_items__contract",
            )
            .first()
        )

        if not product_from_db:
            raise Exception("Producto no encontrado")

        results: List[ProductStocksInDateRange] = []
        for office in Office.objects.all():
            results.append(
                ProductStocksInDateRange(
                    office=office,
                    quantity=product_from_db.calculate_stock_availability(
                        office.pk, start_date, end_date
                    ),
                )
            )

        return results
