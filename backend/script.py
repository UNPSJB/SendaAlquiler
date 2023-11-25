import os
import django
from faker import Faker
import random

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "your_project.settings")
django.setup()

from senda.core.models.clients import ClientModel
from senda.core.models.employees import EmployeeModel
from senda.core.models.localities import LocalityModel, StateChoices
from senda.core.models.offices import OfficeModel
from users.models import UserModel
from senda.core.models.suppliers import SupplierModel
from senda.core.models.products import (
    ProductModel,
    ProductStockInOfficeModel,
    ProductSupplierModel,
    ProductTypeChoices,
    ProductServiceModel,
    BrandModel,
)
from senda.core.models.order_internal import (
    InternalOrderModel,
    InternalOrderHistoryModel,
    InternalOrderProduct,
    InternalOrderHistoryStatusChoices,
)
from senda.core.models.order_supplier import (
    SupplierOrderModel,
    SupplierOrderProduct,
    SupplierOrderHistoryModel,
    SupplierOrderHistoryStatusChoices,
)
from senda.core.models.purchases import PurchaseModel, PurchaseItemModel
from senda.core.models.rental_contracts import (
    RentalContractModel,
    RentalContractItemModel,
    RentalContractHistoryModel,
    RentalContractStatusChoices,
)
from django.db import transaction

# Initialize Faker
fake = Faker(locale="es_AR")

from senda.core.models.localities import LocalityModel, StateChoices

some_chubut_cities_along_postal_code = [
    {
        "name": "Rawson",
        "postal_code": "9103",
    },
    {
        "name": "Trelew",
        "postal_code": "9100",
    },
    {
        "name": "Puerto Madryn",
        "postal_code": "9120",
    },
    {
        "name": "Comodoro Rivadavia",
        "postal_code": "9000",
    },
    {
        "name": "Esquel",
        "postal_code": "9200",
    },
    {
        "name": "Sarmiento",
        "postal_code": "9007",
    },
    {
        "name": "Gaiman",
        "postal_code": "9105",
    },
    {
        "name": "Trevelin",
        "postal_code": "9203",
    },
    {
        "name": "Rada Tilly",
        "postal_code": "9001",
    },
    {
        "name": "Lago Puelo",
        "postal_code": "9211",
    },
    {
        "name": "El Hoyo",
        "postal_code": "9213",
    },
    {
        "name": "El Maitén",
        "postal_code": "9214",
    },
    {
        "name": "Epuyén",
        "postal_code": "9215",
    },
    {
        "name": "Cholila",
        "postal_code": "9217",
    },
    {
        "name": "Camarones",
        "postal_code": "9121",
    },
    {
        "name": "Dolavon",
        "postal_code": "9105",
    },
    {
        "name": "Gastre",
        "postal_code": "9201",
    },
    {
        "name": "Gualjaina",
        "postal_code": "9213",
    },
    {
        "name": "Lago Blanco",
        "postal_code": "9005",
    },
    {
        "name": "Lago Vintter",
        "postal_code": "9005",
    },
    {
        "name": "Las Plumas",
        "postal_code": "9101",
    },
    {
        "name": "Los Altares",
        "postal_code": "9005",
    },
    {
        "name": "Paso de Indios",
        "postal_code": "9205",
    },
]


