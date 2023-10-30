#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

from decouple import config


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'senda.settings')

    enviroment = config("ENVIROMENT")

    if enviroment == "staging":
        DJANGO_CONFIGURATION = 'Staging'
    elif enviroment == "preview":
        DJANGO_CONFIGURATION = 'Preview'
    elif enviroment == "production":
        DJANGO_CONFIGURATION = 'Production'
    else:
        DJANGO_CONFIGURATION = 'Development'

    os.environ.setdefault('DJANGO_CONFIGURATION', DJANGO_CONFIGURATION)

    from django.conf import settings

    try:
        from configurations.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
