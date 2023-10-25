from senda.core.models import (
    EmployeeModel,
    LocalityModel,
    OfficeModel,
    ProductModel,
    ClientModel,
    SupplierModel,
    StateChoices,
    OrderSupplierModel,
    InternalOrderModel,
    BrandModel,
    InternalOrderHistoryModel,
    InternalOrderHistoryStatusChoices,
    ProductStockInOfficeModel,
    PurchaseModel,
    PurchaseItemModel,
    PurchaseHistoryModel,
    RentalContractModel,
    RentalContractItemModel,
    RentalContractHistoryModel,
    ServiceModel,
)


from graphene_django import DjangoObjectType
import graphene

StateChoicesEnum = graphene.Enum.from_enum(StateChoices)
InternalOrderHistoryStatusEnum = graphene.Enum.from_enum(
    InternalOrderHistoryStatusChoices
)


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
        model = OrderSupplierModel


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


class PurchaseHistory(DjangoObjectType):
    class Meta:
        model = PurchaseHistoryModel


class RentalContract(DjangoObjectType):
    class Meta:
        model = RentalContractModel


class RentalContractItem(DjangoObjectType):
    class Meta:
        model = RentalContractItemModel


class RentalContractHistory(DjangoObjectType):
    class Meta:
        model = RentalContractHistoryModel


class Service(DjangoObjectType):
    class Meta:
        model = ServiceModel
