from rest_framework import viewsets, permissions
from projects.models import Project
from projects.serializers import ProjectSerializer
from activity.utils import log_activity

class IsTenantActive(permissions.BasePermission):
    def has_permission(self, request, view):
        if getattr(request.user, 'is_superuser', False):
            return True
        return request.user.is_authenticated and request.user.tenant and request.user.tenant.is_active

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    class IsAdminOrReadOnly(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                return True
            if getattr(request.user, 'is_superuser', False):
                return True
            return hasattr(request.user, "role") and request.user.role == "admin"

    permission_classes = [IsTenantActive, IsAdminOrReadOnly]

    def get_queryset(self):
        if getattr(self.request.user, 'is_superuser', False):
            return Project.objects.select_related("created_by").all().order_by("-id")
        return Project.objects.select_related("created_by").filter(tenant=self.request.user.tenant).order_by("-id")

    def perform_create(self, serializer):
        project = serializer.save()
        log_activity(project.tenant, self.request.user, "project_created", "Project", project.id)

    def perform_update(self, serializer):
        project = serializer.save()
        log_activity(project.tenant, self.request.user, "project_updated", "Project", project.id)

    def perform_destroy(self, instance):
        log_activity(instance.tenant, self.request.user, "project_deleted", "Project", instance.id)
        instance.delete()
