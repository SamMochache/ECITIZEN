from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SystemMetrics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cpu_usage = models.FloatField()
    memory_usage = models.FloatField()
    disk_usage = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

class PingResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    target_ip = models.GenericIPAddressField()
    reachable = models.BooleanField()
    latency = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
