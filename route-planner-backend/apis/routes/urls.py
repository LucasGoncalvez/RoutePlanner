from django.urls import path
from . import views

urlpatterns = [
    path('optimal-route/', views.optimal_route_view, name='optimal-route'),
    
]