@transaction.atomic
def create_fixture_data():
    for city in some_chubut_cities_along_postal_code:
        LocalityModel.objects.create(
            name=city["name"],
            postal_code=city["postal_code"],
            state=StateChoices.CHUBUT,
        )

    localities = list(LocalityModel.objects.all())

    for _ in range(30):
        # Generate fake data for each client
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}@example.com"
        house_number = str(fake.building_number())
        street_name = fake.street_name()
        house_unit = random.choice([str(fake.random_int(min=1, max=100)), ""])
        dni = "".join([str(random.randint(0, 9)) for _ in range(8)])
        phone_code = "".join([str(random.randint(0, 9)) for _ in range(4)])
        phone_number = "".join([str(random.randint(0, 9)) for _ in range(6)])

        # Select a random locality
        locality = random.choice(localities)

        # Create a new client instance
        client = ClientModel(
            first_name=first_name,
            last_name=last_name,
            email=email,
            house_number=house_number,
            street_name=street_name,
            house_unit=house_unit,
            dni=dni,
            phone_code=phone_code,
            phone_number=phone_number,
            locality=locality,
        )

        # Save the instance to the database
        client.save()

    # create employees
    for _ in range(10):
        # Generate fake data for each employee
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"{first_name.lower()}.{last_name.lower()}@example.com"

        user = UserModel.objects.create_user(
            email=email,
            password="12345678",
            first_name=first_name,
            last_name=last_name,
        )

        # Create a new employee instance
        employee = EmployeeModel(user=user)

        # Save the instance to the database
        employee.save()

    # create offices
    OfficeModel.objects.create(
        name="Sucursal en Trelew",
        street="25 de Mayo",
        house_number="123",
        locality=LocalityModel.objects.get(name="Trelew"),
    )

    OfficeModel.objects.create(
        name="Sucursal en Puerto Madryn",
        street="Av. Roca",
        house_number="123",
        locality=LocalityModel.objects.get(name="Puerto Madryn"),
    )

    OfficeModel.objects.create(
        name="Sucursal en Comodoro Rivadavia",
        street="Av. Rivadavia",
        house_number="123",
        locality=LocalityModel.objects.get(name="Comodoro Rivadavia"),
    )

    # create suppliers
    for _ in range(10):
        SupplierModel.objects.create(
            name=fake.company(),
            cuit=fake.isbn10(),
            email=fake.email(),
            phone_code=fake.random_int(min=1000, max=9999),
            phone_number=fake.random_int(min=100000, max=999999),
            street_name=fake.street_name(),
            house_number=fake.building_number(),
            locality=LocalityModel.objects.order_by("?").first(),
        )

    # Create 10 brands with hardcoded names
    for _ in range(10):
        BrandModel.objects.create(
            name=fake.company(),
        )

    # Create 10 products COMERCIABLE
    for _ in range(10):
        product = ProductModel.objects.create(
            name=fake.word(),
            description=fake.sentence(),
            price=str(random.randint(100, 1000)),
            sku=fake.isbn10(),
            brand=BrandModel.objects.order_by("?").first(),
            type=ProductTypeChoices.COMERCIABLE,
        )

        # Create random stock in offices
        offices = OfficeModel.objects.order_by("?")[: random.randint(1, 3)]
        for office in offices:
            ProductStockInOfficeModel.objects.create(
                product=product,
                office=office,
                stock=random.randint(1, 100),
            )

        # Create random suppliers
        suppliers = SupplierModel.objects.order_by("?")[: random.randint(1, 3)]
        for supplier in suppliers:
            ProductSupplierModel.objects.create(
                product=product,
                supplier=supplier,
                price=random.randint(100, 1000),
            )

    # Create products ALQUILABLE
    product = ProductModel.objects.create(
        name="Baño",
        description=fake.sentence(),
        price=str(random.randint(100, 1000)),
        sku=fake.isbn10(),
        brand=BrandModel.objects.order_by("?").first(),
        type=ProductTypeChoices.ALQUILABLE,
    )

    # Create random stock in offices
    offices = OfficeModel.objects.order_by("?")[: random.randint(1, 3)]
    for office in offices:
        ProductStockInOfficeModel.objects.create(
            product=product,
            office=office,
            stock=random.randint(1, 100),
        )

    # Create random suppliers
    suppliers = SupplierModel.objects.order_by("?")[: random.randint(1, 3)]
    for supplier in suppliers:
        ProductSupplierModel.objects.create(
            product=product,
            supplier=supplier,
            price=random.randint(100, 1000),
        )

    ProductServiceModel.objects.create(
        product=product,
        name="Limpieza en evento",
        price=random.randint(100, 1000),
    )

    ProductServiceModel.objects.create(
        product=product,
        name="Limpieza en obre",
        price=random.randint(100, 1000),
    )

    product = ProductModel.objects.create(
        name="Carpa chica",
        description=fake.sentence(),
        price=str(random.randint(100, 1000)),
        sku=fake.isbn10(),
        brand=BrandModel.objects.order_by("?").first(),
        type=ProductTypeChoices.ALQUILABLE,
    )

    # Create random stock in offices
    offices = OfficeModel.objects.order_by("?")[: random.randint(1, 3)]
    for office in offices:
        ProductStockInOfficeModel.objects.create(
            product=product,
            office=office,
            stock=random.randint(1, 100),
        )

    # Create random suppliers
    suppliers = SupplierModel.objects.order_by("?")[: random.randint(1, 3)]
    for supplier in suppliers:
        ProductSupplierModel.objects.create(
            product=product,
            supplier=supplier,
            price=random.randint(100, 1000),
        )

    ProductServiceModel.objects.create(
        product=product,
        name="Armado",
        price=random.randint(100, 1000),
    )

    product = ProductModel.objects.create(
        name="Carpa Mediana",
        description=fake.sentence(),
        price=str(random.randint(100, 1000)),
        sku=fake.isbn10(),
        brand=BrandModel.objects.order_by("?").first(),
        type=ProductTypeChoices.ALQUILABLE,
    )

    # Create random stock in offices
    offices = OfficeModel.objects.order_by("?")[: random.randint(1, 3)]
    for office in offices:
        ProductStockInOfficeModel.objects.create(
            product=product,
            office=office,
            stock=random.randint(1, 100),
        )

    # Create random suppliers
    suppliers = SupplierModel.objects.order_by("?")[: random.randint(1, 3)]
    for supplier in suppliers:
        ProductSupplierModel.objects.create(
            product=product,
            supplier=supplier,
            price=random.randint(100, 1000),
        )

    ProductServiceModel.objects.create(
        product=product,
        name="Armado",
        price=random.randint(100, 1000),
    )

    product = ProductModel.objects.create(
        name="Carpa Grande",
        description=fake.sentence(),
        price=str(random.randint(100, 1000)),
        sku=fake.isbn10(),
        brand=BrandModel.objects.order_by("?").first(),
        type=ProductTypeChoices.ALQUILABLE,
    )

    # Create random stock in offices
    offices = OfficeModel.objects.order_by("?")[: random.randint(1, 3)]
    for office in offices:
        ProductStockInOfficeModel.objects.create(
            product=product,
            office=office,
            stock=random.randint(1, 100),
        )

    # Create random suppliers
    suppliers = SupplierModel.objects.order_by("?")[: random.randint(1, 3)]
    for supplier in suppliers:
        ProductSupplierModel.objects.create(
            product=product,
            supplier=supplier,
            price=random.randint(100, 1000),
        )

    ProductServiceModel.objects.create(
        product=product,
        name="Armado",
        price=random.randint(100, 1000),
    )

    # create random purchases
    for _ in range(10):
        purchase = PurchaseModel.objects.create(
            date=fake.date_between(start_date="-1y", end_date="today"),
            client=ClientModel.objects.order_by("?").first(),
        )

        # create random purchase items
        products_to_buy = ProductModel.objects.filter(
            type=ProductTypeChoices.COMERCIABLE
        ).order_by("?")[: random.randint(1, 10)]
        for product in products_to_buy:
            PurchaseItemModel.objects.create(
                product=product,
                purchase=purchase,
                quantity=random.randint(1, 10),
            )

    # create random internal orders
    for _ in range(10):
        order = InternalOrderModel.objects.create(
            office_branch=OfficeModel.objects.order_by("?").first(),
            office_destination=OfficeModel.objects.order_by("?").first(),
        )

        # create random internal order items
        products_to_order = ProductModel.objects.order_by("?")[: random.randint(1, 10)]
        for product in products_to_order:
            InternalOrderProduct.objects.create(
                product=product,
                internal_order=order,
                quantity=random.randint(1, 10),
            )

        InternalOrderHistoryModel.objects.create(
            internal_order=order,
            status=InternalOrderHistoryStatusChoices.PENDING,
        )

    # create random supplier orders
    for _ in range(10):
        order = SupplierOrderModel.objects.create(
            supplier=SupplierModel.objects.order_by("?").first(),
            office_destination=OfficeModel.objects.order_by("?").first(),
        )

        # create random supplier order items
        products_to_order = ProductModel.objects.order_by("?")[: random.randint(1, 10)]
        for product in products_to_order:
            SupplierOrderProduct.objects.create(
                product=product,
                supplier_order=order,
                quantity=random.randint(1, 10),
            )

        SupplierOrderHistoryModel.objects.create(
            supplier_order=order,
            status=SupplierOrderHistoryStatusChoices.PENDING,
        )

    # create random rental contracts
    for _ in range(10):
        contract = RentalContractModel.objects.create(
            client=ClientModel.objects.order_by("?").first(),
            office=OfficeModel.objects.order_by("?").first(),
            house_number=fake.building_number(),
            street_name=fake.street_name(),
            house_unit=random.choice([str(fake.random_int(min=1, max=100)), ""]),
            locality=LocalityModel.objects.order_by("?").first(),
            contract_start_datetime=fake.date_time_between(
                start_date="-1y", end_date="now"
            ),
            contract_end_datetime=fake.date_time_between(
                start_date="now", end_date="now"
            ),
        )

        # create random rental contract items
        products_to_rent = ProductModel.objects.filter(
            type=ProductTypeChoices.ALQUILABLE
        ).order_by("?")[: random.randint(1, 10)]
        for product in products_to_rent:
            RentalContractItemModel.objects.create(
                product=product,
                rental_contract=RentalContractModel.objects.order_by("?").first(),
                quantity=random.randint(1, 10),
            )

        RentalContractHistoryModel.objects.create(
            rental_contract=contract, status=RentalContractStatusChoices.PRESUPUESTADO
        )


create_fixture_data()

# Path: script.py
# You can run this script with the following command:
# python manage.py shell -c "exec(open('script.py').read())"
