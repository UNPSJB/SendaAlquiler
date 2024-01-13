from typing import Any

import graphene

from senda.core.models.order_internal import InternalOrderModel
from senda.core.schema.custom_types import (
    PaginatedInternalOrderQueryResult,
    InternalOrder,
)
from utils.graphene import get_paginated_model

from senda.core.decorators import employee_or_admin_required, CustomInfo

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo
from django.db import models


class Query(graphene.ObjectType):
    internal_orders = graphene.NonNull(
        PaginatedInternalOrderQueryResult, page=graphene.Int()
    )

    @employee_or_admin_required
    def resolve_internal_orders(self, info: CustomInfo, page: int):
        paginator, selected_page = get_paginated_model(
            InternalOrderModel.objects.filter(
                models.Q(office_branch=info.context.office_id)
                | models.Q(office_destination=info.context.office_id)
            ).order_by("-created_on"),
            page,
        )

        return PaginatedInternalOrderQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    internal_order_by_id = graphene.Field(InternalOrder, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_internal_order_by_id(self, info: CustomInfo, id: str):
        return InternalOrderModel.objects.filter(id=id).first()

    internal_orders_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_internal_orders_csv(self, info: CustomInfo):
        internal_orders = InternalOrderModel.objects.all().prefetch_related(
            "current_history",
            "office_branch",
            "office_destination",
            "orders",
            "orders__product",
        )
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID de orden",
            "Fecha de creacion",
            "Sucursal de origen",
            "Sucursal de destino",
            "Estado actual",
            "SKU de producto",
            "Nombre de producto",
            "Cantidad pedida",
            "Cantidad recibida",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for internal_order in internal_orders:
            for order_item in internal_order.orders.all():
                writer.writerow(
                    {
                        "ID de orden": internal_order.id,
                        "Fecha de creacion": internal_order.created_on,
                        "Sucursal de origen": internal_order.office_branch.name,
                        "Sucursal de destino": internal_order.office_destination.name,
                        "Estado actual": internal_order.current_history.get_status_display(),
                        "SKU de producto": order_item.product.sku,
                        "Nombre de producto": order_item.product.name,
                        "Cantidad pedida": order_item.quantity,
                        "Cantidad recibida": order_item.quantity_received,
                    }
                )

        return csv_buffer.getvalue()
