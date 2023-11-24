import graphene
from graphene import InputObjectType
from graphene_django.types import DjangoObjectType

from users.models import UserModel


class User(DjangoObjectType):
    class Meta:
        model = UserModel
        exclude_fields = ["password"]


class UserInput(InputObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    email = graphene.String()
    password = graphene.String()
