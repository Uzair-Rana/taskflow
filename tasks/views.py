from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from tasks.models import Task, TaskComment
from tasks.serializers import (
    TaskSerializer,
    TaskUpdateSerializer,
    TaskStatusSerializer,
    TaskAssignSerializer,
    TaskCommentSerializer,
)
from users.models import User
from activity.utils import log_activity

class IsTenantActive(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tenant and request.user.tenant.is_active

class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantActive]
    filterset_fields = ["status", "project", "due_date"]

    def get_queryset(self):
        return Task.objects.select_related("project", "created_by").filter(tenant=self.request.user.tenant).order_by("-id")

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return TaskUpdateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save()
        log_activity(self.request.user.tenant, self.request.user, "task_created", "Task", task.id)

    @action(detail=True, methods=["patch"], url_path="status")
    def change_status(self, request, pk=None):
        try:
            task = Task.objects.get(pk=pk, tenant=request.user.tenant)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskStatusSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_activity(self.request.user.tenant, self.request.user, "task_status_changed", "Task", task.id)
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=["post"], url_path="assign")
    def assign_users(self, request, pk=None):
        try:
            task = Task.objects.get(pk=pk, tenant=request.user.tenant)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskAssignSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_ids = serializer.validated_data["user_ids"]
        users = User.objects.filter(id__in=user_ids, tenant=request.user.tenant)
        task.assignees.set(users)
        task.save()
        log_activity(self.request.user.tenant, self.request.user, "task_assigned", "Task", task.id)
        return Response(TaskSerializer(task).data)


class TaskCommentsView(APIView):
    permission_classes = [IsTenantActive]

    def get(self, request, id):
        try:
            task = Task.objects.get(pk=id, tenant=request.user.tenant)
        except Task.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        comments = task.comments.select_related("author").all().order_by("id")
        serializer = TaskCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, id):
        data = request.data.copy()
        data["task"] = id
        serializer = TaskCommentSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        log_activity(request.user.tenant, request.user, "task_comment_added", "Task", id)
        return Response(TaskCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
