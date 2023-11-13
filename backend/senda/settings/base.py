import os
import sys
from pathlib import Path
from typing import List, Dict

from configurations import Configuration  # type: ignore
from decouple import config  # type: ignore

# Build paths inside the project like this: os.path.join(BASE_DIR, subdir)
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Common(Configuration):
    import django_stubs_ext

    django_stubs_ext.monkeypatch()

    TESTING = sys.argv[1:2] == ["test"]

    # Celery config for tests
    # if TESTING:
    #     CELERY_ALWAYS_EAGER = True
    #     BROKER_BACKEND = "memory"
    #     CELERY_EAGER_PROPAGATES_EXCEPTIONS = True
    #     BROKER_URL = "memory://"

    SECRET_KEY: str = os.getenv(
        "DJANGO_SECRET_KEY",
        "django-insecure-da6%e+mwre%q^t&m1llngqbn^t1ni-^b)f1!*u*uc$x+hgus7=",
    )

    DEBUG: bool = False

    ALLOWED_HOSTS: List[str] = ["0.0.0.0", "127.0.0.1", "localhost"]

    DEFAULT_APPS: List[str] = [
        "django.contrib.admin",
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.messages",
        "django.contrib.staticfiles",
        # "django.contrib.humanize",
        "django_extensions",
    ]

    THIRD_PARTY_APPS: List[str] = [
        "import_export",
        "corsheaders",
        "markdownx",
        "graphene_django",
    ]

    LOCAL_APPS: List[str] = [
        "users",
        "senda.core.apps.CoreAppConfig",
    ]

    INSTALLED_APPS: List[str] = LOCAL_APPS + DEFAULT_APPS + THIRD_PARTY_APPS

    MIDDLEWARE: List[str] = [
        "corsheaders.middleware.CorsMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "django.middleware.security.SecurityMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
    ]

    ROOT_URLCONF: str = "senda.urls"

    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [os.path.join(BASE_DIR, "templates")],
            "APP_DIRS": True,
            "OPTIONS": {
                "context_processors": [
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.static",
                ],
            },
        },
    ]

    WSGI_APPLICATION: str = "senda.wsgi.application"

    # CACHES: dict = {
    #     "default": {
    #         "BACKEND": "django_redis.cache.RedisCache",
    #         "LOCATION": os.getenv("CACHE_URL", "redis://startuperos-redis:6379/0"),
    #         "OPTIONS": {
    #             "CLIENT_CLASS": "django_redis.client.DefaultClient",
    #             "PASSWORD": "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81",
    #         },
    #     }
    # }

    # Password validation
    AUTH_PASSWORD_VALIDATORS = [
        {
            "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
        },
        {
            "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
        },
    ]

    AUTH_USER_MODEL: str = "users.UserModel"

    # Internationalization
    LANGUAGE_CODE: str = "es"

    TIME_ZONE: str = "America/Santiago"

    USE_I18N: bool = True

    USE_L10N: bool = True

    USE_TZ: bool = True

    # Static files (CSS, JavaScript, Images)
    # STATIC_URL: str = "/static/"
    # STATICFILES_DIRS: List[str] = [os.path.join(BASE_DIR, "static")]
    # STATIC_ROOT: str = os.path.join(BASE_DIR, "staticfiles")

    STATIC_URL = "/static/"
    STATIC_ROOT = os.path.join(BASE_DIR, "static")

    # Default primary key field type
    # https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field
    DEFAULT_AUTO_FIELD: str = "django.db.models.BigAutoField"

    CORS_ALLOW_ALL_ORIGINS = False

    NOTEBOOK_ARGUMENTS = [
        "--ip",
        "0.0.0.0",
        "--allow-root",
        "--no-browser",
    ]

    SITE_NAME = "Senda"
    ENVIRONMENT = "devel"
    SERVER_ADDRESS = "http://127.0.0.1:8000"

    EMAIL_HOST = config("EMAIL_HOST", default="localhost")
    EMAIL_PORT = config("EMAIL_PORT", default=25, cast=int)
    EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
    EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
    EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=False, cast=bool)
    DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", cast=str)

    AUTHENTICATION_BACKENDS = [
        "graphql_jwt.backends.JSONWebTokenBackend",
        "django.contrib.auth.backends.ModelBackend",
    ]
