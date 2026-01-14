from django.urls import path
from .views import TenantRegistrationView, TenantInviteView, TenantUsersListView, TenantSettingsView, TenantsListView, TenantDeleteView

urlpatterns = [
    path('', TenantRegistrationView.as_view(), name='tenant-register'),
    path('invite/', TenantInviteView.as_view(), name='tenant-invite'),
    path('users/', TenantUsersListView.as_view(), name='tenant-users'),
    path('settings/', TenantSettingsView.as_view(), name='tenant-settings'),
    path('all/', TenantsListView.as_view(), name='tenants-all'),
    path('delete/<int:id>/', TenantDeleteView.as_view(), name='tenant-delete'),
]
