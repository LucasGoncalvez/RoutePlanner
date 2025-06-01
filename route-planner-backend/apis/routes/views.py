
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
import itertools
from drf_yasg.utils import swagger_auto_schema
from .serializers import RoutePlannerSerializer
from route_planner_backend import settings

ORS_API_KEY = settings.ORS_API_KEY

class OptimalRouteView(APIView):
    permission_classes = []
    @swagger_auto_schema(request_body=RoutePlannerSerializer)
    def post(self, request):
        try:
            serializer = RoutePlannerSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            origin = serializer.validated_data["origin"]
            destinations = serializer.validated_data["destinations"]
            transport_mode = serializer.validated_data["mode"]

            if not origin or not destinations:
                return Response({"error": "Origin and destinations are required."}, status=status.HTTP_400_BAD_REQUEST)

            all_points = [origin] + destinations
            coordinates = [[p["lng"], p["lat"]] for p in all_points]

            # Llamada a OpenRouteService para obtener matriz de duración y distancia
            url = "https://api.openrouteservice.org/v2/matrix/" + transport_mode
            headers = {
                "Authorization": ORS_API_KEY,
                "Content-Type": "application/json"
            }
            payload = {
                "locations": coordinates,
                "metrics": ["duration", "distance"],
                "units": "m"
            }

            response = requests.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                return Response({"error": "ORS request failed.", "details": response.json()}, status=response.status_code)

            durations = response.json()["durations"]
            distances = response.json()["distances"]

            n = len(destinations)
            best_order = None
            best_distance = None
            min_duration = float("inf")

            for perm in itertools.permutations(range(1, n + 1)):
                total_duration = durations[0][perm[0]]
                total_distance = distances[0][perm[0]]

                for i in range(len(perm) - 1):
                    total_duration += durations[perm[i]][perm[i + 1]]
                    total_distance += distances[perm[i]][perm[i + 1]]

                if total_duration < min_duration:
                    min_duration = total_duration
                    best_distance = total_distance
                    best_order = perm

            # Construir respuesta con el orden óptimo
            ordered_destinations = [origin] + [destinations[i - 1] for i in best_order]
            return Response({
                "ordered_destinations": ordered_destinations,
                "total_estimated_duration_minutes": round(min_duration / 60, 2),
                "total_distance_km": round(best_distance / 1000, 2)
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


optimal_route_view = OptimalRouteView.as_view()