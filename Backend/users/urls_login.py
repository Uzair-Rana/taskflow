from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from users.tokens import TenantTokenObtainPairSerializer

class TenantTokenObtainPairView(TokenObtainPairView):
    serializer_class = TenantTokenObtainPairSerializer

urlpatterns = [
    path("", TenantTokenObtainPairView.as_view(), name="token_obtain_pair"),
]
