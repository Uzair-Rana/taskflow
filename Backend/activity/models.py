from django.db import models
from tenants.models import Tenant
from users.models import User

class ActivityLog(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="activities")
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="activities")
    action = models.CharField(max_length=255)
    target_type = models.CharField(max_length=100)
    target_id = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

# Create your models here.
