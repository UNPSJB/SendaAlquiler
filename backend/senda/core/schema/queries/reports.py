import graphene
from senda.core.models.offices import Office
from senda.core.models.sale import Sale, SaleItemModel
from senda.core.models.products import Product
from django.db.models import Sum
from django.db.models.functions import Coalesce
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear

from utils.graphene import non_null_list_of


class FrequencyDataType(graphene.ObjectType):
    total_sold_units = graphene.Int(required=True)
    total_sold_amount = graphene.Float(required=True)
    date = graphene.Date()
    week = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()


class OfficeDataType(graphene.ObjectType):
    office_id = graphene.Int(required=True)
    office_name = graphene.String(required=True)
    total_sold_units = graphene.Int(required=True)
    total_sold_amount = graphene.Float(required=True)
    frequency_data = non_null_list_of(FrequencyDataType)


class TopProductType(graphene.ObjectType):
    product_id = graphene.Int(required=True)
    product_name = graphene.String(required=True)
    total_sold_units = graphene.Int(required=True)
    total_sold_amount = graphene.Float(required=True)


class ReportType(graphene.ObjectType):
    office_data = non_null_list_of(OfficeDataType)
    top_products_by_quantity = non_null_list_of(TopProductType)
    top_products_by_amount = non_null_list_of(TopProductType)


class Query(graphene.ObjectType):
    report = graphene.Field(
        graphene.NonNull(ReportType),
        frequency=graphene.String(required=True),
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
        office_ids=graphene.List(graphene.Int),
        product_ids=graphene.List(graphene.Int),
    )

    def resolve_report(
        self, info, frequency, start_date, end_date, office_ids=None, product_ids=None
    ):
        # Filter sales based on date range
        sales = Sale.objects.filter(created_on__range=(start_date, end_date))

        # Filter sales based on office IDs
        if office_ids:
            sales = sales.filter(office_id__in=office_ids)

        # Filter sale items based on product IDs
        if product_ids:
            sales = sales.filter(sale_items__product_id__in=product_ids)

        # Annotate total sold units and amount for each office
        data_by_office = (
            Sale.objects.filter(created_on__range=(start_date, end_date))
            .values("office_id", "office__name")
            .annotate(
                total_sold_units=Coalesce(Sum("sale_items__quantity"), 0),
                total_sold_amount=Coalesce(Sum("sale_items__total"), 0),
            )
        )

        # Annotate frequency data based on the selected frequency for each office
        if frequency == "daily":
            for office in data_by_office:
                # we need to get the total sold units and amount for each day
                # example data: {'total_sold_units': 10, 'total_sold_amount': 100.0, 'date': datetime.date(2021, 1, 1)}
                # where date is the day, total_sold_units is the sum of all sold units for that day, and total_sold_amount is the sum of all sold amounts for that day
                frequency_data = (
                    Sale.objects.filter(
                        office_id=office["office_id"],
                        created_on__range=(start_date, end_date),
                    )
                    .values(date=TruncDay("created_on"))
                    .annotate(
                        total_sold_units=Sum("sale_items__quantity"),
                        total_sold_amount=Sum("sale_items__total"),
                    )
                )
                office["frequency_data"] = frequency_data
        elif frequency == "weekly":
            for office in data_by_office:
                frequency_data = (
                    Sale.objects.filter(
                        office_id=office["office_id"],
                        created_on__range=(start_date, end_date),
                    )
                    .values(week=TruncWeek("created_on"))
                    .annotate(
                        total_sold_units=Sum("sale_items__quantity"),
                        total_sold_amount=Sum("sale_items__total"),
                    )
                )
                office["frequency_data"] = frequency_data
        elif frequency == "monthly":
            for office in data_by_office:
                frequency_data = (
                    Sale.objects.filter(
                        office_id=office["office_id"],
                        created_on__range=(start_date, end_date),
                    )
                    .values(month=TruncMonth("created_on"))
                    .annotate(
                        total_sold_units=Sum("sale_items__quantity"),
                        total_sold_amount=Sum("sale_items__total"),
                    )
                )
                office["frequency_data"] = frequency_data
        elif frequency == "yearly":
            for office in data_by_office:
                frequency_data = (
                    Sale.objects.filter(
                        office_id=office["office_id"],
                        created_on__range=(start_date, end_date),
                    )
                    .values(year=TruncYear("created_on"))
                    .annotate(
                        total_sold_units=Sum("sale_items__quantity"),
                        total_sold_amount=Sum("sale_items__total"),
                    )
                )
                office["frequency_data"] = frequency_data

        # Get top 10 products sold by quantity
        top_products_by_quantity = (
            SaleItemModel.objects.filter(
                sale__created_on__range=(start_date, end_date),
                sale__office_id__in=(
                    office_ids
                    if office_ids
                    else Office.objects.values_list("id", flat=True)
                ),
                product_id__in=(
                    product_ids
                    if product_ids
                    else Product.objects.values_list("id", flat=True)
                ),
            )
            .values("product_id", "product__name")
            .annotate(
                total_sold_units=Sum("quantity"),
                total_sold_amount=Sum("total"),
            )
            .order_by("-total_sold_units")[:10]
        )

        # Get top 10 products sold by amount
        top_products_by_amount = (
            SaleItemModel.objects.filter(
                sale__created_on__range=(start_date, end_date),
                sale__office_id__in=(
                    office_ids
                    if office_ids
                    else Office.objects.values_list("id", flat=True)
                ),
                product_id__in=(
                    product_ids
                    if product_ids
                    else Product.objects.values_list("id", flat=True)
                ),
            )
            .values("product_id", "product__name")
            .annotate(
                total_sold_units=Sum("quantity"),
                total_sold_amount=Sum("total"),
            )
            .order_by("-total_sold_amount")[:10]
        )

        return ReportType(
            office_data=[
                OfficeDataType(
                    office_id=office_data["office_id"],
                    office_name=office_data["office__name"],
                    total_sold_units=office_data["total_sold_units"],
                    total_sold_amount=office_data["total_sold_amount"],
                    frequency_data=[
                        FrequencyDataType(
                            total_sold_units=frequency_item["total_sold_units"],
                            total_sold_amount=frequency_item["total_sold_amount"],
                            date=frequency_item.get("date"),
                            week=frequency_item.get("week"),
                            # month if present will be a datetime object, so we need to extract the month from it
                            month=frequency_item.get("month").month if frequency_item.get("month") else None,
                            year=frequency_item.get("year"),
                        )
                        for frequency_item in office_data["frequency_data"]
                    ],
                )
                for office_data in data_by_office
            ],
            top_products_by_quantity=[
                TopProductType(
                    product_id=product["product_id"],
                    product_name=product["product__name"],
                    total_sold_units=product["total_sold_units"],
                    total_sold_amount=product["total_sold_amount"],
                )
                for product in top_products_by_quantity
            ],
            top_products_by_amount=[
                TopProductType(
                    product_id=product["product_id"],
                    product_name=product["product__name"],
                    total_sold_units=product["total_sold_units"],
                    total_sold_amount=product["total_sold_amount"],
                )
                for product in top_products_by_amount
            ],
        )
