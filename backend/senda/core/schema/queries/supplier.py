from typing import Any

import graphene

from senda.core.models.suppliers import SupplierModel
from senda.core.schema.custom_types import (
    SupplierType,
    PaginatedSupplierQueryResult,
    OrderSupplierType,
)
from utils.graphene import get_paginated_model, non_null_list_of

from django.db import models
import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    all_suppliers = non_null_list_of(SupplierType)

    @employee_or_admin_required
    def resolve_all_suppliers(self, info: CustomInfo):
        return SupplierModel.objects.all()

    suppliers = graphene.NonNull(
        PaginatedSupplierQueryResult, page=graphene.Int(), query=graphene.String()
    )

    @employee_or_admin_required
    def resolve_suppliers(self, info: CustomInfo, page: int, query: str = None):
        results = SupplierModel.objects.all().order_by("-created_on")

        if query is not None:
            results = results.filter(
                models.Q(name__icontains=query)
                | models.Q(cuit__icontains=query)
                | models.Q(email__icontains=query)
            )

        paginator, selected_page = get_paginated_model(results, page)

        return PaginatedSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_by_id = graphene.Field(SupplierType, id=graphene.ID(required=True))

    @employee_or_admin_required
    def resolve_supplier_by_id(self, info: CustomInfo, id: str):
        return SupplierModel.objects.filter(id=id).first()

    supplier_orders_by_supplier_id = non_null_list_of(
        OrderSupplierType, id=graphene.ID(required=True)
    )

    @employee_or_admin_required
    def resolve_supplier_orders_by_supplier_id(self, info: CustomInfo, id: str):
        supplier_order_by_supplier_id = SupplierModel.objects.get(id=id)
        orders = supplier_order_by_supplier_id.outgoing_supplier_orders.all()
        return orders

    suppliers_csv = graphene.NonNull(graphene.String)

    @employee_or_admin_required
    def resolve_suppliers_csv(self, info: CustomInfo):
        suppliers = SupplierModel.objects.all().prefetch_related("locality")
        output = io.StringIO()

        fieldnames = [
            "ID de proveedor",
            "Fecha de creacion",
            "CUIT",
            "Nombre",
            "Email",
            "Localidad",
            "Calle",
            "Número",
            "Departamento",
            "Código de área",
            "Número de teléfono",
            "Notas",
        ]

        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for supplier in suppliers:
            writer.writerow(
                {
                    "ID de proveedor": supplier.id,
                    "Fecha de creacion": supplier.created_on,
                    "CUIT": supplier.cuit,
                    "Nombre": supplier.name,
                    "Email": supplier.email,
                    "Localidad": supplier.locality.name,
                    "Calle": supplier.street_name,
                    "Número": supplier.house_number,
                    "Departamento": supplier.house_unit,
                    "Código de área": supplier.phone_code,
                    "Número de teléfono": supplier.phone_number,
                    "Notas": supplier.note,
                }
            )

        return output.getvalue()
