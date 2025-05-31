from django.urls import include, path

urlpatterns = [
    path('', include('apis.routes.urls')),
]