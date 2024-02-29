from typing import Any

import graphene
from senda.core.models.sale import SaleItemModel, Sale

from senda.core.models.sale import SaleItemModel, Sale
from senda.core.schema.custom_types import (
    SaleType,
    SaleItemType,
    PaginatedSaleQueryResult,
)
from utils.graphene import non_null_list_of, get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    sales = graphene.NonNull(PaginatedSaleQueryResult, page=graphene.Int())

    @employee_or_admin_required
    def resolve_sales(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            Sale.objects.filter(office=info.context.office_id).order_by("-created_on"),
            page,
        )
        return PaginatedSaleQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_sales = non_null_list_of(SaleType)

    @employee_or_admin_required
    def resolve_all_sales(self, info: CustomInfo):
        return Sale.objects.all()

    sale_items = non_null_list_of(SaleItemType)

    @employee_or_admin_required
    def resolve_sale_items(self, info: CustomInfo):
        return SaleItemModel.objects.all()

    sale_by_id = graphene.Field(SaleType, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_sale_by_id(self, info: CustomInfo, id: str):
        return Sale.objects.filter(id=id).first()

    sales_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_sales_csv(self, info: CustomInfo):
        sales = Sale.objects.all().prefetch_related(
            "client",
            "sale_items",
            "sale_items__product",
            "sale_items__product__brand",
        )
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID de compra",
            "Fecha de creacion",
            "Email de Cliente",
            "Nombre de Cliente",
            "Apellido de Cliente",
            "SKU de producto",
            "Nombre de producto",
            "Marca de producto",
            "Precio de producto",
            "Cantidad vendida",
            "Precio de Producto x cantidad",
            "Total de compra",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for sale in sales:
            for sale_item in sale.sale_items.all():
                writer.writerow(
                    {
                        "ID de compra": sale.pk,
                        "Fecha de creacion": sale.created_on,
                        "Email de Cliente": sale.client.email,
                        "Nombre de Cliente": sale.client.first_name,
                        "Apellido de Cliente": sale.client.last_name,
                        "SKU de producto": sale_item.product.sku,
                        "Nombre de producto": sale_item.product.name,
                        "Marca de producto": sale_item.product.brand.name,
                        "Precio de producto": sale_item.product.price,
                        "Cantidad vendida": sale_item.quantity,
                        "Precio de Producto x cantidad": sale_item.total,
                        "Total de compra": sale.total,
                    }
                )

        return csv_buffer.getvalue()
