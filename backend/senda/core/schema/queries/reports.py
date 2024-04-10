from typing import Any, List

import graphene
from senda.core.schema.custom_types import ProductType, OfficeType
from senda.core.models.offices import Office
from senda.core.models.sale import Sale, SaleItemModel
from senda.core.models.products import Product
from utils.graphene import non_null_list_of
from django.db import models

from django.utils import timezone


from senda.core.decorators import employee_or_admin_required, CustomInfo


class ReportMostSoldProductsProductItem(graphene.ObjectType):
    product = graphene.NonNull(ProductType)
    quantity = graphene.NonNull(graphene.Int)
    total_amount = graphene.NonNull(graphene.Int)


class ReportMostSoldProductsByOfficeItem(graphene.ObjectType):
    office = graphene.NonNull(OfficeType)
    items = non_null_list_of(ReportMostSoldProductsProductItem)
    total_quantity = graphene.NonNull(graphene.Int)
    total_amount = graphene.NonNull(graphene.Int)


class ReportMostSoldProductsGeneral(graphene.ObjectType):
    items = non_null_list_of(ReportMostSoldProductsProductItem)
    total_quantity = graphene.NonNull(graphene.Int)
    total_amount = graphene.NonNull(graphene.Int)


class ReportMostSoldProductsQuery(graphene.ObjectType):
    general = graphene.NonNull(ReportMostSoldProductsGeneral)
    by_office = non_null_list_of(ReportMostSoldProductsByOfficeItem)


class Query(graphene.ObjectType):
    report_most_sold_products = graphene.NonNull(
        ReportMostSoldProductsQuery,
        start_date=graphene.Date(),
        end_date=graphene.Date(),
    )

    def resolve_report_most_sold_products(
        self,
        info: CustomInfo,
        start_date: str = None,
        end_date: str = None,
    ) -> ReportMostSoldProductsQuery:
        # start_date = start_date or timezone.now().replace(year=2021, month=1, day=1)
        # start_date = start_date or timezone.now().replace(year=2024, month=1, day=1)
        # end_date = end_date or timezone.now()

        # top 10 most sold products
        most_sold_products = (
            Product.objects.annotate(
                total_quantity=models.Sum(
                    models.Case(
                        models.When(
                            models.Q(
                                sale_items__sale__created_on__range=[
                                    start_date,
                                    end_date,
                                ]
                            ),
                            then="sale_items__quantity",
                        ),
                        default=0,
                        output_field=models.IntegerField(),
                    )
                ),
                total_amount=models.Sum(
                    models.Case(
                        models.When(
                            models.Q(
                                sale_items__sale__created_on__range=[
                                    start_date,
                                    end_date,
                                ]
                            ),
                            then="sale_items__total",
                        ),
                        default=0,
                        output_field=models.DecimalField(),
                    )
                ),
            )
            .order_by("-total_quantity")
            .values("id", "name", "total_quantity", "total_amount")
        )

        most_sold_products_general = most_sold_products[:10]

        # top 10 most sold products by office
        by_office: List[ReportMostSoldProductsByOfficeItem] = []
        for office in Office.objects.all():
            most_sold_products_by_office = (
                Product.objects.annotate(
                    total_quantity=models.Sum(
                        models.Case(
                            models.When(
                                models.Q(
                                    sale_items__sale__office=office,
                                    sale_items__sale__created_on__range=[
                                        start_date,
                                        end_date,
                                    ],
                                ),
                                then="sale_items__quantity",
                            ),
                            default=0,
                            output_field=models.IntegerField(),
                        )
                    ),
                    total_amount=models.Sum(
                        models.Case(
                            models.When(
                                models.Q(
                                    sale_items__sale__office=office,
                                    sale_items__sale__created_on__range=[
                                        start_date,
                                        end_date,
                                    ],
                                ),
                                then="sale_items__total",
                            ),
                            default=0,
                            output_field=models.DecimalField(),
                        )
                    ),
                )
                .order_by("-total_quantity")
                .values("id", "name", "total_quantity", "total_amount")
            )

            most_sold_products_by_office = most_sold_products_by_office[:10]

            by_office.append(
                ReportMostSoldProductsByOfficeItem(
                    office=office,
                    items=[
                        ReportMostSoldProductsProductItem(
                            product=Product.objects.get(id=item["id"]),
                            quantity=item["total_quantity"],
                            total_amount=item["total_amount"],
                        )
                        for item in most_sold_products_by_office
                    ],
                    total_quantity=sum(
                        item["total_quantity"] for item in most_sold_products_by_office
                    ),
                    total_amount=sum(
                        item["total_amount"] for item in most_sold_products_by_office
                    ),
                )
            )

        return ReportMostSoldProductsQuery(
            general=ReportMostSoldProductsGeneral(
                items=[
                    ReportMostSoldProductsProductItem(
                        product=Product.objects.get(id=item["id"]),
                        quantity=item["total_quantity"],
                        total_amount=item["total_amount"],
                    )
                    for item in most_sold_products_general
                ],
                total_quantity=sum(
                    item["total_quantity"] for item in most_sold_products_general
                ),
                total_amount=sum(
                    item["total_amount"] for item in most_sold_products_general
                ),
            ),
            by_office=by_office,
        )
