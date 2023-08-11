import graphene
import graphql_jwt

from users.models import UserModel
from users.schema.types import User
from graphql import GraphQLError
from django.contrib.auth import authenticate

from graphql_jwt.shortcuts import get_token


class Login(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(User, required=True)
    token = graphene.String(required=True)

    def mutate(cls, info, email: str, password: str):
        user = UserModel.objects.filter(email=email).first()
        if user is None:
            raise GraphQLError("El usuario no existe")

        if user.is_student() and user.student_model.already_created_by_signup is False:
            raise GraphQLError("Debes registrarte para poder acceder")

        user = authenticate(email=user.email, password=password)
        if not user or not user.is_active:
            raise GraphQLError("Contraseña incorrecta")

        token = get_token(user)
        return Login(user=user, token=token)


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    login = Login.Field()
