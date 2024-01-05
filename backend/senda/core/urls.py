from django.urls import re_path
from . import views

urlpatterns = [
    re_path(
        r"^download-contract-pdf/(?P<contract_id>[\w-]+)/?$",
        views.download_pdf,
        name="download_pdf",
    )
]
