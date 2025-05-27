import psutil
from ping3 import ping
from .models import SystemMetrics, PingResult

def collect_metrics(user):
    cpu = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    SystemMetrics.objects.create(
        user=user,
        cpu_usage=cpu,
        memory_usage=memory,
        disk_usage=disk,
    )

def ping_ip(user, ip):
    try:
        latency = ping(ip, timeout=2)
        reachable = latency is not None
        PingResult.objects.create(
            user=user,
            target_ip=ip,
            reachable=reachable,
            latency=latency if latency else 0.0,
        )
    except Exception as e:
        PingResult.objects.create(user=user, target_ip=ip, reachable=False, latency=0.0)
