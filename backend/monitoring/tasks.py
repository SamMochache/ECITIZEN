from celery import shared_task
from django.contrib.auth import get_user_model
from .utils import collect_metrics, ping_ip

User = get_user_model()

@shared_task
def auto_monitor_all_users():
    for user in User.objects.all():
        collect_metrics(user)
        ping_ip(user, "8.8.8.8")  # Google DNS
