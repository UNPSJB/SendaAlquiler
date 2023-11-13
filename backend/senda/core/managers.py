from decimal import Decimal, InvalidOperation
from typing import TYPE_CHECKING, Any, List, Optional, TypedDict

from django.db import models, transaction

if TYPE_CHECKING:
    from senda.core.models.clients import ClientModel
    from senda.core.models.localities import LocalityModel, StateChoices
    from senda.core.models.offices import OfficeModel
    from senda.core.models.order_internal import InternalOrderModel
    from senda.core.models.order_supplier import SupplierOrderModel
    from senda.core.models.products import ProductModel, ProductTypeChoices
    from senda.core.models.purchases import PurchaseModel
    from senda.core.models.rental_contracts import RentalContractModel
    from senda.core.models.suppliers import SupplierModel
    from users.models import UserModel


class ClientModelManager(models.Manager["ClientModel"]):
    def create_client(
        self,
        email: str,
        first_name: str,
        last_name: str,
        locality: "LocalityModel",
        house_number: str,
        street_name: str,
        house_unit: str,
        dni: str,
        phone_code: str,
        phone_number: str,
    ) -> "ClientModel":
        if self.filter(email=email).exists():
            raise ValueError("Ya existe un cliente con ese email")

        if self.filter(dni=dni).exists():
            raise ValueError("Ya existe un cliente con ese DNI")

        return self.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            locality=locality,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            dni=dni,
            phone_code=phone_code,
            phone_number=phone_number,
        )

    def update_client(
        self, client: "ClientModel", locality: "LocalityModel", **kwargs: Any
    ) -> "ClientModel":
        client.locality = locality
        for field, value in kwargs.items():
            setattr(client, field, value)
        client.save()
        return client


class LocalityModelManager(models.Manager["LocalityModel"]):
    def create_locality(
        self, name: str, postal_code: str, state: "StateChoices"
    ) -> "LocalityModel":
        name = name.strip().lower().title()

        if self.filter(name=name, postal_code=postal_code, state=state).exists():
            raise ValueError("La localidad ya existe")

        return self.create(name=name, postal_code=postal_code, state=state)

    def get_or_create_locality(
        self, name: str, postal_code: int, state: "StateChoices"
    ) -> "LocalityModel":
        locality, _created = self.get_or_create(
            name=name, postal_code=postal_code, state=state
        )
        return locality


InternalOrderProductsDict = TypedDict(
    "InternalOrderProductsDict", {"id": str, "quantity": int}
)


class InternalOrderManager(models.Manager["InternalOrderModel"]):
    @transaction.atomic
    def create_internal_order(
        self,
        office_branch: "OfficeModel",
        office_destination: "OfficeModel",
        user: "UserModel",
        products: List[InternalOrderProductsDict],
    ) -> "InternalOrderModel":
        from senda.core.models.order_internal import InternalOrderHistoryStatusChoices

        internal_order = self.create(
            office_branch=office_branch, office_destination=office_destination
        )
        internal_order.save()
        internal_order.history.create(
            status=InternalOrderHistoryStatusChoices.PENDING,
            internal_order=internal_order,
            user=user,
        )

        for product in products:
            internal_order.orders.create(
                product_id=product["id"],
                quantity=product["quantity"],
            )

        return internal_order


SupplierOrderProductsDict = TypedDict(
    "SupplierOrderProductsDict", {"id": str, "quantity": int}
)


class SupplierOrderManager(models.Manager["SupplierOrderModel"]):
    @transaction.atomic
    def create_supplier_order(
        self,
        supplier: "SupplierModel",
        office_destination: "OfficeModel",
        user: "UserModel",
        products: List[SupplierOrderProductsDict],
        total: float,
    ) -> "SupplierOrderModel":
        from senda.core.models.order_supplier import SupplierOrderHistoryStatusChoices

        supplier_order = self.create(
            supplier=supplier, office_destination=office_destination
        )
        supplier_order.save()

        supplier_order.history.create(
            status=SupplierOrderHistoryStatusChoices.PENDING,
            supplier_order=supplier_order,
            user=user,
            total=total,
        )

        for product in products:
            supplier_order.orders.create(
                product_id=product["id"],
                quantity=product["quantity"],
            )

        supplier_order.total = supplier_order.calculate_total()

        return supplier_order


