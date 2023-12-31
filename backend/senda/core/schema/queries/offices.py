from typing import Any

import graphene

from senda.core.models.offices import OfficeModel
from senda.core.schema.custom_types import Office
from utils.graphene import non_null_list_of

import csv
import io

from senda.core.decorators import employee_required, CustomInfo


class Query(graphene.ObjectType):
    offices = non_null_list_of(Office)
    @employee_required
    def resolve_offices(self, info: CustomInfo):
        return OfficeModel.objects.all()

    office_by_id = graphene.Field(Office, id=graphene.ID(required=True))
    @employee_required
    def resolve_office_by_id(self, info: CustomInfo, id: str):
        return OfficeModel.objects.filter(id=id).first()

    offices_csv = graphene.NonNull(graphene.String)
    @employee_required
    def resolve_offices_csv(self, info: CustomInfo):
        offices = OfficeModel.objects.all()
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
