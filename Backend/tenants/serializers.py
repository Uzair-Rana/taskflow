from rest_framework import serializers
from tenants.models import Tenant, TenantSettings
from users.models import User


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ["id", "name", "is_active", "created_at"]


class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "role"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class TenantRegistrationSerializer(serializers.Serializer):
    tenant_name = serializers.CharField(max_length=255)
    admin_username = serializers.CharField(max_length=150)
    admin_email = serializers.EmailField()
    admin_password = serializers.CharField(write_only=True, required=False)

    def validate_tenant_name(self, value):
        if Tenant.objects.filter(name=value).exists():
            raise serializers.ValidationError("Organization name already exists.")
        return value

    def create(self, validated_data):
        # Create tenant
        tenant = Tenant.objects.create(
            name=validated_data["tenant_name"]
        )

        # Create admin user (tenant-scoped)
        password = validated_data.get("admin_password")
        if not password:
            import secrets
            password = "".join(secrets.choice("0123456789") for _ in range(8))
        admin_user = User.objects.create_user(
            username=validated_data["admin_username"],
            email=validated_data["admin_email"],
            password=password,
            role="admin",
            tenant=tenant,
        )

        return tenant


class TenantInviteSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=["admin", "member"], default="member")
    tenant_id = serializers.IntegerField(required=False)
    password = serializers.CharField(write_only=True, required=False)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def create(self, validated_data):
        import secrets
        from tenants.models import Tenant
        # Resolve target tenant_id from validated data or serializer context
        tenant_id = validated_data.get('tenant_id') or self.context.get('tenant_id')
        tenant = Tenant.objects.get(id=tenant_id)
        # Use provided password if given; otherwise generate 8-digit temporary
        password = validated_data.get('password') or "".join(secrets.choice("0123456789") for _ in range(8))
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            tenant=tenant,
            role=validated_data['role']
        )
        return user, password


class TenantSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantSettings
        fields = ["config", "updated_at"]

    def update(self, instance, validated_data):
        config = validated_data.get("config", instance.config)
        instance.config = config
        instance.save()
        return instance
