import graphene
from django.db.models import Count, Sum, Avg, F
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from senda.core.models.order_internal import (
    InternalOrder,
    InternalOrderLineItem,
    InternalOrderHistoryStatusChoices,
)

from utils.graphene import non_null_list_of


class OrderCountTrendType(graphene.ObjectType):
    date = graphene.Date(required=False)
    week = graphene.Int(required=False)
    month = graphene.Int(required=False)
    year = graphene.Int(required=False)
    count = graphene.Int(required=True)


class OrderStatusDistributionType(graphene.ObjectType):
    status = graphene.String(required=True)
    count = graphene.Int(required=True)


class TopProductsOrderedType(graphene.ObjectType):
    product_id = graphene.ID(required=True)
    product_name = graphene.String(required=True)
    total_quantity = graphene.Int(required=True)


class OrderFulfillmentRateType(graphene.ObjectType):
    fulfillment_rate = graphene.Float()


class SourceTargetOfficeAnalysisType(graphene.ObjectType):
    target_office_id = graphene.ID(required=True)
    target_office_name = graphene.String(required=True)
    source_office_id = graphene.ID(required=True)
    source_office_name = graphene.String(required=True)
    order_count = graphene.Int(required=True)
    total_quantity = graphene.Int(required=True)


class TopProductsOrderedByOfficeType(graphene.ObjectType):
    office_id = graphene.ID(required=True)
    office_name = graphene.String(required=True)
    top_products = non_null_list_of(TopProductsOrderedType)


class OrderCountTrendByOfficeType(graphene.ObjectType):
    office_id = graphene.ID(required=True)
    office_name = graphene.String(required=True)
    order_count_trend = non_null_list_of(OrderCountTrendType)


class InternalOrderReportType(graphene.ObjectType):
    order_count_trend = non_null_list_of(OrderCountTrendType)
    order_status_distribution = non_null_list_of(OrderStatusDistributionType)
    top_products_ordered = non_null_list_of(TopProductsOrderedType)
    order_fulfillment_rate = graphene.Field(OrderFulfillmentRateType)
    average_order_processing_time = graphene.Int(required=True)
    source_target_office_analysis = non_null_list_of(SourceTargetOfficeAnalysisType)
    top_products_ordered_by_office = non_null_list_of(TopProductsOrderedByOfficeType)
    order_count_trend_by_office = non_null_list_of(OrderCountTrendByOfficeType)


