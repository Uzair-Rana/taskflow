from django.urls import path
from chat.views import ChatMessagesView

urlpatterns = [
    path('messages/', ChatMessagesView.as_view(), name='chat-messages'),
]
