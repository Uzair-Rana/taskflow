import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework_simplejwt.tokens import UntypedToken
from django.contrib.auth import get_user_model
from jwt import InvalidTokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from chat.models import Message
from tenants.models import Tenant


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        path_params = self.scope.get("url_route", {}).get("kwargs", {})
        tenant_id = path_params.get("tenant_id")

        # Authenticate via JWT token in querystring: ws://.../?token=<jwt>
        token = self.scope.get("query_string", b"").decode()
        token_value = None
        if token.startswith("token="):
            token_value = token.split("=", 1)[1]

        user = None
        if token_value:
            try:
                auth = JWTAuthentication()
                validated = auth.get_validated_token(token_value)
                user = await self._get_user_from_token(validated)
            except Exception:
                user = None

        if not user:
            await self.close(code=4001)
            return

        self.scope["user"] = user

        try:
            tenant = await self._get_tenant(tenant_id)
        except Tenant.DoesNotExist:
            await self.close(code=4004)
            return

        if not user.tenant or user.tenant_id != tenant.id:
            await self.close(code=4003)
            return

        self.room_group_name = f"chat_{tenant.id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        group = getattr(self, "room_group_name", None)
        if group:
            await self.channel_layer.group_discard(group, self.channel_name)

    async def receive_json(self, content, **kwargs):
        body = content.get("body")
        if not body:
            return
        user = self.scope.get("user")
        tenant_id = user.tenant_id
        message = await self._create_message(tenant_id, user.id, body)
        payload = {
            "id": message.id,
            "body": message.body,
            "author": {"id": user.id, "username": user.username, "email": user.email, "role": user.role},
            "created_at": message.created_at.isoformat(),
        }
        await self.channel_layer.group_send(self.room_group_name, {"type": "chat.message", "payload": payload})

    async def chat_message(self, event):
        await self.send_json(event["payload"])

    async def _get_user_from_token(self, validated_token):
        auth = JWTAuthentication()
        return auth.get_user(validated_token)

    async def _get_tenant(self, tenant_id):
        return await Tenant.objects.aget(id=tenant_id)

    async def _create_message(self, tenant_id, user_id, body):
        return await Message.objects.acreate(tenant_id=tenant_id, author_id=user_id, body=body)
