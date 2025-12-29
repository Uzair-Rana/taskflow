from django.urls import path
from .views import RoleUpdateView, DeactivateUserView

urlpatterns = [
    path("<int:id>/role/", RoleUpdateView.as_view(), name="user-role-update"),
    path("<int:id>/deactivate/", DeactivateUserView.as_view(), name="user-deactivate"),
]
