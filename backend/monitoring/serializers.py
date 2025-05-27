from rest_framework import serializers
from .models import SystemMetrics, PingResult

class SystemMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemMetrics
        fields = '__all__'

class PingResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PingResult
        fields = '__all__'
