from typing import List, TypedDict
from django.db import models, transaction
from django.core.exceptions import ValidationError

from extensions.db.models import TimeStampedModel
from .clients import Client
from .products import Product, ProductTypeChoices


class SaleCreationError(Exception):
    """Custom exception for sale creation errors."""


class SaleItemDict(TypedDict, total=False):
    product_id: int
    quantity: int
    discount: int


class ItemTotalsDict(TypedDict):
    subtotal: int
    discount: int
    total: int


class SaleManager(models.Manager["Sale"]):
    def validate_product(self, product: Product, item: SaleItemDict, office_id: int):
        if not product:
            raise SaleCreationError(
                f"Product with id {item.get('product_id')} not found."
            )

        if product.type != ProductTypeChoices.COMERCIABLE:
            raise SaleCreationError(
                f"Product with id {item.get('product_id')} is not COMERCIABLE."
            )

        stock_for_office = product.get_stock_for_office(office_id)

        if not stock_for_office:
            raise SaleCreationError(
                f"Product with id {item.get('product_id')} is not available for sale in this office."
            )

        if stock_for_office < item["quantity"]:
            raise SaleCreationError(
                f"Product with id {item.get('product_id')} does not have enough stock."
            )

        if item["quantity"] <= 0:
            raise SaleCreationError(
                f"Product with id {item.get('product_id')} quantity must be greater than 0."
            )

    def calculate_item_totals(
        self, item: SaleItemDict, product_price: int
    ) -> ItemTotalsDict:
        subtotal = product_price * item.get("quantity")
        discount = item.get("discount", 0)
        total = subtotal - discount
        return ItemTotalsDict(subtotal=subtotal, discount=discount, total=total)

    def create_sale(
        self, client_id: int, office_id: int, sale_item_dicts: List[SaleItemDict]
    ) -> "Sale":
        try:
            with transaction.atomic():
                sale = self.create(client_id=client_id, office_id=office_id)
                sale_items: List[SaleItemModel] = []

                for item in sale_item_dicts:
                    product = Product.objects.filter(id=item.get("product_id")).first()
                    if not product:
                        raise SaleCreationError(
                            f"Product with id {item.get('product_id')} not found."
                        )

                    self.validate_product(product, item, office_id)

                    item_totals = self.calculate_item_totals(item, product.price)
                    item_model = SaleItemModel(
                        sale=sale,
                        product=product,
                        product_price=product.price,
                        quantity=item["quantity"],
                        subtotal=item_totals.get("subtotal", 0),
                        discount=item_totals.get("discount", 0),
                        total=item_totals.get("total", 0),
                    )

                    sale_items.append(item_model)
                    product.decrease_stock_in_office(
                        office_id=office_id, quantity=item_model.quantity
                    )

                SaleItemModel.objects.bulk_create(sale_items)
                sale.update_totals()
                return sale
        except ValidationError as e:
            raise SaleCreationError(f"Validation failed: {e}")
        except Exception as e:
            raise SaleCreationError(f"Failed to create sale: {e}")


class Sale(TimeStampedModel):
    sale_items: models.QuerySet["SaleItemModel"]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="sales")
    office = models.ForeignKey("Office", on_delete=models.CASCADE, related_name="sales")

    subtotal = models.PositiveBigIntegerField(default=0)
    discount = models.PositiveBigIntegerField(default=0)
    total = models.PositiveBigIntegerField(default=0)

    objects: SaleManager = SaleManager()

    def update_totals(self):
        self.subtotal = self.sale_items.aggregate(subtotal_sum=models.Sum("subtotal"))[
            "subtotal_sum"
        ]
        self.discount = self.sale_items.aggregate(discount_sum=models.Sum("discount"))[
            "discount_sum"
        ]
        self.total = self.subtotal - self.discount
        self.save()

    def __str__(self):
        return f"{self.created_on} - {self.total}"


class SaleItemModel(TimeStampedModel):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name="sale_items")

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="sale_items"
    )
    product_price = models.PositiveBigIntegerField()

    quantity = models.IntegerField(default=0)

    subtotal = models.PositiveBigIntegerField(default=0)
    discount = models.PositiveBigIntegerField(default=0)
    total = models.PositiveBigIntegerField(default=0)

    objects = models.Manager()

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"
