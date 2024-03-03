import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "senda.settings")
django.setup()

from faker import Faker
import random

from senda.core.models.admin import AdminModel
from senda.core.models.clients import Client
from senda.core.models.employees import EmployeeModel, EmployeeOffice
from senda.core.models.localities import LocalityModel, StateChoices
from senda.core.models.offices import Office
from users.models import UserModel
from senda.core.models.suppliers import SupplierModel
from senda.core.models.products import (
    Product,
    ProductSupplier,
    ProductTypeChoices,
    Brand,
    ProductDataDict,
    ProductStockItemDataDict,
    ProductSupplierDataDict,
    ProductServiceDataDict,
    ProductServiceBillingTypeChoices,
    ProductService,
    StockItem,
)
from senda.core.models.order_internal import (
    InternalOrder,
    InternalOrderDetailsDict,
    InternalOrderItemDetailsDict,
    InternalOrderHistoryStatusChoices,
    InProgressOrderItemDetailsDict,
    CompletedOrderItemDetailsDict as InternalCompletedOrderItemDetailsDict,
)
from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderDetailsDict,
    SupplierOrderItemDetailsDict,
    SupplierOrderHistoryStatusChoices,
    CompletedOrderItemDetailsDict as SupplierCompletedOrderItemDetailsDict,
)
from senda.core.models.sale import Sale
from senda.core.models.contract import (
    Contract,
    ContractDetailsDict,
    ContractItemDetailsDict,
    ContractItemProductAllocationDetailsDict,
    ContractItemServiceDetailsDict,
)
from django.db import models, transaction
from senda.core.models.localities import LocalityModel, StateChoices

from django.utils import timezone
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker(locale="es_AR")


def create_localities():
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

    for city in some_chubut_cities_along_postal_code:
        LocalityModel.objects.create(
            name=city["name"],
            postal_code=city["postal_code"],
            state=StateChoices.CHUBUT,
        )


def create_admins():
    user = UserModel.objects.create_superuser(
        email="admin@admin.com",
        password="admin",
        first_name="Admin",
        last_name="Admin",
    )
    AdminModel.objects.create(user=user)


def create_employees():
    for i in range(random.randint(50, 80)):
        first_name, last_name = get_full_name()
        email = get_email_from_name(first_name, last_name, "senda.com")
        if UserModel.objects.filter(email=email).exists():
            continue

        user = UserModel.objects.create_user(
            email=email,
            password="admin",
            first_name=first_name,
            last_name=last_name,
        )
        employee = EmployeeModel.objects.create(user=user)

        [
            EmployeeOffice.objects.create(employee=employee, office=office)
            for office in Office.objects.all().order_by("?")[0 : random.randint(1, 3)]
        ]


def create_clients():
    for i in range(random.randint(50, 80)):
        first_name, last_name = get_full_name()
        email = get_email_from_name(first_name, last_name, "example.com")

        if Client.objects.filter(email=email).exists():
            continue

        random_location = RandomLocation()

        Client.objects.create(
            email=email,
            first_name=first_name,
            last_name=last_name,
            locality=random_location.locality,
            house_number=random_location.house_number,
            street_name=random_location.street_name,
            house_unit=random_location.house_unit,
            phone_code=random_location.phone_code,
            phone_number=random_location.phone_number,
            dni=str(random.randint(10000000, 99999999)),
        )


def create_offices():
    Office.objects.create(
        name="Comodoro Rivadavia",
        street="Av. Rivadavia",
        house_number="1234",
        locality=LocalityModel.objects.get(name="Comodoro Rivadavia"),
    )

    Office.objects.create(
        name="Trelew",
        street="Av. 9 de Julio",
        house_number="1234",
        locality=LocalityModel.objects.get(name="Trelew"),
    )

    Office.objects.create(
        name="Puerto Madryn",
        street="Av. Gales",
        house_number="1234",
        locality=LocalityModel.objects.get(name="Puerto Madryn"),
    )


def create_suppliers():
    for i in range(random.randint(50, 80)):
        name = fake.company()
        email = string_to_ascii_lowercase_no_spaces(name) + "@supplier.com"
        random_location = RandomLocation()

        if SupplierModel.objects.filter(email=email).exists():
            continue

        SupplierModel.objects.create(
            cuit=str(random.randint(10000000000, 99999999999)),
            name=fake.company(),
            email=email,
            locality=random_location.locality,
            house_number=random_location.house_number,
            street_name=random_location.street_name,
            house_unit=random_location.house_unit,
            phone_code=random_location.phone_code,
            phone_number=random_location.phone_number,
        )


