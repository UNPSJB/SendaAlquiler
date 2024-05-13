import graphene
from django.db.models import Sum, Count
from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderItem,
)

from django.db.models.functions import Coalesce
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear


from utils.graphene import non_null_list_of


class OfficeType(graphene.ObjectType):
    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)


class OrderTrendType(graphene.ObjectType):
    total_quantity = graphene.NonNull(graphene.Int)
    num_orders = graphene.NonNull(graphene.Int)
    date = graphene.Date()
    week = graphene.Int()
    month = graphene.Int()
    year = graphene.Int()


class ProductType(graphene.ObjectType):
    id = graphene.NonNull(graphene.ID)
    name = graphene.NonNull(graphene.String)


class MostOrderedProductType(graphene.ObjectType):
    product = graphene.NonNull(ProductType)
    total_quantity = graphene.NonNull(graphene.Int)
    num_orders = graphene.NonNull(graphene.Int)


class OfficeOrderDetailsType(graphene.ObjectType):
    office = graphene.NonNull(OfficeType)
    total_quantity = graphene.NonNull(graphene.Int)
    num_orders = graphene.NonNull(graphene.Int)
    most_ordered_products = non_null_list_of(MostOrderedProductType)
    orders_trend = non_null_list_of(OrderTrendType)


class SupplierOrderReportType(graphene.ObjectType):
    total_orders = graphene.NonNull(graphene.Int)
    office_order_details = non_null_list_of(OfficeOrderDetailsType)
    most_ordered_products = non_null_list_of(MostOrderedProductType)


class Query(graphene.ObjectType):
    supplier_orders_report = graphene.Field(
        graphene.NonNull(SupplierOrderReportType),
        start_date=graphene.NonNull(graphene.Date),
        end_date=graphene.NonNull(graphene.Date),
        offices_ids=graphene.List(graphene.NonNull(graphene.ID)),
        products_ids=graphene.List(graphene.NonNull(graphene.ID)),
        suppliers_ids=graphene.List(graphene.NonNull(graphene.ID)),
        frequency=graphene.String(required=True),
    )

    def resolve_supplier_orders_report(
        self,
        info,
        start_date,
        end_date,
        frequency="daily",
        offices_ids=None,
        products_ids=None,
        suppliers_ids=None,
    ):
        orders = SupplierOrder.objects.filter(created_on__range=(start_date, end_date))

        if offices_ids:
            orders = orders.filter(target_office_id__in=offices_ids)

        if products_ids:
            orders = orders.filter(order_items__product_id__in=products_ids)

        if suppliers_ids:
            orders = orders.filter(supplier_id__in=suppliers_ids)

        # Obtener el total de órdenes
        total_orders = orders.count()

        # Obtener los detalles de pedidos por sucursal
        office_order_details = (
            orders.values("target_office__id", "target_office__name")
            .annotate(
                total_quantity=Sum("order_items__quantity_ordered"),
                num_orders=Count("id"),
            )
            .order_by("-total_quantity")
        )

        global_most_ordered_products_items = SupplierOrderItem.objects.filter(
            supplier_order__in=orders
        )

        if products_ids:
            global_most_ordered_products_items = (
                global_most_ordered_products_items.filter(product_id__in=products_ids)
            )

        most_ordered_products = (
            global_most_ordered_products_items.values("product__id", "product__name")
            .annotate(
                total_quantity=Sum("quantity_ordered"),
                num_orders=Count("supplier_order"),
            )
            .order_by("-total_quantity")
        )[0:5]

        # Obtener los productos más pedidos por sucursal
        for office_detail in office_order_details:
            office_most_ordered_products = SupplierOrderItem.objects.filter(
                supplier_order__target_office_id=office_detail["target_office__id"],
                supplier_order__in=orders,
            )

            if products_ids:
                office_most_ordered_products = office_most_ordered_products.filter(
                    product_id__in=products_ids
                )

            office_detail["most_ordered_products"] = (
                office_most_ordered_products.values("product__id", "product__name")
                .annotate(
                    total_quantity=Sum("quantity_ordered"),
                    num_orders=Count("supplier_order"),
                )
                .order_by("-total_quantity")[:5]
            )

        # Obtener las tendencias de pedidos por fecha
        order_trends_items = SupplierOrderItem.objects.filter(
            supplier_order__in=orders,
        )

        if products_ids:
            order_trends_items = order_trends_items.filter(product_id__in=products_ids)

        for office_detail in office_order_details:
            office_trends_items = order_trends_items.all().filter(
                supplier_order__target_office_id=office_detail["target_office__id"]
            )

            if frequency == "daily":
                office_trends_items = (
                    office_trends_items.values(
                        date=TruncDay("supplier_order__created_on")
                    )
                    .annotate(
                        total_quantity=Sum("quantity_ordered"),
                        num_orders=Count("supplier_order"),
                    )
                    .order_by("date")
                )
            elif frequency == "weekly":
                office_trends_items = (
                    office_trends_items.values(
                        week=TruncWeek("supplier_order__created_on")
                    )
                    .annotate(
                        total_quantity=Sum("quantity_ordered"),
                        num_orders=Count("supplier_order"),
                    )
                    .order_by("week")
                )
            elif frequency == "monthly":
                office_trends_items = (
                    office_trends_items.values(
                        month=TruncMonth("supplier_order__created_on"),
                        year=TruncYear("supplier_order__created_on"),
                    )
                    .annotate(
                        total_quantity=Sum("quantity_ordered"),
                        num_orders=Count("supplier_order"),
                    )
                    .order_by("month")
                )
            elif frequency == "yearly":
                office_trends_items = (
                    office_trends_items.values(
                        year=TruncYear("supplier_order__created_on")
                    )
                    .annotate(
                        total_quantity=Sum("quantity_ordered"),
                        num_orders=Count("supplier_order"),
                    )
                    .order_by("year")
                )

            office_detail["orders_trend"] = office_trends_items

        return SupplierOrderReportType(
            total_orders=total_orders,
            most_ordered_products=(
                [
                    MostOrderedProductType(
                        product=ProductType(
                            id=product["product__id"], name=product["product__name"]
                        ),
                        total_quantity=product["total_quantity"],
                        num_orders=product["num_orders"],
                    )
                    for product in most_ordered_products
                ]
            ),
            office_order_details=[
                OfficeOrderDetailsType(
                    office=OfficeType(
                        id=detail["target_office__id"],
                        name=detail["target_office__name"],
                    ),
                    total_quantity=detail["total_quantity"],
                    num_orders=detail["num_orders"],
                    most_ordered_products=[
                        MostOrderedProductType(
                            product=ProductType(
                                id=product["product__id"], name=product["product__name"]
                            ),
                            total_quantity=product["total_quantity"],
                            num_orders=product["num_orders"],
                        )
                        for product in detail["most_ordered_products"]
                    ],
                    orders_trend=[
                        OrderTrendType(
                            total_quantity=trend["total_quantity"],
                            num_orders=trend["num_orders"],
                            date=trend.get("date"),
                            week=trend.get("week"),
                            month=(
                                trend.get("month").month if trend.get("month") else None
                            ),
                            year=(
                                trend.get("year").year if trend.get("year") else None
                            ),
                        )
                        for trend in detail["orders_trend"]
                    ],
                )
                for detail in office_order_details
            ],
        )
