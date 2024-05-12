import graphene
from senda.core.models.sale import Sale, SaleItemModel
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


class TopProductType(graphene.ObjectType):
    product_id = graphene.Int(required=True)
    product_name = graphene.String(required=True)
    total_sold_units = graphene.Int(required=True)
    total_sold_amount = graphene.Float(required=True)


class OfficeDataType(graphene.ObjectType):
    office_id = graphene.Int(required=True)
    office_name = graphene.String(required=True)
    total_sold_units = graphene.Int(required=True)
    total_sold_amount = graphene.Float(required=True)
    frequency_data = non_null_list_of(FrequencyDataType)
    top_products_by_quantity = non_null_list_of(TopProductType)
    top_products_by_amount = non_null_list_of(TopProductType)


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
        office_ids=graphene.List(graphene.NonNull(graphene.Int)),
        product_ids=graphene.List(graphene.NonNull(graphene.ID)),
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
            sales.all()
            .filter(created_on__range=(start_date, end_date))
            .values("office_id", "office__name")
            .annotate(
                total_sold_units=Coalesce(Sum("sale_items__quantity"), 0),
                total_sold_amount=Coalesce(Sum("sale_items__total"), 0),
            )
        )

        # Annotate frequency data based on the selected frequency for each office
        if frequency == "daily":
            for office in data_by_office:
                frequency_sales_items = SaleItemModel.objects.filter(
                    sale__office_id=office["office_id"],
                    sale__created_on__range=(start_date, end_date),
                )

                if product_ids:
                    frequency_sales_items = frequency_sales_items.filter(
                        product_id__in=product_ids
                    )

                frequency_data = frequency_sales_items.values(
                    date=TruncDay("sale__created_on")
                ).annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )

                office["frequency_data"] = frequency_data

        elif frequency == "weekly":
            for office in data_by_office:
                frequency_sales_items = SaleItemModel.objects.filter(
                    sale__office_id=office["office_id"],
                    sale__created_on__range=(start_date, end_date),
                )

                if product_ids:
                    frequency_sales_items = frequency_sales_items.filter(
                        product_id__in=product_ids
                    )

                frequency_data = frequency_sales_items.values(
                    week=TruncWeek("sale__created_on")
                ).annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )

                office["frequency_data"] = frequency_data
        elif frequency == "monthly":
            for office in data_by_office:
                frequency_sales_items = SaleItemModel.objects.filter(
                    sale__office_id=office["office_id"],
                    sale__created_on__range=(start_date, end_date),
                )

                if product_ids:
                    frequency_sales_items = frequency_sales_items.filter(
                        product_id__in=product_ids
                    )

                frequency_data = frequency_sales_items.values(
                    month=TruncMonth("sale__created_on"),
                    year=TruncYear("sale__created_on"),
                ).annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )

                office["frequency_data"] = frequency_data
        elif frequency == "yearly":
            for office in data_by_office:
                frequency_sales_items = SaleItemModel.objects.filter(
                    sale__office_id=office["office_id"],
                    sale__created_on__range=(start_date, end_date),
                )

                if product_ids:
                    frequency_sales_items = frequency_sales_items.filter(
                        product_id__in=product_ids
                    )

                frequency_data = frequency_sales_items.values(
                    year=TruncYear("sale__created_on")
                ).annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )

                office["frequency_data"] = frequency_data

        for office in data_by_office:
            office_sale_items = SaleItemModel.objects.filter(
                sale__in=sales,
                sale__office_id=office["office_id"],
            )

            if product_ids:
                office_sale_items = office_sale_items.filter(product_id__in=product_ids)

            office["top_products_by_quantity"] = (
                office_sale_items.values("product_id", "product__name")
                .annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )
                .order_by("-total_sold_units")[:10]
            )
            office["top_products_by_amount"] = (
                office_sale_items.values("product_id", "product__name")
                .annotate(
                    total_sold_units=Sum("quantity"),
                    total_sold_amount=Sum("total"),
                )
                .order_by("-total_sold_amount")[:10]
            )

        global_sales_items = SaleItemModel.objects.filter(sale__in=sales)

        if product_ids:
            global_sales_items = global_sales_items.filter(product_id__in=product_ids)

        # Get top 10 products sold by quantity
        top_products_by_quantity = (
            global_sales_items.all()
            .values("product_id", "product__name")
            .annotate(
                total_sold_units=Sum("quantity"),
                total_sold_amount=Sum("total"),
            )
            .order_by("-total_sold_units")[:10]
        )

        # Get top 10 products sold by amount
        top_products_by_amount = (
            global_sales_items.all()
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
                            month=(
                                frequency_item.get("month").month
                                if frequency_item.get("month")
                                else None
                            ),
                            year=(
                                frequency_item.get("year").year
                                if frequency_item.get("year")
                                else None
                            ),
                        )
                        for frequency_item in office_data["frequency_data"]
                    ],
                    top_products_by_quantity=[
                        TopProductType(
                            product_id=product["product_id"],
                            product_name=product["product__name"],
                            total_sold_units=product["total_sold_units"],
                            total_sold_amount=product["total_sold_amount"],
                        )
                        for product in office_data["top_products_by_quantity"]
                    ],
                    top_products_by_amount=[
                        TopProductType(
                            product_id=product["product_id"],
                            product_name=product["product__name"],
                            total_sold_units=product["total_sold_units"],
                            total_sold_amount=product["total_sold_amount"],
                        )
                        for product in office_data["top_products_by_amount"]
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
