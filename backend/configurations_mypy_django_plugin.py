import os

from configurations.importer import install
from mypy_django_plugin import main


def plugin(version: str):
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "senda.settings")
    os.environ.setdefault("DJANGO_CONFIGURATION", "Development")
    install()
    return main.plugin(version)
