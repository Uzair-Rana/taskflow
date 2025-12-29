from django.urls import path
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet, TaskCommentsView

router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = router.urls + [
    path('<int:id>/comments/', TaskCommentsView.as_view(), name='task-comments'),
]
