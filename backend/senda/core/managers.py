from decimal import Decimal, InvalidOperation
from typing import TYPE_CHECKING, Any, List, Optional, TypedDict

from django.db import models, transaction

if TYPE_CHECKING:
    from senda.core.models.clients import ClientModel
    from senda.core.models.localities import LocalityModel, StateChoices
    from senda.core.models.offices import OfficeModel
    from senda.core.models.order_internal import InternalOrderModel
    from senda.core.models.order_supplier import SupplierOrderModel
    from senda.core.models.products import (
        ProductModel,
        ProductTypeChoices,
        ProductStockInOfficeModel,
    )
    from senda.core.models.purchases import PurchaseModel
    from senda.core.models.rental_contracts import RentalContractModel
    from senda.core.models.suppliers import SupplierModel
    from senda.core.models.employees import EmployeeModel, EmployeeOfficeModel
    from users.models import UserModel


class ClientModelManager(models.Manager["ClientModel"]):
    """
    Custom manager for the ClientModel, providing methods to create and update client instances.
    """

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
        """
        Creates a new client instance with the given details. Validates to ensure the email and DNI are unique.
        """

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
        """
        Updates an existing client instance with the provided details.
        """

        client.locality = locality
        for field, value in kwargs.items():
            setattr(client, field, value)
        client.save()
        return client


class LocalityModelManager(models.Manager["LocalityModel"]):
    """
    Custom manager for the LocalityModel, providing methods to create and retrieve locality instances.
    """

    def create_locality(
        self, name: str, postal_code: str, state: "StateChoices"
    ) -> "LocalityModel":
        """
        Creates a new locality instance with the given details. Ensures the locality's uniqueness.
        """
        name = name.strip().lower().title()

        if self.filter(name=name, postal_code=postal_code, state=state).exists():
            raise ValueError("La localidad ya existe")

        return self.create(name=name, postal_code=postal_code, state=state)

    def get_or_create_locality(
        self, name: str, postal_code: int, state: "StateChoices"
    ) -> "LocalityModel":
        """
        Retrieves or creates a locality instance based on the provided details.
        """
        locality, _created = self.get_or_create(
            name=name, postal_code=postal_code, state=state
        )
        return locality


InternalOrderProductsDict = TypedDict(
    "InternalOrderProductsDict", {"id": str, "quantity": int}
)


class InternalOrderManager(models.Manager["InternalOrderModel"]):
    """
    Custom manager for the InternalOrderModel, handling the creation of internal orders.
    """

    @transaction.atomic
    def create_internal_order(
        self,
        office_branch: "OfficeModel",
        office_destination: "OfficeModel",
        user: "UserModel",
        products: List[InternalOrderProductsDict],
    ) -> "InternalOrderModel":
        """
        Creates a new internal order with associated products and history. This process is atomic.
        """
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


class SupplierModelManager(models.Manager["SupplierModel"]):
    @transaction.atomic
    def create_supplier(
        self,
        cuit: str,
        name: str,
        email: str,
        locality: "LocalityModel",
        house_number: str,
        street_name: str,
        house_unit: str,
        phone_code: str,
        phone_number: str,
        note: str,
    ) -> "SupplierModel":
        if self.filter(email=email).exists():
            raise ValueError("Ya existe un proveedor con ese email")

        if self.filter(cuit=cuit).exists():
            raise ValueError("Ya existe un proveedor con ese CUIT")

        return self.create(
            cuit=cuit,
            name=name,
            email=email,
            locality=locality,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            phone_code=phone_code,
            phone_number=phone_number,
            note=note,
        )


SupplierOrderProductsDict = TypedDict(
    "SupplierOrderProductsDict", {"id": str, "quantity": int}
)


