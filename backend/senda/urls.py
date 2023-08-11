from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from graphql_jwt.decorators import jwt_cookie
from extensions.graphql.views import SentryGraphQLView
from graphene_django.views import GraphQLView

enable_graphiql = settings.ENVIRONMENT != "production"
EnvGraphQLView = (
    GraphQLView if settings.ENVIRONMENT == "development" else SentryGraphQLView
)

urlpatterns = [
    path("markdownx/", include("markdownx.urls")),
    path(
        "graphql",
        csrf_exempt(jwt_cookie(EnvGraphQLView.as_view(graphiql=enable_graphiql))),
    ),
    path(
        "graphql/",
        csrf_exempt(jwt_cookie(EnvGraphQLView.as_view(graphiql=enable_graphiql))),
    ),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.ENVIRONMENT != "production":
    urlpatterns.append(path("admin/", admin.site.urls))

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG and "debug_toolbar" in settings.INSTALLED_APPS:
    import debug_toolbar

    urlpatterns = [path("__debug__/", include(debug_toolbar.urls))] + urlpatterns
