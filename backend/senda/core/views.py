from django.http import FileResponse
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
import pdfkit

from .models.contract import Contract
from django.http import HttpResponseNotFound

from django.shortcuts import render
from django.http import HttpResponse  # new


def download_pdf(request, contract_id: str):
    contract = Contract.objects.filter(id=contract_id).first()

    if not contract:
        return HttpResponseNotFound("Contract not found")

    items = contract.contract_items.all()

    pdf_template = "core/proposal_pdf.html"

    context = {
        "invoice": {
            "date": contract.created_on.strftime("%d/%m/%Y"),
        },
        "client": {
            "name": contract.client.first_name + " " + contract.client.last_name,
            "address": f"{contract.client.house_number} {contract.client.street_name}, {contract.client.locality.name}, {contract.client.locality.state}, {contract.client.locality.postal_code}",
        },
        "items": [
            {
                "name": item.product.name,
                "units": item.quantity,
                "price": item.product_price,
                "discount": 0,
                "total": item.total,
            }
            for item in items
        ],
        "total_amount": contract.total,
    }

    html_out = render_to_string(pdf_template, context)

    options = {
        "page-size": "Letter",
        "encoding": "UTF-8",
    }

    pdf = pdfkit.from_string(html_out, False, options=options)

    filename = f'{contract.created_on.strftime("%d-%m-%Y")}_{contract.client.first_name}-{contract.client.last_name}.pdf'

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f"attachment; filename={filename}"

    return response
