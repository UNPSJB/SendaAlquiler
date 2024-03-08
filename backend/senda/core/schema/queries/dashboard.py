import graphene

from typing import List

from django.db.models import Count, Sum
from senda.core.models.clients import Client
from senda.core.models.contract import Contract
from senda.core.models.sale import Sale
from senda.core.models.products import Product
from senda.core.schema.custom_types import ProductType, SaleType, ContractType
from utils.graphene import non_null_list_of
from datetime import datetime

from dateutil.relativedelta import relativedelta

from senda.core.decorators import employee_or_admin_required, CustomInfo


class DashboardStatsSalesPerPeriodItem(graphene.ObjectType):
    period = graphene.String(required=True)
    quantity = graphene.Int(required=True)
    amount = graphene.Int(required=True)


class DashboardStatsTopSellingProduct(graphene.ObjectType):
    product = graphene.NonNull(ProductType)
    sales = graphene.Int(required=True)
    count = graphene.Int(required=True)


class DashboardStats(graphene.ObjectType):
    no_sales_current_period = graphene.Int(required=True)
    no_sales_previous_period = graphene.Int(required=True)

    no_clients_current_period = graphene.Int(required=True)
    no_clients_previous_period = graphene.Int(required=True)

    no_contracts_current_period = graphene.Int(required=True)
    no_contracts_previous_period = graphene.Int(required=True)

    top_selling_products = non_null_list_of(DashboardStatsTopSellingProduct)

    recent_sales = non_null_list_of(SaleType)

    sales_per_period = non_null_list_of(DashboardStatsSalesPerPeriodItem)

    upcoming_contracts = non_null_list_of(ContractType)


class DashboardStatsPeriod(graphene.Enum):
    MONTHS_12 = "12_months"
    MONTHS_1 = "1_month"


class Query(graphene.ObjectType):
    dashboard_stats = graphene.Field(
        graphene.NonNull(DashboardStats),
        period=graphene.Argument(
            DashboardStatsPeriod,
            required=True,
        ),
    )

    @employee_or_admin_required
    def resolve_dashboard_stats(self, info: CustomInfo, period: DashboardStatsPeriod):
        current_period_end_date = datetime.utcnow()
        current_period_start_date = datetime.utcnow()

        previous_period_start_date = datetime.utcnow()
        previous_period_end_date = datetime.utcnow()

        if period == DashboardStatsPeriod.MONTHS_12:
            current_period_start_date = current_period_end_date - relativedelta(
                months=12
            )

            previous_period_end_date = current_period_start_date - relativedelta(days=1)
            previous_period_start_date = previous_period_end_date - relativedelta(
                months=12
            )
        elif period == DashboardStatsPeriod.MONTHS_1:
            current_period_start_date = current_period_end_date - relativedelta(
                months=1
            )

            previous_period_end_date = current_period_start_date - relativedelta(days=1)
            previous_period_start_date = previous_period_end_date - relativedelta(
                months=1
            )

        sales_current_period = Sale.objects.filter(
            created_on__gte=current_period_start_date,
            created_on__lte=current_period_end_date,
        ).count()
        sales_previous_period = Sale.objects.filter(
            created_on__gte=previous_period_start_date,
            created_on__lte=previous_period_end_date,
        ).count()

        clients_current_period = Client.objects.filter(
            created_on__gte=current_period_start_date,
            created_on__lte=current_period_end_date,
        ).count()
        clients_previous_period = Client.objects.filter(
            created_on__gte=previous_period_start_date,
            created_on__lte=previous_period_end_date,
        ).count()

        contracts_current_period = Contract.objects.filter(
            created_on__gte=current_period_start_date,
            created_on__lte=current_period_end_date,
        ).count()
        contracts_previous_period = Contract.objects.filter(
            created_on__gte=previous_period_start_date,
            created_on__lte=previous_period_end_date,
        ).count()

        top_selling_products_objects = (
            Product.objects.annotate(
                sales_count=Count("sale_items"),
                sales_amount=Sum("sale_items__total"),
            )
            .order_by("-sales_count")[:5]
            .all()
        )
        top_selling_products = [
            DashboardStatsTopSellingProduct(
                product=product, count=product.sales_count, sales=product.sales_amount
            )
            for product in top_selling_products_objects
        ]

        sales_per_period: List[DashboardStatsSalesPerPeriodItem] = []
        if period == DashboardStatsPeriod.MONTHS_12:
            """for i in range(12):
            period_end = current_period_end_date - timedelta(days=30 * i)
            period_start = current_period_end_date - timedelta(days=30 * (i + 1))

            sales_qs = Sale.objects.filter(
                created_on__gte=period_start, created_on__lte=period_end
            ).aggregate(total_amount=Sum("total"), count=Count("id"))

            sales_per_period.append(
                DashboardStatsSalesPerPeriodItem(
                    period=period_start.strftime("%Y-%m-%d"),
                    quantity=sales_qs.get("count") or 0,
                    amount=sales_qs.get("total_amount") or 0,
                )
            )"""
            pass
        elif period == DashboardStatsPeriod.MONTHS_1:
            # range based on number of days in the month
            # for now, we will use 30 days
            for i in range(30):
                period_end = current_period_end_date - relativedelta(days=i)
                period_start = current_period_end_date - relativedelta(days=i + 1)

                sales_qs = Sale.objects.filter(
                    created_on__gte=period_start, created_on__lte=period_end
                ).aggregate(total_amount=Sum("total"), count=Count("id"))

                sales_per_period.append(
                    DashboardStatsSalesPerPeriodItem(
                        period=period_start.strftime("%Y-%m-%d"),
                        quantity=sales_qs.get("count") or 0,
                        amount=sales_qs.get("total_amount") or 0,
                    )
                )

        recent_sales = Sale.objects.filter(
            created_on__gte=current_period_start_date,
            created_on__lte=current_period_end_date,
        ).order_by("-created_on")[:5]

        upcoming_contracts = Contract.objects.filter(
            contract_start_datetime__gte=current_period_end_date,
        ).order_by("contract_start_datetime")

        return DashboardStats(
            no_sales_current_period=sales_current_period,
            no_sales_previous_period=sales_previous_period,
            no_clients_current_period=clients_current_period,
            no_clients_previous_period=clients_previous_period,
            no_contracts_current_period=contracts_current_period,
            no_contracts_previous_period=contracts_previous_period,
            top_selling_products=top_selling_products,
            recent_sales=recent_sales,
            sales_per_period=sales_per_period,
            upcoming_contracts=upcoming_contracts,
        )
