from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CurrentUserView, LogoutView
from tenants.views import TenantSettingsView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/login/", include("users.urls_login")),
    path("api/auth/refresh/", TokenRefreshView.as_view()),
    path("api/auth/logout/", LogoutView.as_view()),
    path("api/auth/me/", CurrentUserView.as_view()),

    # Tenants
    path("api/tenants/", include("tenants.urls")),
    path("api/tenant/settings/", TenantSettingsView.as_view()),

    # Users management
    path("api/users/", include("users.urls")),

    # Projects & Tasks
    path("api/projects/", include("projects.urls")),
    path("api/tasks/", include("tasks.urls")),

    # Activity logs and Health
    path("api/activity/", include("activity.urls")),
    path("api/health/", include("activity.urls_health")),

    # Chat
    path("api/chat/", include("chat.urls")),
]
