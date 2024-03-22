from typing import List

import graphene
import datetime

from senda.core.models.order_internal import (
    InternalOrder,
    InternalOrderHistoryStatusChoices,
)
from senda.core.schema.custom_types import (
    PaginatedInternalOrderQueryResult,
    InternalOrderType,
    InternalOrderHistoryStatusEnum,
)
from utils.graphene import get_paginated_model

from senda.core.decorators import employee_or_admin_required, CustomInfo

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class InternalOrderQueryDirection(graphene.Enum):
    INCOMING = "incoming"
    OUTGOING = "outgoing"


class Query(graphene.ObjectType):
    internal_orders = graphene.NonNull(
        PaginatedInternalOrderQueryResult,
        page=graphene.Int(),
        direction=InternalOrderQueryDirection(required=True),
        status=graphene.List(graphene.NonNull(InternalOrderHistoryStatusEnum)),
    )

    @employee_or_admin_required
    def resolve_internal_orders(
        self,
        info: CustomInfo,
        page: int,
        direction: InternalOrderQueryDirection,
        status: List[InternalOrderHistoryStatusChoices] = None,
    ):
        current_office_id = info.context.office_id

        results = InternalOrder.objects.none()

        if direction == InternalOrderQueryDirection.INCOMING:
            results = InternalOrder.objects.filter(target_office=current_office_id)
        elif direction == InternalOrderQueryDirection.OUTGOING:
            results = InternalOrder.objects.filter(source_office=current_office_id)

        if status:
            results = results.filter(latest_history_entry__status__in=status)

        results = results.order_by("-created_on")

        paginator, selected_page = get_paginated_model(
            results,
            page,
        )

        return PaginatedInternalOrderQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    number_of_pending_outgoing_internal_orders = graphene.Int()

    @employee_or_admin_required
    def resolve_number_of_pending_outgoing_internal_orders(self, info: CustomInfo):
        return InternalOrder.objects.filter(
            source_office=info.context.office_id,
            latest_history_entry__status=InternalOrderHistoryStatusChoices.PENDING,
        ).count()

    internal_order_by_id = graphene.Field(
        InternalOrderType, id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_internal_order_by_id(self, info: CustomInfo, id: str):
        return InternalOrder.objects.filter(id=id).first()

    internal_orders_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_internal_orders_csv(self, info: CustomInfo):
        internal_orders = InternalOrder.objects.all().prefetch_related(
            "latest_history_entry",
            "source_office",
            "target_office",
            "order_items",
            
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
            "Cantidad enviada",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for internal_order in internal_orders:
            for order_item in internal_order.order_items.all():
                formatted_created_on = internal_order.created_on.strftime('%H:%M %d/%m/%Y')

                writer.writerow(
                    {
                        "ID de orden": internal_order.id,
                        "Fecha de creacion": formatted_created_on,
                        "Sucursal de origen": internal_order.source_office.name,
                        "Sucursal de destino": internal_order.target_office.name,
                        "Estado actual": internal_order.latest_history_entry.get_status_display(),
                        "SKU de producto": order_item.product.sku,
                        "Nombre de producto": order_item.product.name,
                        "Cantidad pedida": order_item.quantity_ordered,
                        "Cantidad recibida": order_item.quantity_received,
                        "Cantidad enviada": order_item.quantity_sent,
                    }
                )

        return csv_buffer.getvalue()
