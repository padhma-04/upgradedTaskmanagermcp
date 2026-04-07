from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from django.db.models import Q

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        app_id = getattr(self.request, 'app_id', 'task_manager')
        
        # 1. Admin Role: Access all tasks
        if user.role == 'ADMIN':
            return Task.objects.filter(app_id=app_id)
        
        # 2. User Role: Access only their own tasks
        return Task.objects.filter(user=user, app_id=app_id)

    def perform_create(self, serializer):
        app_id = getattr(self.request, 'app_id', 'task_manager')
        serializer.save(user=self.request.user, app_id=app_id)

    def perform_update(self, serializer):
        serializer.save()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
