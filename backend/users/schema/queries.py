import graphene

from users.models import UserModel
from users.schema.types import User

from utils.graphene import get_all_objects, non_null_list_of


class UserQuery(graphene.ObjectType):
    users = non_null_list_of(User)
    resolve_users = get_all_objects(UserModel)


class Query(UserQuery, graphene.ObjectType):
    pass
