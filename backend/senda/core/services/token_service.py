import random
import string
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Optional, TypedDict, Tuple

import jwt
from django.conf import settings

if TYPE_CHECKING:
    from users.models import UserModel


class CheckTokenError:
    EXPIRED_OR_INVALID = ("EXPIRED_OR_INVALID",)
    VERSION_CHANGED = ("VERSION_CHANGED",)
    USER_NOT_FOUND = ("USER_NOT_FOUND",)


class CheckTokenDict(TypedDict):
    error: Optional[Tuple[str]]
    user: Optional["UserModel"]


class TokenService:
    @classmethod
    def generate_token(cls, user: "UserModel"):
        payload = {
            "user_id": user.id,
            "token_version": user.token_version,
            "exp": datetime.utcnow() + timedelta(hours=1),  # 1-hour expiration
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    @classmethod
    def check_token(cls, token: str) -> CheckTokenDict:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

            from users.models import UserModel

            try:
                user = UserModel.objects.get(id=payload["user_id"])
            except UserModel.DoesNotExist:
                return CheckTokenDict(
                    error=CheckTokenError.USER_NOT_FOUND,
                    user=None,
                )

            if payload["token_version"] != user.token_version:
                return CheckTokenDict(
                    error=CheckTokenError.VERSION_CHANGED,
                    user=None,
                )

            return CheckTokenDict(error=None, user=user)

        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            return {
                "error": CheckTokenError.EXPIRED_OR_INVALID,
                "user": None,
            }

    @classmethod
    def invalidate_token(cls, user: "UserModel"):
        user.token_version += 1
        user.save()

    @classmethod
    def generate_random_password(cls):
        letters = string.digits
        return "".join(random.choice(letters) for i in range(6))
