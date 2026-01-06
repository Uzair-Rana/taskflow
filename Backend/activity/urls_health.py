from django.urls import path
from activity.views import HealthCheckView

urlpatterns = [
    path('', HealthCheckView.as_view(), name='health-check'),
]
