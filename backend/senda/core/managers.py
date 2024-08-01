from typing import TYPE_CHECKING, Any, List, Optional, TypedDict

from django.db import models, transaction


if TYPE_CHECKING:
    from senda.core.models.clients import Client
    from senda.core.models.localities import LocalityModel, StateChoices
    from senda.core.models.offices import Office
    from senda.core.models.order_internal import InternalOrder
    from senda.core.models.order_supplier import SupplierOrder
    from senda.core.models.suppliers import SupplierModel
    from senda.core.models.employees import EmployeeModel
    from users.models import UserModel


class ClientModelManager(models.Manager["Client"]):
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
    ) -> "Client":
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
        self, client: "Client", locality: "LocalityModel", **kwargs: Any
    ) -> "Client":
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

        if self.filter(postal_code=postal_code).exists():
            raise ValueError("La localidad ya existe")

        return self.create(name=name, postal_code=postal_code, state=state)

    def update_locality(
        self,
        locality: "LocalityModel",
        name: str,
        postal_code: str,
        state: "StateChoices",
    ) -> "LocalityModel":
        """
        Updates an existing locality instance with the provided details.
        """

        if self.filter(postal_code=postal_code).exclude(id=locality.id).exists():
            raise ValueError("Ya existe una localidad con ese código postal")

        locality.name = name
        locality.postal_code = postal_code
        locality.state = state
        locality.save()
        return locality

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
        office_branch: "Office",
        office_destination: "Office",
        user: "UserModel",
        products: List[InternalOrderProductsDict],
    ) -> "InternalOrder":
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

    def update_supplier(
        self,
        supplier: "SupplierModel",
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
        """
        Updates an existing supplier instance with the provided details.
        """

        supplier.cuit = cuit
        supplier.name = name
        supplier.email = email
        supplier.locality = locality
        supplier.house_number = house_number
        supplier.street_name = street_name
        supplier.house_unit = house_unit
        supplier.phone_code = phone_code
        supplier.phone_number = phone_number
        supplier.note = note
        supplier.save()
        return supplier


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
        office_destination: "Office",
        user: "UserModel",
        products: List[SupplierOrderProductsDict],
    ) -> "SupplierOrder":
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


ProductStockInOfficeDict = TypedDict(
    "ProductStockInOfficeDict", {"office_id": str, "stock": int}
)

ProductSupplierDict = TypedDict(
    "ProductSupplierDict", {"supplier_id": str, "price": str}
)

ProductServiceDict = TypedDict(
    "ProductServiceDict", {"service_id": Optional[str], "name": str, "price": str}
)


SaleProductsItemDict = TypedDict(
    "SaleProductsItemDict",
    {"product": str, "quantity": int, "total": int, "discount": int},
)

ContractProductsItemOfficeDict = TypedDict(
    "ContractProductsItemOfficeDict",
    {"quantity": int, "office_id": str},
)

ContractProductsItemDict = TypedDict(
    "ContractProductsItemDict",
    {
        "id": str,
        "service": Optional[str],
        "offices_orders": List[ContractProductsItemOfficeDict],
    },
)


class EmployeeModelManager(models.Manager["EmployeeModel"]):
    """
    Custom manager for the EmployeeModel, providing methods to create and update employee instances.
    """

    @transaction.atomic
    def create_employee(self, user: "UserModel", offices: List[str]):
        from senda.core.models.offices import Office
        from senda.core.models.employees import EmployeeOffice

        """
        Creates a new employee instance, ensuring the user does not already have an associated employee.
        """
        if self.filter(user=user).exists():
            raise ValueError("Ya existe ese empleado")

        employee = self.create(user=user)

        for office_id in offices:
            office = Office.objects.get(id=office_id)
            EmployeeOffice.objects.create(employee=employee, office=office)

        return employee

    def update_employee_offices(self, employee: "EmployeeModel", offices: List[str]):
        from senda.core.models.offices import Office
        from senda.core.models.employees import EmployeeOffice

        """
        Updates the offices associated with the given employee.
        """

        EmployeeOffice.objects.filter(employee=employee).exclude(
            office_id__in=offices
        ).delete()

        for office_id in offices:
            office = Office.objects.get(id=office_id)

            if not EmployeeOffice.objects.filter(
                employee=employee, office=office
            ).exists():
                EmployeeOffice.objects.create(employee=employee, office=office)

        return employee
