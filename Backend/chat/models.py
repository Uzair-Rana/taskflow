from django.db import models
from tenants.models import Tenant
from users.models import User


class Message(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="messages")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.author.username}: {self.body[:20]}"
