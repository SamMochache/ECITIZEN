from .models import AutomationRule, ActionLog
from monitoring.models import SystemMetrics
from django.core.mail import send_mail

def check_and_apply_rules(user):
    rules = AutomationRule.objects.filter(user=user, active=True)
    if not rules.exists():
        return

    latest_metrics = SystemMetrics.objects.filter(user=user).last()
    if not latest_metrics:
        return

    for rule in rules:
        triggered = False
        value = 0.0

        if rule.condition == 'CPU_HIGH':
            value = latest_metrics.cpu_usage
            triggered = value >= rule.threshold
        elif rule.condition == 'MEMORY_HIGH':
            value = latest_metrics.memory_usage
            triggered = value >= rule.threshold
        elif rule.condition == 'DISK_HIGH':
            value = latest_metrics.disk_usage
            triggered = value >= rule.threshold

        if triggered:
            # Execute action
            if rule.action == 'EMAIL_ALERT':
                send_mail(
                    subject="CyberTiba Alert",
                    message=f"{rule.condition} exceeded: {value}%",
                    from_email="alerts@cybertiba.ke",
                    recipient_list=[user.email],
                    fail_silently=True
                )
                action_desc = f"Email sent to {user.email}"
            elif rule.action == 'BLOCK_IP':
                # Placeholder for IP blocking logic
                action_desc = f"Blocked suspicious IP (mock)"
            else:
                action_desc = "Logged condition only"

            # Save log
            ActionLog.objects.create(
                user=user,
                condition=rule.condition,
                value=value,
                action_taken=action_desc
            )
