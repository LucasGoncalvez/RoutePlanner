from rest_framework import viewsets, permissions
from apps.routes.models import Location, Route
from .serializers import LocationSerializer, RouteSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Location.objects.filter(user=user) | Location.objects.filter(is_default=True)
        return Location.objects.filter(is_default=True)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class RouteViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Route.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def optimize(self, request, pk=None):
        route = self.get_object()
        # Aquí implementarías el algoritmo de optimización de ruta
        # Por ahora, solo devolvemos las ubicaciones en el orden recibido
        optimized_route = {
            'origin': LocationSerializer(route.origin).data,
            'waypoints': LocationSerializer(route.destinations.all(), many=True).data
        }
        route.optimized_route = optimized_route
        route.save()
        return Response(optimized_route)