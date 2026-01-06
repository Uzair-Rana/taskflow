from activity.models import ActivityLog


def log_activity(tenant, actor, action, target_type, target_id):
    try:
        ActivityLog.objects.create(
            tenant=tenant,
            actor=actor,
            action=action,
            target_type=target_type,
            target_id=str(target_id),
        )
    except Exception:
        pass
