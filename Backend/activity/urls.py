from django.urls import path
from activity.views import ActivityListView

urlpatterns = [
    path('', ActivityListView.as_view(), name='activity-list'),
]
