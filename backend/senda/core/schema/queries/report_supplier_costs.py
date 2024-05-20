import graphene
from django.db.models import Sum, Avg, Count
from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderItem,
)

from django.db.models.functions import Coalesce
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear


from utils.graphene import non_null_list_of


class SupplierType(graphene.ObjectType):
    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)


class ProductType(graphene.ObjectType):
    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)


class PriceTrendType(graphene.ObjectType):
    avg_price = graphene.NonNull(graphene.Float)
    date = graphene.Date()
    week = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()


class NumbersBySupplierType(graphene.ObjectType):
    supplier = graphene.NonNull(SupplierType)
    avg_price = graphene.NonNull(graphene.Float)
    num_orders = graphene.NonNull(graphene.Int)
    total_cost = graphene.NonNull(graphene.Float)


class TrendsBySupplierType(graphene.ObjectType):
    supplier = graphene.NonNull(SupplierType)
    price_trend = non_null_list_of(PriceTrendType)


class ProductCostDetailsType(graphene.ObjectType):
    product = graphene.NonNull(ProductType)
    avg_price = graphene.NonNull(graphene.Float)
    total_cost = graphene.NonNull(graphene.Float)
    num_orders = graphene.NonNull(graphene.Int)
    trends = non_null_list_of(PriceTrendType)
    trends_by_supplier = non_null_list_of(TrendsBySupplierType)
    numbers_by_supplier = non_null_list_of(NumbersBySupplierType)


class CostReportType(graphene.ObjectType):
    product_cost_details = non_null_list_of(ProductCostDetailsType)
    total_cost = graphene.NonNull(graphene.Float)
    num_orders = graphene.NonNull(graphene.Int)
    num_products = graphene.NonNull(graphene.Int)


