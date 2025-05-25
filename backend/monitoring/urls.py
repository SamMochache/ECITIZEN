from django.urls import path
from .views import CollectMetricsView, PingIPView, MetricsListView, PingListView

urlpatterns = [
    path('collect/', CollectMetricsView.as_view(), name='collect_metrics'),
    path('ping/', PingIPView.as_view(), name='ping_ip'),
    path('metrics/', MetricsListView.as_view(), name='metrics_list'),
    path('pings/', PingListView.as_view(), name='ping_list'),
]
