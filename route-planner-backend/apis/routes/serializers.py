from rest_framework import serializers

class CoordinateSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()

class RoutePlannerSerializer(serializers.Serializer):
    origin = CoordinateSerializer()
    destinations = serializers.ListSerializer(
        child=CoordinateSerializer(),
        allow_empty=False,
        min_length=1
    )
    mode = serializers.ChoiceField(
        choices=["driving-car", "cycling-regular", "foot-walking"],
        default="driving-car",
        required=False
    )