ProductStockInOfficeModelDict = TypedDict(
    "ProductStockInOfficeModelDict", {"office_id": str, "stock": int}
)

ProductSupplierDict = TypedDict(
    "ProductSupplierDict", {"supplier_id": str, "price": str}
)

ProductServiceDict = TypedDict("ProductServiceDict", {"name": str, "price": str})


def parse_price(price_str: str) -> Decimal:
    # Replace dots with nothing and commas with dots
    standard_format_str = price_str.replace(".", "").replace(",", ".")
    try:
        return Decimal(standard_format_str)
    except InvalidOperation:
        raise ValueError(f"The price {price_str} is not a valid number format")


class ProductModelManager(models.Manager["ProductModel"]):
    def create_product(
        self,
        sku: str,
        name: str,
        brand_id: str,
        description: str,
        type: "ProductTypeChoices",
        price: str,
        stock: List[ProductStockInOfficeModelDict],
        services: List[ProductServiceDict],
        suppliers: List[ProductSupplierDict],
    ) -> "ProductModel":
        if self.filter(sku=sku).exists():
            raise ValueError("Ya existe un producto con ese sku")

        product = self.create(
            sku=sku,
            name=name,
            brand_id=brand_id,
            description=description,
            type=type,
            price=parse_price(price),
        )

        for stock_data in stock:
            product.stock.create(
                office_id=stock_data["office_id"],
                stock=stock_data["stock"],
            )

        for service_data in services:
            product.services.create(
                name=service_data["name"],
                price=parse_price(service_data["price"]),
            )

        for supplier_data in suppliers:
            product.suppliers.create(
                supplier_id=supplier_data["supplier_id"],
                price=parse_price(supplier_data["price"]),
            )

        return product


PurchaseProductsItemDict = TypedDict(
    "PurchaseProductsItemDict", {"id": str, "quantity": int}
)


class PurchaseModelManager(models.Manager["PurchaseModel"]):
    @transaction.atomic
    def create_purchase(
        self,
        client: "ClientModel",
        products: List[PurchaseProductsItemDict],
        office: "OfficeModel",
    ) -> "PurchaseModel":
        purchase = self.create(
            client=client,
            office=office,
        )

        for product in products:
            purchase.purchase_items.create(
                quantity=product["quantity"],
                product_id=product["id"],
                purchase_Products=purchase,
            )

        return purchase


RentalContractProductsItemDict = TypedDict(
    "RentalContractProductsItemDict",
    {"id": str, "quantity": int, "service": Optional[str]},
)


class RentalContractManager(models.Manager["RentalContractModel"]):
    @transaction.atomic
    def create_rental_contract(
        self,
        client: "ClientModel",
        products: List[RentalContractProductsItemDict],
        office: "OfficeModel",
        locality: "LocalityModel",
        house_number: str,
        street_name: str,
        house_unit: str,
        contract_start_datetime: str,
        contract_end_datetime: str,
    ) -> "RentalContractModel":
        from senda.core.models.rental_contracts import RentalContractStatusChoices

        rental_contract = self.create(
            client=client,
            office=office,
            locality=locality,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            contract_start_datetime=contract_start_datetime,
            contract_end_datetime=contract_end_datetime,
        )

        for product in products:
            rental_contract.rental_contract_items.create(
                quantity=product["quantity"],
                product_id=product["id"],
            )

        rental_contract.rental_contract_history.create(
            status=RentalContractStatusChoices.PRESUPUESTADO,
            rental_contract=rental_contract,
        )

        return rental_contract
