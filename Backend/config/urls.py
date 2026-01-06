from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CurrentUserView, LogoutView
from tenants.views import TenantSettingsView

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/login/", include("users.urls_login")), #user login and making the tokens
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), #refreshing the token after expiry
    path("api/auth/logout/", LogoutView.as_view(), name="logout"), #logout the existing user as blacklist its token make sure to disable the working of the token
    path("api/auth/me/", CurrentUserView.as_view(), name="current_user"),  #View the user and also checking its tenant and manager who is handling the user

    # Tenants
    path("api/tenants/", include("tenants.urls")),  #this one URL refers the flow of execution to the tenants folder and inside this urls file
    path("api/tenant/settings/", TenantSettingsView.as_view(), name="tenant_settings"),

    # Users management
    path("api/users/", include("users.urls")), #users/urls.py

    # Projects & Tasks
    path("api/projects/", include("projects.urls")),  # e.g., projects/urls.py
    path("api/tasks/", include("tasks.urls")),  # e.g., tasks/urls.py

    # Activity logs and Health
    path("api/activity/", include("activity.urls")),  # e.g., activity/urls.py
    path("api/health/", include("activity.urls_health")),  # e.g., activity/urls_health.py

    # Chat
    path("api/chat/", include("chat.urls")),  # e.g., chat/urls.py
]
