from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings
from tenants.models import Tenant
from .serializers import TenantRegistrationSerializer, TenantInviteSerializer, TenantSettingsSerializer, TenantSerializer
from users.serializers import CurrentUserSerializer
from tenants.models import TenantSettings
from activity.utils import log_activity


class TenantRegistrationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Only global superuser (Uzair) can register tenants
        if not request.user.is_superuser or request.user.username != 'Uzair':
            return Response({"detail": "Only global admin can register tenants."}, status=status.HTTP_403_FORBIDDEN)
        serializer = TenantRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tenant = serializer.save()
        # Email admin credentials/link
        admin_email = serializer.validated_data.get("admin_email")
        admin_username = serializer.validated_data.get("admin_username")
        # Password may be generated; re-create to obtain it
        # Rebuild password by re-invoking generate logic is not trivial; better fetch the created admin
        admin_user = tenant.users.filter(role='admin').first()
        login_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/login?next=/admin"
        if admin_user:
            send_mail(
                subject="Your Tenant Admin Access",
                message=f"Hello {admin_username},\nYour account is ready.\nUsername: {admin_user.username}\nPlease use your provided/temporary password.\nLogin here: {login_url}",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@teamflow.local'),
                recipient_list=[admin_email],
                fail_silently=True,
            )
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
        # Allow global superuser or tenant admin to invite
        if request.user.is_superuser and request.user.username == 'Uzair':
            target_tenant_id = request.data.get('tenant_id')
            if not target_tenant_id:
                return Response({"detail": "tenant_id is required for global admin."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if getattr(request.user, 'role', None) != 'admin' or not request.user.tenant_id:
                return Response({"detail": "Only tenant admins can invite users."}, status=status.HTTP_403_FORBIDDEN)
            target_tenant_id = request.user.tenant_id

        serializer = TenantInviteSerializer(data=request.data, context={"tenant_id": target_tenant_id})
        serializer.is_valid(raise_exception=True)
        (user, password) = serializer.save()
        log_activity(user.tenant, request.user, "tenant_user_invited", "User", user.id)
        login_target = "/admin" if user.role == 'admin' else "/user"
        login_url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/login?next={login_target}"
        email_sent = False
        try:
            send_mail(
                subject="Your TeamFlow Account",
                message=f"Hello {user.username},\nYour temporary password: {password}\nLogin: {login_url}",
                from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@teamflow.local'),
                recipient_list=[user.email],
                fail_silently=False,
            )
            email_sent = True
        except Exception:
            email_sent = False
        return Response({
            "message": "User invited successfully",
            "user_id": user.id,
            "temp_password": password,
            "login_url": login_url,
            "email_sent": email_sent,
        }, status=status.HTTP_201_CREATED)


class TenantUsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_superuser:
            # Global admin can list all users across tenants
            users = Tenant.objects.all().order_by('id').values_list('users', flat=True)
            # Fallback: list users across all tenants
            from users.models import User
            queryset = User.objects.select_related('tenant').all().order_by('id')
            serializer = CurrentUserSerializer(queryset, many=True)
            return Response(serializer.data)
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can list users."}, status=status.HTTP_403_FORBIDDEN)
        users = request.user.tenant.users.all().order_by('id')
        serializer = CurrentUserSerializer(users, many=True)
        return Response(serializer.data)


class TenantsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_superuser or request.user.username != 'Uzair':
            return Response({"detail": "Only global admin can list tenants."}, status=status.HTTP_403_FORBIDDEN)
        tenants = Tenant.objects.all().order_by('id')
        serializer = TenantSerializer(tenants, many=True)
        return Response(serializer.data)


class TenantDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        if not request.user.is_superuser or request.user.username != 'Uzair':
            return Response({"detail": "Only global admin can delete tenants."}, status=status.HTTP_403_FORBIDDEN)
        try:
            tenant = Tenant.objects.get(id=id)
        except Tenant.DoesNotExist:
            return Response({"detail": "Tenant not found."}, status=status.HTTP_404_NOT_FOUND)
        tenant.delete()
        return Response({"message": "Tenant deleted"}, status=status.HTTP_200_OK)


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
