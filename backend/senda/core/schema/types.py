from senda.core.models import (
    EmployeeModel,
    LocalityModel,
    OfficeModel,
    ProductModel,
    ClientModel,
)


from graphene_django import DjangoObjectType


class Locality(DjangoObjectType):
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
