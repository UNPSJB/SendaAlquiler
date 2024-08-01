import graphene
from graphene_django import DjangoObjectType
from senda.core.models.clients import Client
from senda.core.models.employees import EmployeeModel, EmployeeOffice
from senda.core.models.localities import LocalityModel, StateChoices
from senda.core.models.offices import Office
from senda.core.models.order_internal import (
    InternalOrderHistory,
    InternalOrderLineItem,
    InternalOrderHistoryStatusChoices,
    InternalOrder,
)
from senda.core.models.order_supplier import (
    SupplierOrder,
    SupplierOrderHistory,
    SupplierOrderItem,
    SupplierOrderHistoryStatusChoices,
)
from senda.core.models.products import (
    Brand,
    Product,
    ProductService,
    StockItem,
    ProductTypeChoices,
    ProductSupplier,
    ProductServiceBillingTypeChoices,
)
from senda.core.models.sale import SaleItemModel, Sale
from senda.core.models.contract import (
    ContractHistory,
    ContractItem,
    Contract,
    ContractHistoryStatusChoices,
    ContractItemService,
)
from senda.core.models.suppliers import SupplierModel
from senda.core.models.admin import AdminModel

from senda.core.decorators import CustomInfo
from utils.graphene import non_null_list_of

StateChoicesEnum = graphene.Enum.from_enum(StateChoices)
InternalOrderHistoryStatusEnum = graphene.Enum.from_enum(
    InternalOrderHistoryStatusChoices
)
SupplierOrderHistoryStatusEnum = graphene.Enum.from_enum(
    SupplierOrderHistoryStatusChoices
)
ProductTypeChoicesEnum = graphene.Enum.from_enum(ProductTypeChoices)
ContractHistoryStatusChoicesEnum = graphene.Enum.from_enum(ContractHistoryStatusChoices)
ProductServiceBillingTypeChoicesEnum = graphene.Enum.from_enum(
    ProductServiceBillingTypeChoices
)


class PaginatedQueryResult(graphene.ObjectType):
    count = graphene.NonNull(graphene.Int)
    num_pages = graphene.NonNull(graphene.Int)
    current_page = graphene.NonNull(graphene.Int)


class BrandType(DjangoObjectType):
    class Meta:
        name = "Brand"
        model = Brand


class PaginatedBrandQueryResult(PaginatedQueryResult):
    results = non_null_list_of(BrandType)


class LocalityType(DjangoObjectType):
    state = StateChoicesEnum(required=True)

    has_some_client = graphene.Boolean(required=True)

    def resolve_has_some_client(parent: LocalityModel, info: CustomInfo):
        return parent.has_some_client()

    class Meta:
        name = "Locality"
        model = LocalityModel


class PaginatedLocalityQueryResult(PaginatedQueryResult):
    results = non_null_list_of(LocalityType)


class OfficeType(DjangoObjectType):
    class Meta:
        name = "Office"
        model = Office


class ProductType(DjangoObjectType):
    type = ProductTypeChoicesEnum(required=True)
    current_office_quantity = graphene.Int(default_value=0, required=True)
    has_any_sale = graphene.Boolean(required=True)
    is_in_some_contract = graphene.Boolean(required=True)

    def resolve_current_office_quantity(parent: Product, info: CustomInfo):
        stock = parent.get_stock_for_office(int(info.context.office_id))
        return stock or 0

    def resolve_has_any_sale(parent: Product, info: CustomInfo):
        return parent.has_any_sale()

    def resolve_is_in_some_contract(parent: Product, info: CustomInfo):
        return parent.is_in_some_contract()

    class Meta:
        name = "Product"
        model = Product


class PaginatedProductQueryResult(PaginatedQueryResult):
    results = non_null_list_of(ProductType)


class EmployeeType(DjangoObjectType):
    offices = non_null_list_of(OfficeType)

    def resolve_offices(parent: EmployeeModel, info):
        return Office.objects.filter(employees__employee=parent)

    class Meta:
        name = "Employee"
        model = EmployeeModel


class PaginatedEmployeeQueryResult(PaginatedQueryResult):
    results = non_null_list_of(EmployeeType)


class ClientType(DjangoObjectType):
    class Meta:
        name = "Client"
        model = Client


class PaginatedClientQueryResult(PaginatedQueryResult):
    results = non_null_list_of(ClientType)


class SupplierType(DjangoObjectType):
    class Meta:
        name = "Supplier"
        model = SupplierModel


class PaginatedSupplierQueryResult(PaginatedQueryResult):
    results = non_null_list_of(SupplierType)


class OrderSupplierType(DjangoObjectType):
    class Meta:
        name = "OrderSupplier"
        model = SupplierOrder


class PaginatedOrderSupplierQueryResult(PaginatedQueryResult):
    results = non_null_list_of(OrderSupplierType)


class InternalOrderType(DjangoObjectType):
    class Meta:
        name = "InternalOrder"
        model = InternalOrder


class PaginatedInternalOrderQueryResult(PaginatedQueryResult):
    results = non_null_list_of(InternalOrderType)


class InternalOrderItemType(DjangoObjectType):
    class Meta:
        name = "InternalOrderItem"
        model = InternalOrderLineItem


class InternalOrderHistoryType(DjangoObjectType):
    status = InternalOrderHistoryStatusEnum(required=True)

    class Meta:
        name = "InternalOrderHistory"
        model = InternalOrderHistory


class StockItemType(DjangoObjectType):
    class Meta:
        name = "ProductStockInOffice"
        model = StockItem


class SaleType(DjangoObjectType):
    class Meta:
        name = "Sale"
        model = Sale


class PaginatedSaleQueryResult(PaginatedQueryResult):
    results = non_null_list_of(SaleType)


class SaleItemType(DjangoObjectType):
    class Meta:
        name = "SaleItem"
        model = SaleItemModel


class ContractType(DjangoObjectType):
    class Meta:
        name = "Contract"
        model = Contract


class PaginatedContractQueryResult(PaginatedQueryResult):
    results = non_null_list_of(ContractType)


class ContractItemType(DjangoObjectType):
    class Meta:
        name = "ContractItem"
        model = ContractItem


class ContractHistoryType(DjangoObjectType):
    status = ContractHistoryStatusChoicesEnum(required=True)

    class Meta:
        name = "ContractHistory"
        model = ContractHistory


class ProductServiceType(DjangoObjectType):
    billing_type = ProductServiceBillingTypeChoicesEnum(required=True)

    class Meta:
        name = "ProductService"
        model = ProductService


class SupplierOrderHistoryType(DjangoObjectType):
    status = SupplierOrderHistoryStatusEnum(required=True)

    class Meta:
        name = "SupplierOrderHistory"
        model = SupplierOrderHistory


class SupplierOrderItemType(DjangoObjectType):
    class Meta:
        name = "SupplierOrderItem"
        model = SupplierOrderItem


class EmployeeOfficeType(DjangoObjectType):
    class Meta:
        name = "EmployeeOffice"
        model = EmployeeOffice


class AdminType(DjangoObjectType):
    offices = non_null_list_of(OfficeType)

    def resolve_offices(self, info):
        return Office.objects.all()

    class Meta:
        name = "Admin"
        model = AdminModel


class ProductSupplierType(DjangoObjectType):
    class Meta:
        name = "ProductSupplier"
        model = ProductSupplier


class ContractItemServiceType(DjangoObjectType):
    class Meta:
        name = "ContractItemService"
        model = ContractItemService
