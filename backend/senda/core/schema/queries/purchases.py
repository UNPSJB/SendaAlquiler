from typing import Any

import graphene
from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.custom_types import Purchase, PurchaseItem

from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.schema.custom_types import (
    Purchase,
    PurchaseItem,
    PaginatedPurchaseQueryResult,
)
from utils.graphene import non_null_list_of, get_paginated_model

import csv
import io


class Query(graphene.ObjectType):
    purchases = graphene.NonNull(PaginatedPurchaseQueryResult, page=graphene.Int())

    def resolve_purchases(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            PurchaseModel.objects.all().order_by("-created_on"), page
        )
        return PaginatedPurchaseQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_purchases = non_null_list_of(Purchase)

    def resolve_all_purchases(self, info: Any):
        return PurchaseModel.objects.all()

    purchase_items = non_null_list_of(PurchaseItem)

    def resolve_purchase_items(self, info: Any):
        return PurchaseItemModel.objects.all()

    purchase_by_id = graphene.Field(Purchase, id=graphene.ID(required=True))

    def resolve_purchase_by_id(self, info: Any, id: str):
        return PurchaseModel.objects.filter(id=id).first()

    purchases_csv = graphene.NonNull(graphene.String)

    def resolve_purchases_csv(self, info: Any):
        purchases = PurchaseModel.objects.all().prefetch_related(
            "client",
            "purchase_items",
            "purchase_items__product",
            "purchase_items__product__brand",
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

        for purchase in purchases:
            for purchase_item in purchase.purchase_items.all():
                writer.writerow(
                    {
                        "ID de compra": purchase.id,
                        "Fecha de creacion": purchase.created_on,
                        "Email de Cliente": purchase.client.email,
                        "Nombre de Cliente": purchase.client.first_name,
                        "Apellido de Cliente": purchase.client.last_name,
                        "SKU de producto": purchase_item.product.sku,
                        "Nombre de producto": purchase_item.product.name,
                        "Marca de producto": purchase_item.product.brand.name,
                        "Precio de producto": purchase_item.price,
                        "Cantidad vendida": purchase_item.quantity,
                        "Precio de Producto x cantidad": purchase_item.total,
                        "Total de compra": purchase.total,
                    }
                )

        return csv_buffer.getvalue()
