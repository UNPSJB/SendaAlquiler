from typing import Any

import graphene  # pyright: ignore

from senda.core.models.order_supplier import SupplierOrderModel
from senda.core.schema.custom_types import (
    OrderSupplier,
    PaginatedOrderSupplierQueryResult,
)
from utils.graphene import get_paginated_model

import csv
import io


class Query(graphene.ObjectType):
    supplier_orders = graphene.NonNull(
        PaginatedOrderSupplierQueryResult,
        page=graphene.Int(),
    )

    def resolve_supplier_orders(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            SupplierOrderModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedOrderSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_order_by_id = graphene.Field(OrderSupplier, id=graphene.ID(required=True))

    def resolve_supplier_order_by_id(self, info: Any, id: str):
        return SupplierOrderModel.objects.filter(id=id).first()

    supplier_orders_csv = graphene.NonNull(graphene.String)

    def resolve_supplier_orders_csv(self, info: Any):
        supplier_orders = SupplierOrderModel.objects.all().prefetch_related(
            "supplier",
            "order_items",
            "order_items__product",
            "order_items__product__brand",
        )
        output = io.StringIO()

        fieldnames = [
            "ID de orden",
            "Fecha de creacion",
            "Proveedor",
            "Sucursal de destino",
            "Estado",
            "SKU de producto",
            "Nombre de producto",
            "Marca de producto",
            "Precio",
            "Cantidad pedida",
            "Cantidad recibida",
            "Total",
        ]

        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for supplier_order in supplier_orders:
            for supplier_order_item in supplier_order.orders.all():
                writer.writerow(
                    {
                        "ID de orden": supplier_order.id,
                        "Fecha de creacion": supplier_order.created_on,
                        "Proveedor": supplier_order.supplier.name,
                        "Sucursal de destino": supplier_order.office_destination.name,
                        "Estado": supplier_order.current_history.get_status_display(),
                        "SKU de producto": supplier_order_item.product.sku,
                        "Nombre de producto": supplier_order_item.product.name,
                        "Marca de producto": supplier_order_item.product.brand.name,
                        "Precio": supplier_order_item.price,
                        "Cantidad pedida": supplier_order_item.quantity,
                        "Cantidad recibida": supplier_order_item.quantity_received,
                        "Total": supplier_order_item.total,
                    }
                )

        return output.getvalue()
