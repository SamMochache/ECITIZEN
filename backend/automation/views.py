from rest_framework import generics, permissions
from .models import AutomationRule, ActionLog
from .serializers import AutomationRuleSerializer, ActionLogSerializer

class RuleListCreateView(generics.ListCreateAPIView):
    serializer_class = AutomationRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AutomationRule.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ActionLogListView(generics.ListAPIView):
    serializer_class = ActionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ActionLog.objects.filter(user=self.request.user)
