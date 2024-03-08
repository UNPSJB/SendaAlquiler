from django.http import FileResponse
from django.template.loader import render_to_string
from django.contrib.auth.decorators import login_required
import pdfkit

from .models.contract import Contract
from django.http import HttpResponseNotFound

from django.shortcuts import render
from django.http import HttpResponse  # new


def format_number_as_price(number):
    """
    Formats a number as a price
    last two digits will be the cents
    and adds a "." as thousands separator

    Example:
    1234567 -> 12.345,67

    :param number: The number to format
    :return: The formatted price
    """
    if not isinstance(number, (int, float)):
        return "0"

    number /= 100
    formatted_price = f"{number:,.2f}"

    return formatted_price.replace(".", " ").replace(",", ".").replace(" ", ",")


def format_number_with_thousands_separator(number):
    """
    Formats a number with a thousands separator

    Example:
    1234567 -> 1.234.567

    :param number: The number to format
    :return: The formatted number
    """
    if not isinstance(number, (int, float)):
        return "0"

    return "{:,}".format(number).replace(",", ".")


def download_pdf(request, contract_id: str):
    contract = Contract.objects.filter(id=contract_id).first()

    if not contract:
        return HttpResponseNotFound("Contract not found")

    items = contract.contract_items.all()

    pdf_template = "core/proposal_pdf.html"

    context = {
        "invoice": {
            "date": contract.created_on.strftime("%d/%m/%Y"),
            "expiration_date": contract.expiration_date.strftime("%d/%m/%Y"),
            "subtotal": format_number_as_price(contract.subtotal),
            "discount": format_number_as_price(contract.discount_amount),
            "total": format_number_as_price(contract.total),
        },
        "client": {
            "name": contract.client.first_name + " " + contract.client.last_name,
            "address": f"{contract.client.street_name} {contract.client.house_number}, U{contract.client.locality.postal_code} {contract.client.locality.name}, {contract.client.locality.state}",
        },
        "contract": {
            "location": f"{contract.street_name} {contract.house_number}, U{contract.locality.postal_code} {contract.locality.name}, {contract.locality.state}, Argentina",
            "start_datetime": contract.contract_start_datetime.strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "end_datetime": contract.contract_end_datetime.strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
        },
        "items": [
            {
                "name": item.product.name,
                "quantity": format_number_with_thousands_separator(item.quantity),
                "price": format_number_as_price(item.product_price),
                "subtotal": format_number_as_price(item.product_subtotal),
                "discount": format_number_as_price(item.product_discount),
                "total": format_number_as_price(
                    item.product_subtotal - item.product_discount
                ),
                "services": [
                    {
                        "name": service_item.service.name,
                        "quantity": Contract.objects.calculate_service_quantity(
                            service=service_item.service,
                            end_date=contract.contract_end_datetime,
                            start_date=contract.contract_start_datetime,
                        ),
                        "price": format_number_as_price(service_item.price),
                        "subtotal": format_number_as_price(service_item.subtotal),
                        "discount": format_number_as_price(service_item.discount),
                        "total": format_number_as_price(
                            service_item.subtotal - service_item.discount
                        ),
                    }
                    for service_item in item.service_items.all()
                ],
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