def create_brands():
    for brand_name in [
        "Pampa",
        "Rueda",
        "Pirelli",
        "Bridgestone",
        "Fate",
        "Michelin",
        "Continental",
        "Dunlop",
        "Firestone",
        "Goodyear",
        "Toyo",
        "Yokohama",
        "Hankook",
    ]:
        Brand.objects.create(name=brand_name)


def create_product_with_details(name, product_type, services=None):
    if services is None:
        services = []

    # Create a single product
    product = Product.objects.create_product(
        ProductDataDict(
            sku=fake.ean(length=13),
            name=name,
            description=fake.sentence(),
            brand_id=Brand.objects.order_by("?").first().pk,
            type=product_type,
            price=random.randint(10000, 1000000),
        )
    )

    # Generate and update stock items
    stock_items = [
        ProductStockItemDataDict(
            product_id=product.pk,
            office_id=office.pk,
            quantity=random.randint(0, 320),
        )
        for office in Office.objects.all().order_by("?")[0 : random.randint(1, 3)]
    ]
    Product.objects.update_or_create_stock_items(product.pk, stock_items)

    # Generate and update suppliers
    suppliers = [
        ProductSupplierDataDict(
            product_id=product.pk,
            supplier_id=supplier.pk,
            price=random.randint(10000, 1000000),
        )
        for supplier in SupplierModel.objects.all().order_by("?")[
            0 : random.randint(1, SupplierModel.objects.count())
        ]
    ]
    Product.objects.update_or_create_product_suppliers(product.pk, suppliers)

    # Update services if applicable
    if services:
        Product.objects.update_or_create_product_services(product.pk, services)


def generate_service_data(name, billing_type=ProductServiceBillingTypeChoices.ONE_TIME):
    return ProductServiceDataDict(
        name=name,
        price=random.randint(10000, 50000),
        billing_type=billing_type,
    )


def create_comerciable_products():
    product_names = [
        "Escoba",
        "Trapo de piso",
        "Balde",
        "Escobillon",
        "Cepillo",
        "Cubo",
        "Desinfectante",
        "Jabon",
        "Jabon liquido",
        "Lavandina",
        "Lustramuebles",
        "Lustrametales",
        "Lustraautos",
        "Lustrazapatos",
        "Mopa",
        "Paño",
        "Pala",
        "Recogedor",
        "Saca pelusas",
        "Secador de piso",
        "Trapero",
        "Trapeador",
    ]

    for name in product_names:
        create_product_with_details(name, ProductTypeChoices.COMERCIABLE)


def create_alquilable_products():
    tent_products = [
        ("Carpa para 2 personas", ["Armado", "Desarmado"]),
        ("Carpa para 4 personas", ["Armado", "Desarmado"]),
        ("Carpa para 6 personas", ["Armado", "Desarmado"]),
        ("Baño quimico", ["Limpieza en Obra", "Limpieza en Evento"]),
    ]

    for name, service_names in tent_products:
        services = [
            generate_service_data(service_name) for service_name in service_names
        ]
        create_product_with_details(name, ProductTypeChoices.ALQUILABLE, services)


""" class InternalOrderHistoryStatusChoices(models.TextChoices):
    PENDING = "PENDING", "Pendiente"
    IN_PROGRESS = "IN_PROGRESS", "En progreso"
    COMPLETED = "COMPLETED", "Completado"
    CANCELED = "CANCELED", "Cancelado"
 """


