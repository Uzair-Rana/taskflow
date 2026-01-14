from rest_framework import serializers
from users.models import User
from tenants.models import Tenant

class TenantInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ["id", "name"]

class CurrentUserSerializer(serializers.ModelSerializer):
    tenant = TenantInfoSerializer(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "tenant", "is_superuser"]

class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "role",
            "is_active",
            "password"
        ]

    def create(self, validated_data):
        """
        Create a user with hashed password
        """
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