class Query(graphene.ObjectType):
    internal_order_report = graphene.Field(
        graphene.NonNull(InternalOrderReportType),
        start_date=graphene.Date(required=True),
        end_date=graphene.Date(required=True),
        frequency=graphene.String(required=True),
        office_ids=graphene.List(graphene.NonNull(graphene.ID)),
        product_ids=graphene.List(graphene.NonNull(graphene.ID)),
    )

    def resolve_internal_order_report(
        self, info, start_date, end_date, frequency, office_ids=None, product_ids=None
    ):
        orders = InternalOrder.objects.filter(created_on__range=(start_date, end_date))

        if office_ids:
            orders = orders.filter(target_office_id__in=office_ids)

        order_count_trend = []
        if frequency == "daily":
            order_count_trend = (
                orders.annotate(date=TruncDay("created_on"))
                .values("date")
                .annotate(count=Count("id"))
                .order_by("date")
            )
        elif frequency == "weekly":
            order_count_trend = (
                orders.annotate(date=TruncWeek("created_on"))
                .values("date")
                .annotate(count=Count("id"))
                .order_by("date")
            )
        elif frequency == "monthly":
            order_count_trend = (
                orders.annotate(
                    month=TruncMonth("created_on"), year=TruncYear("created_on")
                )
                .values("month", "year")
                .annotate(count=Count("id"))
                .order_by("year", "month")
            )
        elif frequency == "yearly":
            order_count_trend = (
                orders.annotate(year=TruncYear("created_on"))
                .values("year")
                .annotate(count=Count("id"))
                .order_by("year")
            )

        order_status_distribution = orders.values(
            "latest_history_entry__status"
        ).annotate(count=Count("id"))

        order_items = InternalOrderLineItem.objects.filter(internal_order__in=orders)

        if product_ids:
            order_items = order_items.filter(product_id__in=product_ids)

        top_products_ordered = (
            order_items.values("product_id", "product__name")
            .annotate(total_quantity=Sum("quantity_ordered"))
            .order_by("-total_quantity")[:5]
        )

        completed_orders_count = orders.filter(
            latest_history_entry__status=InternalOrderHistoryStatusChoices.COMPLETED
        ).count()
        total_orders_count = orders.count()
        order_fulfillment_rate = (
            completed_orders_count / total_orders_count * 100
            if total_orders_count > 0
            else 0
        )

        average_processing_time = (
            orders.filter(
                latest_history_entry__status=InternalOrderHistoryStatusChoices.COMPLETED
            )
            .annotate(
                processing_time=F("latest_history_entry__created_on") - F("created_on")
            )
            .aggregate(average_processing_time=Avg("processing_time"))[
                "average_processing_time"
            ]
        )

        source_target_office_analysis = orders.values(
            "target_office_id",
            "target_office__name",
            "source_office_id",
            "source_office__name",
        ).annotate(
            order_count=Count("id"), total_quantity=Sum("order_items__quantity_ordered")
        )

        top_products_ordered_by_office = []
        order_count_trend_by_office = []
        for office in orders.values(
            "target_office_id", "target_office__name"
        ).distinct():
            office_order_items = order_items.all().filter(
                internal_order__target_office_id=office["target_office_id"]
            )

            if product_ids:
                office_order_items = office_order_items.filter(
                    product_id__in=product_ids
                )

            top_products = (
                office_order_items.values("product_id", "product__name")
                .annotate(total_quantity=Sum("quantity_ordered"))
                .order_by("-total_quantity")
            )

            top_products_ordered_by_office.append(
                TopProductsOrderedByOfficeType(
                    office_id=office["target_office_id"],
                    office_name=office["target_office__name"],
                    top_products=[
                        TopProductsOrderedType(
                            product_id=item["product_id"],
                            product_name=item["product__name"],
                            total_quantity=item["total_quantity"],
                        )
                        for item in top_products
                    ],
                )
            )

            office_orders = orders.all().filter(
                target_office_id=office["target_office_id"]
            )

            office_order_count_trend = []
            if frequency == "daily":
                office_order_count_trend = (
                    office_orders.annotate(date=TruncDay("created_on"))
                    .values("date")
                    .annotate(count=Sum("order_items__quantity_ordered"))
                    .order_by("date")
                )
            elif frequency == "weekly":
                office_order_count_trend = (
                    office_orders.annotate(date=TruncWeek("created_on"))
                    .values("date")
                    .annotate(count=Sum("order_items__quantity_ordered"))
                    .order_by("date")
                )
            elif frequency == "monthly":
                office_order_count_trend = (
                    office_orders.annotate(
                        month=TruncMonth("created_on"), year=TruncYear("created_on")
                    )
                    .values("month", "year")
                    .annotate(count=Sum("order_items__quantity_ordered"))
                    .order_by("year", "month")
                )
            elif frequency == "yearly":
                office_order_count_trend = (
                    office_orders.annotate(year=TruncYear("created_on"))
                    .values("year")
                    .annotate(count=Sum("order_items__quantity_ordered"))
                    .order_by("year")
                )

            order_count_trend_by_office.append(
                OrderCountTrendByOfficeType(
                    office_id=office["target_office_id"],
                    office_name=office["target_office__name"],
                    order_count_trend=[
                        OrderCountTrendType(
                            count=item["count"],
                            date=item["date"] if frequency == "daily" else None,
                            week=None,
                            month=(
                                item["month"].month if frequency == "monthly" else None
                            ),
                            year=item["year"].year if item.get("year") else None,
                        )
                        for item in office_order_count_trend
                    ],
                )
            )

        return InternalOrderReportType(
            order_count_trend=[
                OrderCountTrendType(
                    count=item["count"],
                    date=item["date"] if frequency == "daily" else None,
                    week=None,
                    month=item["month"].month if frequency == "monthly" else None,
                    year=item["year"].year if frequency == item.get("year") else None,
                )
                for item in order_count_trend
            ],
            order_status_distribution=[
                OrderStatusDistributionType(
                    status=item["latest_history_entry__status"], count=item["count"]
                )
                for item in order_status_distribution
            ],
            top_products_ordered=[
                TopProductsOrderedType(
                    product_id=item["product_id"],
                    product_name=item["product__name"],
                    total_quantity=item["total_quantity"],
                )
                for item in top_products_ordered
            ],
            order_fulfillment_rate=OrderFulfillmentRateType(
                fulfillment_rate=order_fulfillment_rate
            ),
            average_order_processing_time=(
                int(average_processing_time.total_seconds() / 86400)
                if average_processing_time
                else 0
            ),
            source_target_office_analysis=[
                SourceTargetOfficeAnalysisType(
                    target_office_id=item["target_office_id"],
                    target_office_name=item["target_office__name"],
                    source_office_id=item["source_office_id"],
                    source_office_name=item["source_office__name"],
                    order_count=item["order_count"],
                    total_quantity=item["total_quantity"],
                )
                for item in source_target_office_analysis
            ],
            top_products_ordered_by_office=top_products_ordered_by_office,
            order_count_trend_by_office=order_count_trend_by_office,
        )
