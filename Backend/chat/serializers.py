from rest_framework import serializers
from chat.models import Message
from users.serializers import CurrentUserSerializer


class MessageSerializer(serializers.ModelSerializer):
    author = CurrentUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "body", "author", "created_at"]
