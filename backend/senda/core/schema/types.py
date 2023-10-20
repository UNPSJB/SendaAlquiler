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
