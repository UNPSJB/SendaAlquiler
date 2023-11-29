from typing import Any

import graphene

from senda.core.models.suppliers import SupplierModel
from senda.core.schema.custom_types import (
    Supplier,
    PaginatedSupplierQueryResult,
    OrderSupplier,
)
from utils.graphene import get_paginated_model, non_null_list_of

import csv
import io


class Query(graphene.ObjectType):
    all_suppliers = non_null_list_of(Supplier)

    def resolve_all_suppliers(self, info: Any):
        return SupplierModel.objects.all()

    suppliers = graphene.NonNull(PaginatedSupplierQueryResult, page=graphene.Int())

    def resolve_suppliers(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            SupplierModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedSupplierQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    supplier_by_id = graphene.Field(Supplier, id=graphene.ID(required=True))

    def resolve_supplier_by_id(self, info: Any, id: str):
        return SupplierModel.objects.filter(id=id).first()

    supplier_orders_by_supplier_id = non_null_list_of(
        OrderSupplier, id=graphene.ID(required=True)
    )

    def resolve_supplier_orders_by_supplier_id(self, info: Any, id: str):
        supplier_order_by_supplier_id = SupplierModel.objects.get(id=id)
        orders = supplier_order_by_supplier_id.supplier_orders_branch.all()
        return orders

    suppliers_csv = graphene.NonNull(graphene.String)

    def resolve_suppliers_csv(self, info: Any):
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
