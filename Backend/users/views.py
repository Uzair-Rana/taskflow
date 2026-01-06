from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from users.serializers import CurrentUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from activity.utils import log_activity

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"detail": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        log_activity(request.user.tenant, request.user, "user_logged_out", "User", request.user.id)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


class RoleUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can update roles."}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(id=id, tenant=request.user.tenant)
        except User.DoesNotExist:
            return Response({"detail": "User not found in tenant."}, status=status.HTTP_404_NOT_FOUND)
        role = request.data.get("role")
        if role not in ["admin", "manager", "member"]:
            return Response({"detail": "Invalid role."}, status=status.HTTP_400_BAD_REQUEST)
        user.role = role
        user.save()
        log_activity(request.user.tenant, request.user, "user_role_updated", "User", user.id)
        return Response({"id": user.id, "role": user.role})


class DeactivateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        if request.user.role != 'admin':
            return Response({"detail": "Only tenant admins can deactivate users."}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(id=id, tenant=request.user.tenant)
        except User.DoesNotExist:
            return Response({"detail": "User not found in tenant."}, status=status.HTTP_404_NOT_FOUND)
        user.is_active = False
        user.save()
        log_activity(request.user.tenant, request.user, "user_deactivated", "User", user.id)
        return Response({"id": user.id, "is_active": user.is_active})
