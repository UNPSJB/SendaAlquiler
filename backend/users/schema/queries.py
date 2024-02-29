import graphene

from users.models import UserModel
from users.schema.types import User
from utils.graphene import non_null_list_of

from senda.core.decorators import CustomInfo


class UserQuery(graphene.ObjectType):
    user = graphene.Field(User)

    def resolve_user(self, info: CustomInfo):
        user = info.context.user

        if not user.is_authenticated:
            raise Exception("Not logged in!")

        return user

    users = non_null_list_of(User)

    def resolve_users(self, info: CustomInfo):
        return UserModel.objects.all()


class Query(UserQuery, graphene.ObjectType):
    pass
