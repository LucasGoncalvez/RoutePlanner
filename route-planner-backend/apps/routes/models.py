from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.address})"


class Route(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    origin = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='route_origins')
    destinations = models.ManyToManyField(Location, related_name='route_destinations')
    optimized_route = models.JSONField()  # Para almacenar el resultado del algoritmo de optimización
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"