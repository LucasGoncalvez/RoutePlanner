from rest_framework import serializers

class CoordinateSerializer(serializers.Serializer):
    lat = serializers.FloatField()
    lng = serializers.FloatField()

class RoutePlannerSerializer(serializers.Serializer):
    origin = CoordinateSerializer(required=True)
    destinations = serializers.ListField(
        child=CoordinateSerializer(),
        min_length=1,
        required=True
    )
    mode = serializers.ChoiceField(
        choices=["driving-car", "cycling-regular", "foot-walking"],
        default="driving-car",
        required=False
    )

    def validate(self, data):
        """Validación adicional para asegurar que los datos son correctos"""
        if 'origin' not in data:
            raise serializers.ValidationError("Origin is required")
        if 'destinations' not in data or len(data['destinations']) < 1:
            raise serializers.ValidationError("At least one destination is required")
        return data
