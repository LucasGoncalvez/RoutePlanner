from rest_framework import serializers
from apps.routes.models import Location, Route

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'is_default']


class RouteSerializer(serializers.ModelSerializer):
    origin = LocationSerializer()
    destinations = LocationSerializer(many=True)
    
    class Meta:
        model = Route
        fields = ['id', 'name', 'origin', 'destinations', 'optimized_route', 'created_at']