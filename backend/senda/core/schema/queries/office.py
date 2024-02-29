from typing import Any

import graphene

from senda.core.models.offices import Office
from senda.core.schema.custom_types import OfficeType
from utils.graphene import non_null_list_of

import csv
import io

from senda.core.decorators import employee_or_admin_required, CustomInfo


class Query(graphene.ObjectType):
    offices = non_null_list_of(OfficeType)
    @employee_or_admin_required
    def resolve_offices(self, info: CustomInfo):
        return Office.objects.all()

    office_by_id = graphene.Field(OfficeType, id=graphene.ID(required=True))
    @employee_or_admin_required
    def resolve_office_by_id(self, info: CustomInfo, id: str):
        return Office.objects.filter(id=id).first()

    offices_csv = graphene.NonNull(graphene.String)
    @employee_or_admin_required
    def resolve_offices_csv(self, info: CustomInfo):
        offices = Office.objects.all()
        csv_buffer = io.StringIO()

        fieldnames = [
            "ID",
            "Nombre",
            "Calle",
            "Numero",
            "Localidad",
            "Codigo Postal",
            "Provincia",
            "Notas",
        ]

        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()

        for office in offices:
            writer.writerow(
                {
                    "ID": office.id,
                    "Nombre": office.name,
                    "Calle": office.street,
                    "Numero": office.house_number,
                    "Localidad": office.locality.name,
                    "Codigo Postal": office.locality.postal_code,
                    "Provincia": office.locality.state,
                    "Notas": office.note,
                }
            )

        return csv_buffer.getvalue()
