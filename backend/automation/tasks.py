from celery import shared_task
from django.contrib.auth import get_user_model
from .utils import check_and_apply_rules

User = get_user_model()

@shared_task
def evaluate_automation_rules():
    for user in User.objects.all():
        check_and_apply_rules(user)
