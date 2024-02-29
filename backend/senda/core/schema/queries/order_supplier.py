from typing import Any

import graphene  # pyright: ignore

from senda.core.models.order_supplier import SupplierOrder
from senda.core.schema.custom_types import (
    OrderSupplierType,
    PaginatedOrderSupplierQueryResult,
)
from utils.graphene import get_paginated_model

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    supplier_orders = graphene.NonNull(
        PaginatedOrderSupplierQueryResult,
        page=graphene.Int(),
    )

    @employee_or_admin_required
    def resolve_supplier_orders(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            SupplierOrder.objects.filter(
                target_office=info.context.office_id
            ).order_by("-created_on"), page
        )

        return PaginatedOrderSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_order_by_id = graphene.Field(OrderSupplierType, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_supplier_order_by_id(self, info: CustomInfo, id: str):
        return SupplierOrder.objects.filter(id=id).first()

    suppliers_orders_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_suppliers_orders_csv(self, info: CustomInfo):
        supplier_orders = SupplierOrder.objects.filter(
            target_office=info.context.office_id
        ).prefetch_related(
            "supplier",
            "orders",
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
            for supplier_order_item in supplier_order.order_items.all():
                writer.writerow(
                    {
                        "ID de orden": supplier_order.id,
                        "Fecha de creacion": supplier_order.created_on,
                        "Proveedor": supplier_order.supplier.name,
                        "Sucursal de destino": supplier_order.target_office.name,
                        "Estado": supplier_order.latest_history_entry.get_status_display(),
                        "SKU de producto": supplier_order_item.product.sku,
                        "Nombre de producto": supplier_order_item.product.name,
                        "Marca de producto": supplier_order_item.product.brand.name,
                        "Precio": supplier_order_item.product_price,
                        "Cantidad pedida": supplier_order_item.quantity_ordered,
                        "Cantidad recibida": supplier_order_item.quantity_received,
                        "Total": supplier_order_item.total,
                    }
                )

        return output.getvalue()
