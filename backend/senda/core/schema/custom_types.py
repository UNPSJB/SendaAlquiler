import graphene
from graphene_django import DjangoObjectType

from senda.core.models.clients import ClientModel
from senda.core.models.employees import EmployeeModel
from senda.core.models.localities import LocalityModel, StateChoices
from senda.core.models.offices import OfficeModel
from senda.core.models.order_internal import (
    InternalOrderHistoryModel,
    InternalOrderHistoryStatusChoices,
    InternalOrderModel,
)
from senda.core.models.order_supplier import (
    SupplierOrderModel,
    SupplierOrderHistoryModel,
    SupplierOrderProduct,
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

StateChoicesEnum = graphene.Enum.from_enum(StateChoices)
InternalOrderHistoryStatusEnum = graphene.Enum.from_enum(
    InternalOrderHistoryStatusChoices
)
ProductTypeChoicesEnum = graphene.Enum.from_enum(ProductTypeChoices)
RentalContractStatusChoicesEnum = graphene.Enum.from_enum(RentalContractStatusChoices)


class Brand(DjangoObjectType):
    class Meta:
        model = BrandModel


class Locality(DjangoObjectType):
    state = StateChoicesEnum(required=True)

    class Meta:
        model = LocalityModel


class Office(DjangoObjectType):
    class Meta:
        model = OfficeModel


class Product(DjangoObjectType):
    type = ProductTypeChoicesEnum(required=True)

    class Meta:
        model = ProductModel


class Employee(DjangoObjectType):
    class Meta:
        model = EmployeeModel


class Client(DjangoObjectType):
    class Meta:
        model = ClientModel


class Supplier(DjangoObjectType):
    class Meta:
        model = SupplierModel


class OrderSupplier(DjangoObjectType):
    class Meta:
        model = SupplierOrderModel


class InternalOrder(DjangoObjectType):
    class Meta:
        model = InternalOrderModel


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


class PurchaseItem(DjangoObjectType):
    class Meta:
        model = PurchaseItemModel


class RentalContract(DjangoObjectType):
    class Meta:
        model = RentalContractModel


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

class SupplierOrderProdu(DjangoObjectType):
    class Meta:
        model = SupplierOrderProduct