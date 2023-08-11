import os
from decouple import config

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

from configurations.wsgi import get_wsgi_application
application = get_wsgi_application()
