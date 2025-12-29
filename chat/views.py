from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from chat.models import Message
from chat.serializers import MessageSerializer


class ChatMessagesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        messages = Message.objects.select_related("author").filter(tenant=request.user.tenant).order_by("id")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