def create_internal_orders():
    for i in range(random.randint(50, 80)):
        source_office = Office.objects.order_by("?").first()
        target_office = (
            Office.objects.order_by("?").exclude(pk=source_office.pk).first()
        )

        requested_for_date = fake.date_time_this_year()
        approximate_delivery_date = requested_for_date + timedelta(
            days=random.randint(1, 30)
        )

        order_data = InternalOrderDetailsDict(
            source_office_id=source_office.pk,
            target_office_id=target_office.pk,
            requested_for_date=requested_for_date,
            approximate_delivery_date=approximate_delivery_date,
        )

        items_data = [
            InternalOrderItemDetailsDict(
                product_id=stock_item.product.pk, quantity_ordered=random.randint(1, stock_item.quantity)
            )
            for stock_item in StockItem.objects.filter(
                office=source_office, quantity__gt=0
            ).order_by("?")[0 : random.randint(1, 5)]
        ]

        internal_order = InternalOrder.objects.create_internal_order(
            order_data, items_data
        )

        is_accepted = random.choice([True, False, None])
        if is_accepted:
            history = internal_order.set_status(
                InternalOrderHistoryStatusChoices.IN_PROGRESS,
                responsible_user=EmployeeModel.objects.order_by("?").first().user,
                note=fake.sentence(),
                in_progress_order_items=[
                    InProgressOrderItemDetailsDict(
                        item_id=order_item.pk,
                        quantity_sent=random.randint(0, order_item.quantity_ordered),
                    )
                    for order_item in internal_order.order_items.all()
                ],
            )
            history.created_on = requested_for_date + timedelta(
                days=random.randint(1, 30)
            )
            history.save()

            is_completed = random.choice([True, False])

            if is_completed:
                completed_history = internal_order.set_status(
                    InternalOrderHistoryStatusChoices.COMPLETED,
                    responsible_user=EmployeeModel.objects.order_by("?").first().user,
                    note=fake.sentence(),
                    completed_order_items=[
                        InternalCompletedOrderItemDetailsDict(
                            item_id=order_item.pk,
                            quantity_received=random.randint(
                                0, order_item.quantity_sent
                            ),
                        )
                        for order_item in internal_order.order_items.all()
                    ],
                )
                completed_history.created_on = requested_for_date + timedelta(
                    days=random.randint(1, 30)
                )
                completed_history.save()
        elif is_accepted is False:
            history = internal_order.set_status(
                InternalOrderHistoryStatusChoices.CANCELED,
                responsible_user=EmployeeModel.objects.order_by("?").first().user,
                note=fake.sentence(),
            )

            history.created_on = requested_for_date + timedelta(
                days=random.randint(1, 30)
            )
            history.save()


def create_supplier_orders():
    for i in range(random.randint(50, 80)):
        supplier = SupplierModel.objects.order_by("?").first()
        target_office = Office.objects.order_by("?").first()

        requested_for_date = fake.date_time_this_year()
        approximate_delivery_date = requested_for_date + timedelta(
            days=random.randint(1, 30)
        )

        order_data = SupplierOrderDetailsDict(
            supplier_id=supplier.pk,
            target_office_id=target_office.pk,
            requested_for_date=requested_for_date,
            approximate_delivery_date=approximate_delivery_date,
        )

        items_data = [
            SupplierOrderItemDetailsDict(
                product_id=product_supplier_relation.product.pk,
                quantity_ordered=random.randint(1, 100),
            )
            for product_supplier_relation in ProductSupplier.objects.filter(
                supplier=supplier
            ).order_by("?")[0 : random.randint(1, 5)]
        ]

        supplier_order = SupplierOrder.objects.create_supplier_order(order_data, items_data)

        is_completed = random.choice([True, False, None])
        if is_completed:
            history = supplier_order.set_status(
                SupplierOrderHistoryStatusChoices.COMPLETED,
                responsible_user=EmployeeModel.objects.order_by("?").first().user,
                note=fake.sentence(),
                completed_order_items=[
                    SupplierCompletedOrderItemDetailsDict(
                        item_id=order_item.pk,
                        quantity_received=random.randint(0, order_item.quantity_ordered),
                    ) for order_item in supplier_order.order_items.all()
                ],
            )
            history.created_on = requested_for_date + timedelta(
                days=random.randint(1, 30)
            )

            history.save()
        elif is_completed is False:
            history = supplier_order.set_status(
                SupplierOrderHistoryStatusChoices.CANCELED,
                responsible_user=EmployeeModel.objects.order_by("?").first().user,
                note=fake.sentence(),
            )

            history.created_on = requested_for_date + timedelta(
                days=random.randint(1, 30)
            )
            history.save()



