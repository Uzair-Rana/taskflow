from rest_framework import viewsets, permissions
from projects.models import Project
from projects.serializers import ProjectSerializer
from activity.utils import log_activity

class IsTenantActive(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.tenant and request.user.tenant.is_active

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsTenantActive]

    def get_queryset(self):
        return Project.objects.select_related("created_by").filter(tenant=self.request.user.tenant).order_by("-id")

    def perform_create(self, serializer):
        project = serializer.save()
        log_activity(self.request.user.tenant, self.request.user, "project_created", "Project", project.id)

    def perform_update(self, serializer):
        project = serializer.save()
        log_activity(self.request.user.tenant, self.request.user, "project_updated", "Project", project.id)

    def perform_destroy(self, instance):
        log_activity(self.request.user.tenant, self.request.user, "project_deleted", "Project", instance.id)
        instance.delete()