class Query(graphene.ObjectType):
    cost_report = graphene.Field(
        graphene.NonNull(CostReportType),
        start_date=graphene.NonNull(graphene.Date),
        end_date=graphene.NonNull(graphene.Date),
        suppliers_ids=graphene.List(graphene.NonNull(graphene.ID)),
        products_ids=graphene.List(graphene.NonNull(graphene.ID)),
        frequency=graphene.String(required=True),
    )

    def resolve_cost_report(
        self,
        info,
        start_date,
        end_date,
        frequency="daily",
        suppliers_ids=None,
        products_ids=None,
    ):
        orders = SupplierOrder.objects.filter(created_on__range=(start_date, end_date))

        if suppliers_ids:
            orders = orders.filter(supplier_id__in=suppliers_ids)

        order_items = SupplierOrderItem.objects.filter(supplier_order__in=orders)

        if products_ids:
            order_items = order_items.filter(product_id__in=products_ids)
            product_ids = products_ids
        else:
            product_ids = order_items.values_list("product_id", flat=True).distinct()

        product_cost_details = []

        for product_id in product_ids:
            product_order_items = order_items.filter(product_id=product_id)

            if not product_order_items.exists():
                continue

            if frequency == "daily":
                price_trend = (
                    product_order_items.values(
                        date=TruncDay("supplier_order__created_on")
                    )
                    .annotate(avg_price=Avg("product_price"))
                    .order_by("date")
                )
            elif frequency == "weekly":
                price_trend = (
                    product_order_items.values(
                        week=TruncWeek("supplier_order__created_on")
                    )
                    .annotate(avg_price=Avg("product_price"))
                    .order_by("week")
                )
            elif frequency == "monthly":
                price_trend = (
                    product_order_items.values(
                        month=TruncMonth("supplier_order__created_on"),
                        year=TruncYear("supplier_order__created_on"),
                    )
                    .annotate(avg_price=Avg("product_price"))
                    .order_by("month")
                )
            elif frequency == "yearly":
                price_trend = (
                    product_order_items.values(
                        year=TruncYear("supplier_order__created_on")
                    )
                    .annotate(avg_price=Avg("product_price"))
                    .order_by("year")
                )

            product_data = {
                "product": ProductType(
                    id=str(product_id), name=product_order_items.first().product.name
                ),
                "avg_price": product_order_items.aggregate(
                    avg_price=Avg("product_price")
                )["avg_price"],
                "total_cost": product_order_items.aggregate(total_cost=Sum("total"))[
                    "total_cost"
                ],
                "num_orders": product_order_items.aggregate(
                    num_orders=Count("supplier_order", distinct=True)
                )["num_orders"],
                "trends": [
                    PriceTrendType(
                        avg_price=trend["avg_price"],
                        date=trend.get("date"),
                        week=trend.get("week"),
                        month=(
                            trend.get("month").month if trend.get("month") else None
                        ),
                        year=(trend.get("year").year if trend.get("year") else None),
                    )
                    for trend in price_trend
                ],
                "trends_by_supplier": [],
                "numbers_by_supplier": [],
            }

            for supplier_id in product_order_items.values_list(
                "supplier_order__supplier_id", flat=True
            ).distinct():
                supplier_order_items = product_order_items.filter(
                    supplier_order__supplier_id=supplier_id
                )

                if frequency == "daily":
                    supplier_price_trend = (
                        supplier_order_items.values(
                            date=TruncDay("supplier_order__created_on")
                        )
                        .annotate(avg_price=Avg("product_price"))
                        .order_by("date")
                    )
                elif frequency == "weekly":
                    supplier_price_trend = (
                        supplier_order_items.values(
                            week=TruncWeek("supplier_order__created_on")
                        )
                        .annotate(avg_price=Avg("product_price"))
                        .order_by("week")
                    )
                elif frequency == "monthly":
                    supplier_price_trend = (
                        supplier_order_items.values(
                            month=TruncMonth("supplier_order__created_on"),
                            year=TruncYear("supplier_order__created_on"),
                        )
                        .annotate(avg_price=Avg("product_price"))
                        .order_by("month")
                    )
                elif frequency == "yearly":
                    supplier_price_trend = (
                        supplier_order_items.values(
                            year=TruncYear("supplier_order__created_on")
                        )
                        .annotate(avg_price=Avg("product_price"))
                        .order_by("year")
                    )

                supplier_data = {
                    "supplier": SupplierType(
                        id=str(supplier_id),
                        name=supplier_order_items.first().supplier_order.supplier.name,
                    ),
                    "price_trend": [
                        PriceTrendType(
                            avg_price=trend["avg_price"],
                            date=trend.get("date"),
                            week=trend.get("week"),
                            month=(
                                trend.get("month").month if trend.get("month") else None
                            ),
                            year=(
                                trend.get("year").year if trend.get("year") else None
                            ),
                        )
                        for trend in supplier_price_trend
                    ],
                }

                numbers_by_supplier_data = {
                    "supplier": SupplierType(
                        id=str(supplier_id),
                        name=supplier_order_items.first().supplier_order.supplier.name,
                    ),
                    "avg_price": supplier_order_items.aggregate(
                        avg_price=Avg("product_price")
                    )["avg_price"],
                    "num_orders": supplier_order_items.aggregate(
                        num_orders=Count("supplier_order")
                    )["num_orders"],
                    "total_cost": supplier_order_items.aggregate(
                        total_cost=Sum("total")
                    )["total_cost"],
                }

                product_data["trends_by_supplier"].append(
                    TrendsBySupplierType(**supplier_data)
                )
                product_data["numbers_by_supplier"].append(
                    NumbersBySupplierType(**numbers_by_supplier_data)
                )

            product_cost_details.append(ProductCostDetailsType(**product_data))

        total_cost = order_items.aggregate(total_cost=Coalesce(Sum("total"), 0))[
            "total_cost"
        ]
        num_orders = order_items.aggregate(num_orders=Count("supplier_order"))[
            "num_orders"
        ]
        num_products = len(product_cost_details)

        return CostReportType(
            product_cost_details=product_cost_details,
            total_cost=total_cost,
            num_orders=num_orders,
            num_products=num_products,
        )
