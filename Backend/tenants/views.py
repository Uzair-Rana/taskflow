from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import TenantRegistrationSerializer, TenantInviteSerializer, TenantSettingsSerializer
from users.serializers import CurrentUserSerializer
from tenants.models import TenantSettings
from activity.utils import log_activity


class TenantRegistrationView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = TenantRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()
        admin_user = None
        try:
            admin_user = tenant.users.filter(role='admin').first()
        except Exception:
            admin_user = None
        log_activity(tenant, admin_user, "tenant_registered", "Tenant", tenant.id)
        return Response(
            {
                "message": "Tenant registered successfully",
                "tenant_id": tenant.id,
            },
            status=status.HTTP_201_CREATED
        )


class TenantInviteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Only admin can invite
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can invite users."},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = TenantInviteSerializer(
            data=request.data,
            context={'tenant': request.user.tenant}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        log_activity(request.user.tenant, request.user, "tenant_user_invited", "User", user.id)
        return Response({
            "message": "User invited successfully",
            "user_id": user.id
        }, status=status.HTTP_201_CREATED)


class TenantUsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can list users."}, status=status.HTTP_403_FORBIDDEN)
        users = request.user.tenant.users.all().order_by('id')
        serializer = CurrentUserSerializer(users, many=True)
        return Response(serializer.data)


class TenantSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.tenant:
            return Response({"detail": "User not associated with a tenant."}, status=status.HTTP_400_BAD_REQUEST)
        settings_obj, _ = TenantSettings.objects.get_or_create(tenant=request.user.tenant)
        serializer = TenantSettingsSerializer(settings_obj)
        return Response(serializer.data)

    def patch(self, request):
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can update settings."}, status=status.HTTP_403_FORBIDDEN)
        settings_obj, _ = TenantSettings.objects.get_or_create(tenant=request.user.tenant)
        serializer = TenantSettingsSerializer(settings_obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
