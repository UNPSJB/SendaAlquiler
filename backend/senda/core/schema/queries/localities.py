from typing import Any

import graphene

from senda.core.models.localities import LocalityModel
from senda.core.schema.custom_types import PaginatedLocalityQueryResult, Locality
from utils.graphene import get_paginated_model, non_null_list_of

import csv
import io


class Query(graphene.ObjectType):
    localities = graphene.NonNull(PaginatedLocalityQueryResult, page=graphene.Int())

    def resolve_localities(self, info: Any, page: int):
        paginator, selected_page = get_paginated_model(
            LocalityModel.objects.all().order_by("-created_on"), page
        )

        return PaginatedLocalityQueryResult(
            count=paginator.count,
            results=selected_page.object_list,
            num_pages=paginator.num_pages,
        )

    all_localities = non_null_list_of(Locality)

    def resolve_all_localities(self, info: Any):
        return LocalityModel.objects.all()

    localities_csv = graphene.NonNull(graphene.String)

    def resolve_localities_csv(self, info: Any):
        localities = LocalityModel.objects.all()
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID",
            "Nombre",
            "Codigo Postal",
            "Provincia",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for locality in localities:
            writer.writerow(
                {
                    "ID": locality.id,
                    "Nombre": locality.name,
                    "Codigo Postal": locality.postal_code,
                    "Provincia": locality.state,
                }
            )

        return csv_buffer.getvalue()
