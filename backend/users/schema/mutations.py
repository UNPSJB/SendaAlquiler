from typing import Any

import graphene
import graphql_jwt
from django.contrib.auth import authenticate
from graphql import GraphQLError
from graphql_jwt.shortcuts import get_token

from users.models import UserModel
from users.schema.types import User
from django.utils import timezone


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(User, required=True)
    token = graphene.String(required=True)

    def mutate(self, info: Any, email: str, password: str):
        try:
            user = UserModel.objects.filter(email=email).first()
            if user is None:
                raise GraphQLError("El usuario no existe")

            user = authenticate(email=user.email, password=password)
            if not user or not user.is_active:
                raise GraphQLError("Contraseña incorrecta")

            user.last_login = timezone.now()
            user.save()
            token = get_token(user)
            return Login(user=user, token=token)
        except Exception as e:
            raise GraphQLError(
                "Ocurrió un error al iniciar sesión. Por favor intentalo más tarde."
            )


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    login = Login.Field()
