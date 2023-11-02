import graphene

from users.models import UserModel
from users.schema.types import User
from utils.graphene import non_null_list_of


class UserQuery(graphene.ObjectType):
    users = non_null_list_of(User)

    def resolve_users(self, info):
        return UserModel.objects.all()


class Query(UserQuery, graphene.ObjectType):
    pass
