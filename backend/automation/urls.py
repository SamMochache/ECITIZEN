from django.urls import path
from .views import RuleListCreateView, ActionLogListView

urlpatterns = [
    path('rules/', RuleListCreateView.as_view(), name='automation_rules'),
    path('logs/', ActionLogListView.as_view(), name='action_logs'),
]