class SupplierOrderManager(models.Manager["SupplierOrderModel"]):
    """
    Custom manager for the SupplierOrderModel, handling the creation of supplier orders.
    """

    @transaction.atomic
    def create_supplier_order(
        self,
        supplier: "SupplierModel",
        office_destination: "OfficeModel",
        user: "UserModel",
        products: List[SupplierOrderProductsDict],
    ) -> "SupplierOrderModel":
        """
        Creates a new supplier order with associated products, history, and total cost calculation. This process is atomic.
        """
        from senda.core.models.order_supplier import SupplierOrderHistoryStatusChoices

        supplier_order = self.create(
            supplier=supplier, office_destination=office_destination
        )
        supplier_order.save()

        supplier_order.history.create(
            status=SupplierOrderHistoryStatusChoices.PENDING,
            supplier_order=supplier_order,
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
    """
    Parses a price string into a Decimal object, handling different formatting conventions.
    """

    standard_format_str = price_str.replace(".", "").replace(",", ".")
    try:
        return Decimal(standard_format_str)
    except InvalidOperation:
        raise ValueError(f"The price {price_str} is not a valid number format")


class ProductModelManager(models.Manager["ProductModel"]):
    """
    Custom manager for the ProductModel, providing methods to create product instances with associated details.
    """

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
        """
        Creates a new product instance with various associated data like stock, services, and suppliers.
        """
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

    def get_products_with_stock_in_office(self, office: "OfficeModel", **kwargs: Any):
        """
        Returns all products with associated stock in the given office.
        """
        return self.filter(stock__office=office, **kwargs)


class ProductStockInOfficeManager(models.Manager["ProductStockInOfficeModel"]):
    """
    Custom manager for the ProductStockInOfficeModel, providing methods to create and update stock instances.
    """

    def create_stock(
        self, product: "ProductModel", office: "OfficeModel", stock: int
    ) -> "ProductStockInOfficeModel":
        """
        Creates a new stock instance for the given product and office.
        """
        if self.filter(product=product, office=office).exists():
            raise ValueError("Ya existe un stock para ese producto en esa sucursal")

        return self.create(product=product, office=office, stock=stock)


PurchaseProductsItemDict = TypedDict(
    "PurchaseProductsItemDict", {"product": str, "quantity": int}
)


class PurchaseModelManager(models.Manager["PurchaseModel"]):
    """
    Custom manager for the PurchaseModel, handling the creation of purchase instances.
    """

    @transaction.atomic
    def create_purchase(
        self,
        client: "ClientModel",
        office: str,
        products: List[PurchaseProductsItemDict],
    ) -> "PurchaseModel":
        """
        Creates a new purchase instance with associated purchase items. This process is atomic.
        """
        purchase = self.create(client=client, office_id=office)
        purchase.save()

        for product in products:
            purchase.purchase_items.create(
                quantity=product["quantity"],
                product_id=product["product"],
            )

        purchase.recalculate_total()

        return purchase


RentalContractProductsItemDict = TypedDict(
    "RentalContractProductsItemDict",
    {"id": str, "quantity": int, "service": Optional[str]},
)


class RentalContractManager(models.Manager["RentalContractModel"]):
    """
    Custom manager for the RentalContractModel, handling the creation of rental contract instances.
    """

    @transaction.atomic
    def create_rental_contract(
        self,
        client: "ClientModel",
        products: List[RentalContractProductsItemDict],
        office: str,
        locality: "LocalityModel",
        house_number: str,
        street_name: str,
        house_unit: str,
        contract_start_datetime: str,
        contract_end_datetime: str,
    ) -> "RentalContractModel":
        """
        Creates a new rental contract with associated items and history. This process is atomic.
        """
        from senda.core.models.rental_contracts import RentalContractStatusChoices

        rental_contract = self.create(
            client=client,
            office_id=office,
            locality=locality,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            contract_start_datetime=contract_start_datetime,
            contract_end_datetime=contract_end_datetime,
        )

        for product in products:
            rental_contract.rental_contract_items.create(
                product_id=product["id"],
                service_id=product["service"],
                quantity=product["quantity"],
            )

        rental_contract.rental_contract_history.create(
            status=RentalContractStatusChoices.PRESUPUESTADO,
            rental_contract=rental_contract,
        )

        return rental_contract


class EmployeeModelManager(models.Manager["EmployeeModel"]):
    """
    Custom manager for the EmployeeModel, providing methods to create and update employee instances.
    """

    @transaction.atomic
    def create_employee(self, user: "UserModel", offices: List[str]):
        from senda.core.models.offices import OfficeModel
        from senda.core.models.employees import EmployeeOfficeModel

        """
        Creates a new employee instance, ensuring the user does not already have an associated employee.
        """
        if self.filter(user=user).exists():
            raise ValueError("Ya existe ese empleado")

        employee = self.create(user=user)

        for office_id in offices:
            office = OfficeModel.objects.get(id=office_id)
            EmployeeOfficeModel.objects.create(employee=employee, office=office)

        return employee

    def update_employee(self, employee: "EmployeeModel", **kwargs: Any):
        """
        Updates an existing employee instance with the provided details.
        """
        for field, value in kwargs.items():
            setattr(employee, field, value)
        employee.save()
        return employee
