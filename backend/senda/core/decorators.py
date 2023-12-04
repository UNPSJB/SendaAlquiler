from functools import wraps
from django.core.exceptions import PermissionDenied
from users.models import UserModel
from graphql import GraphQLResolveInfo

from typing import Callable, Type

from graphql import GraphQLError


class CustomContext:
    office_id: str
    user: UserModel


class CustomInfo(GraphQLResolveInfo):
    context: CustomContext


def context(f):
    def decorator(func):
        def wrapper(*args, **kwargs):
            info = next(arg for arg in args if isinstance(arg, GraphQLResolveInfo))
            office_id = info.context.COOKIES.get("senda-session-office") or None
            info.context.office_id = office_id

            return func(info.context, *args, **kwargs)

        return wrapper

    return decorator


def user_passes_test(
    test_func: Callable[[UserModel], bool], exc: Type[Exception] = PermissionDenied
):
    def decorator(f):
        @wraps(f)
        @context(f)
        def wrapper(context, *args, **kwargs):
            user = context.user
            print(args)

            if test_func(user):
                return f(*args, **kwargs)

            raise GraphQLError("No tienes permisos para realizar esta acción")

        return wrapper

    return decorator


employee_required = user_passes_test(
    lambda user: user.is_authenticated and user.is_employee()
)
