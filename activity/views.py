from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db import connection
from activity.models import ActivityLog

class ActivityListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = ActivityLog.objects.filter(tenant=request.user.tenant).order_by('-created_at')[:200]
        data = [
            {
                "id": log.id,
                "action": log.action,
                "actor_id": log.actor_id,
                "target_type": log.target_type,
                "target_id": log.target_id,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ]
        return Response(data)


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            connection.ensure_connection()
            db_ok = True
        except Exception:
            db_ok = False
        return Response({"status": "ok" if db_ok else "error", "database": db_ok})