def create_sales():
    for i in range(random.randint(50, 80)):
        naive_contract_start_datetime = fake.date_time_between(
            start_date="-1y", end_date="now", tzinfo=None
        )
        sale_date = timezone.make_aware(naive_contract_start_datetime)
        client = Client.objects.order_by("?").first()
        office = Office.objects.order_by("?").first()

        products = (
            Product.objects.filter(
                models.Q(type=ProductTypeChoices.COMERCIABLE)
                & models.Q(stock_items__office_id=office.pk)
                & models.Q(stock_items__quantity__gt=0)
            )
            .annotate(total_stock=models.Sum("stock_items__quantity"))
            .filter(total_stock__gt=0)
        )

        no_added_products = 0

        sale_item_dicts = []
        for product in products:
            stock_availability = product.calculate_stock_availability(
                office.pk, start_date=sale_date, end_date=sale_date
            )

            if stock_availability == 0:
                continue

            quantity = random.randint(1, stock_availability)
            max_discount = int((product.price * quantity) * 0.1)

            sale_item_dicts.append(
                {
                    "product_id": product.pk,
                    "quantity": quantity,
                    "discount": random.randint(0, max_discount),
                }
            )

            no_added_products += 1

            if no_added_products >= 5:
                break

        sale = Sale.objects.create_sale(client.pk, office.pk, sale_item_dicts)
        sale.created_on = sale_date
        sale.modified_on = sale_date
        sale.save()


def create_contracts():
    for i in range(random.randint(50, 80)):
        created_by_employee = EmployeeModel.objects.order_by("?").first()
        client = Client.objects.order_by("?").first()
        office = Office.objects.order_by("?").first()

        # random start between now and a year ago
        naive_contract_start_datetime = fake.date_time_between(
            start_date="-1y", end_date="now", tzinfo=None
        )
        contract_start = timezone.make_aware(naive_contract_start_datetime)
        contract_end = contract_start + timedelta(days=random.randint(1, 30))
        expiration_date = contract_end + timedelta(days=random.randint(1, 30))

        contract_data = ContractDetailsDict(
            client_id=client.pk,
            office_id=office.pk,
            contract_start=contract_start,
            contract_end=contract_end,
            locality_id=client.locality.pk,
            house_number=client.house_number,
            street_name=client.street_name,
            house_unit=client.house_unit,
            expiration_date=expiration_date,
        )

        contract_item_dicts = [
            ContractItemDetailsDict(
                product_id=product.pk,
                product_discount=random.randint(0, 1000),
                allocations=[
                    ContractItemProductAllocationDetailsDict(
                        office_id=office.pk,
                        quantity=random.randint(1, 100),
                        shipping_cost=random.randint(100, 1000),
                        shipping_discount=random.randint(0, 100),
                    )
                ],
                services=[
                    ContractItemServiceDetailsDict(
                        service_discount=random.randint(0, 1000),
                        service_id=service.pk,
                    )
                    for service in ProductService.objects.order_by("?")[
                        0 : random.randint(0, 2)
                    ]
                ],
            )
            for product in Product.objects.order_by("?").filter(
                type=ProductTypeChoices.ALQUILABLE
            )[0 : random.randint(1, 5)]
        ]

        contract = Contract.objects.create_contract(
            contract_data,
            contract_item_dicts,
            created_by_user_id=created_by_employee.user.pk,
        )

        contract.created_on = contract_start
        contract.modified_on = contract_start
        contract.save()


def get_full_name():
    return fake.first_name(), fake.last_name()


def get_email_from_name(first_name: str, last_name: str, domain: str):
    # remove accents and special characters, convert to lowercase, remove whitespace and replace spaces with dots
    return (
        string_to_ascii_lowercase_no_spaces(first_name)
        + "."
        + string_to_ascii_lowercase_no_spaces(last_name)
        + "@"
        + domain
    )


def string_to_ascii_lowercase_no_spaces(string: str) -> str:
    return (
        string.replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u")
        .replace(" ", "")
        .lower()
        .replace(" ", "")
    )


class RandomLocation:
    def __init__(self):
        self.locality = LocalityModel.objects.order_by("?").first()
        self.house_number = str(random.randint(1, 1000))
        self.street_name = fake.street_name()
        self.house_unit = str(random.randint(1, 1000))
        self.phone_code = "280"
        self.phone_number = str(random.randint(1000000, 99999999))


def run_fixtures():
    with transaction.atomic():
        create_localities()
        create_offices()
        create_admins()
        create_employees()
        create_clients()

        create_brands()
        create_suppliers()
        create_alquilable_products()
        create_comerciable_products()

        create_internal_orders()
        create_supplier_orders()

        create_sales()
        create_contracts()


run_fixtures()

# you can run this script with:
# python manage.py shell -c "exec(open('script.py').read())"
