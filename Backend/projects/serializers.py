from rest_framework import serializers
from projects.models import Project
from users.serializers import CurrentUserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    created_by = CurrentUserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        request = self.context["request"]
        project = Project.objects.create(
            tenant=request.user.tenant,
            created_by=request.user,
            **validated_data
        )
        return project
