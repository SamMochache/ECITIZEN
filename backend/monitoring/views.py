from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import SystemMetrics, PingResult
from .serializers import SystemMetricsSerializer, PingResultSerializer
from .utils import collect_metrics, ping_ip

class CollectMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        collect_metrics(request.user)
        return Response({"message": "Metrics collected."})

class PingIPView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ip = request.data.get("ip")
        if not ip:
            return Response({"error": "IP is required"}, status=400)
        ping_ip(request.user, ip)
        return Response({"message": f"Ping to {ip} complete."})

class MetricsListView(generics.ListAPIView):
    serializer_class = SystemMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SystemMetrics.objects.filter(user=self.request.user)

class PingListView(generics.ListAPIView):
    serializer_class = PingResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PingResult.objects.filter(user=self.request.user)
