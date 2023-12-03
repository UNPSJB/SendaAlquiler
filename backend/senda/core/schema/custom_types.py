import graphene
from graphene_django import DjangoObjectType
from senda.core.models.clients import ClientModel
from senda.core.models.employees import EmployeeModel, EmployeeOfficeModel
from senda.core.models.localities import LocalityModel, StateChoices
from senda.core.models.offices import OfficeModel
from senda.core.models.order_internal import (
    InternalOrderHistoryModel,
    InternalOrderProductModel,
    InternalOrderHistoryStatusChoices,
    InternalOrderModel,
)
from senda.core.models.order_supplier import (
    SupplierOrderModel,
    SupplierOrderHistoryModel,
    SupplierOrderProductModel,
)
from senda.core.models.products import (
    BrandModel,
    ProductModel,
    ProductServiceModel,
    ProductStockInOfficeModel,
    ProductTypeChoices,
)
from senda.core.models.purchases import PurchaseItemModel, PurchaseModel
from senda.core.models.rental_contracts import (
    RentalContractHistoryModel,
    RentalContractItemModel,
    RentalContractModel,
    RentalContractStatusChoices,
)
from senda.core.models.suppliers import SupplierModel

from utils.graphene import non_null_list_of

StateChoicesEnum = graphene.Enum.from_enum(StateChoices)
InternalOrderHistoryStatusEnum = graphene.Enum.from_enum(
    InternalOrderHistoryStatusChoices
)
ProductTypeChoicesEnum = graphene.Enum.from_enum(ProductTypeChoices)
RentalContractStatusChoicesEnum = graphene.Enum.from_enum(RentalContractStatusChoices)


class PaginatedQueryResult(graphene.ObjectType):
    count = graphene.NonNull(graphene.Int)
    num_pages = graphene.NonNull(graphene.Int)


class Brand(DjangoObjectType):
    class Meta:
        model = BrandModel


class PaginatedBrandQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Brand)


class Locality(DjangoObjectType):
    state = StateChoicesEnum(required=True)

    class Meta:
        model = LocalityModel


class PaginatedLocalityQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Locality)


class Office(DjangoObjectType):
    class Meta:
        model = OfficeModel


class Product(DjangoObjectType):
    type = ProductTypeChoicesEnum(required=True)

    class Meta:
        model = ProductModel


class PaginatedProductQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Product)


class Employee(DjangoObjectType):
    class Meta:
        model = EmployeeModel


class PaginatedEmployeeQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Employee)


class Client(DjangoObjectType):
    class Meta:
        model = ClientModel


class PaginatedClientQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Client)


class Supplier(DjangoObjectType):
    class Meta:
        model = SupplierModel


class PaginatedSupplierQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Supplier)


class OrderSupplier(DjangoObjectType):
    class Meta:
        model = SupplierOrderModel


class PaginatedOrderSupplierQueryResult(PaginatedQueryResult):
    results = non_null_list_of(OrderSupplier)


class InternalOrder(DjangoObjectType):
    class Meta:
        model = InternalOrderModel


class PaginatedInternalOrderQueryResult(PaginatedQueryResult):
    results = non_null_list_of(InternalOrder)


class InternalOrderProduct(DjangoObjectType):
    class Meta:
        model = InternalOrderProductModel


class InternalOrderHistory(DjangoObjectType):
    status = InternalOrderHistoryStatusEnum(required=True)

    class Meta:
        model = InternalOrderHistoryModel


class ProductStockInOffice(DjangoObjectType):
    class Meta:
        model = ProductStockInOfficeModel


class Purchase(DjangoObjectType):
    class Meta:
        model = PurchaseModel


class PaginatedPurchaseQueryResult(PaginatedQueryResult):
    results = non_null_list_of(Purchase)


class PurchaseItem(DjangoObjectType):
    class Meta:
        model = PurchaseItemModel


class RentalContract(DjangoObjectType):
    class Meta:
        model = RentalContractModel


class PaginatedRentalContractQueryResult(PaginatedQueryResult):
    results = non_null_list_of(RentalContract)


class RentalContractItem(DjangoObjectType):
    class Meta:
        model = RentalContractItemModel


class RentalContractHistory(DjangoObjectType):
    status = RentalContractStatusChoicesEnum(required=True)

    class Meta:
        model = RentalContractHistoryModel


class ProductService(DjangoObjectType):
    class Meta:
        model = ProductServiceModel


class SupplierOrderHistory(DjangoObjectType):
    class Meta:
        model = SupplierOrderHistoryModel


class SupplierOrderProduct(DjangoObjectType):
    class Meta:
        model = SupplierOrderProductModel


class EmployeeOffice(DjangoObjectType):
    class Meta:
        model = EmployeeOfficeModel
