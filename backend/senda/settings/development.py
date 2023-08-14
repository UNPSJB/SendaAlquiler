import os
from .base import BASE_DIR, Common


class Development(Common):
    Common.ALLOWED_HOSTS += ["*"]
    SERVER_ADDRESS = "http://localhost:3000"
    SERVER_DOMAIN = "localhost:3000"

    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost",
        "https://localhost:3000",
        "https://localhost",
        "http://0.0.0.0:3000",
        "https://0.0.0.0",
    ]

    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = [
        "https://localhost:3000",
        "http://localhost:3000",
        "http://localhost",
        "https://0.0.0.0:3000",
        "http://0.0.0.0:3000",
        "http://0.0.0.0",
        "http://127.0.0.1",
    ]

    DEBUG: bool = True

    LOG_LEVEL: str = "DEBUG"
    LOG_FORMATTER: str = "simple"

    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        }
    }

    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

    GRAPHENE = {
        "SCHEMA": "senda.schema.schema",
        "SCHEMA_OUTPUT": "schema.graphql",
        "MIDDLEWARE": [
            "graphql_jwt.middleware.JSONWebTokenMiddleware",
        ],
    }
