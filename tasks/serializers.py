from rest_framework import serializers
from tasks.models import Task, TaskComment
from users.serializers import CurrentUserSerializer

class TaskSerializer(serializers.ModelSerializer):
    assignees = CurrentUserSerializer(many=True, read_only=True)
    created_by = CurrentUserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "title",
            "description",
            "status",
            "due_date",
            "assignees",
            "created_by",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        task = Task.objects.create(
            tenant=request.user.tenant,
            created_by=request.user,
            **validated_data
        )
        return task


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["title", "description", "status", "due_date"]


class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["status"]


class TaskAssignSerializer(serializers.Serializer):
    user_ids = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)


class TaskCommentSerializer(serializers.ModelSerializer):
    author = CurrentUserSerializer(read_only=True)

    class Meta:
        model = TaskComment
        fields = ["id", "task", "body", "author", "created_at"]

    def create(self, validated_data):
        request = self.context["request"]
        comment = TaskComment.objects.create(
            tenant=request.user.tenant,
            author=request.user,
            **validated_data
        )
        return comment
