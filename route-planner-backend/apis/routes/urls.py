from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

urlpatterns = [
    path('optimal-route', views.optimal_route_view, name='optimal-route'),
]