from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from senda.core import urls as core_urls


enable_graphiql = settings.ENVIRONMENT != "production"

urlpatterns = [
    path("markdownx/", include("markdownx.urls")),
    # regex with and without trailing slash graphql
    re_path(
        r"^graphql/?$",
        csrf_exempt(GraphQLView.as_view(graphiql=enable_graphiql)),
    ),
    path("api/", include(core_urls)),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.ENVIRONMENT != "production":
    urlpatterns.append(path("admin/", admin.site.urls))

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG and "debug_toolbar" in settings.INSTALLED_APPS:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
