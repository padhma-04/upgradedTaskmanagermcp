from rest_framework import views, status, permissions
from rest_framework.response import Response
from .services import get_ai_service
from tasks.models import Task
from tasks.serializers import TaskSerializer

class AICreateTaskView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({"error": "Missing 'text' field"}, status=status.HTTP_400_BAD_REQUEST)
        
        service = get_ai_service()
        structured_task = service.process_natural_language_task(text)
        
        # Save the structured task
        app_id = getattr(request, 'app_id', 'task_manager')
        create_params = {
            'user': request.user,
            'title': structured_task.get('title', 'New Task'),
            'description': structured_task.get('description', ''),
            'priority': structured_task.get('priority', 'MEDIUM'),
            'status': 'PENDING',
            'app_id': app_id
        }
        
        if structured_task.get('scheduled_at'):
            create_params['scheduled_at'] = structured_task['scheduled_at']
            
        task = Task.objects.create(**create_params)
        
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AISummarizeTasksView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        app_id = getattr(request, 'app_id', 'task_manager')
        tasks = Task.objects.filter(user=request.user, app_id=app_id)
        serializer = TaskSerializer(tasks, many=True)
        
        service = ClaudeMCPService()
        summary = service.summarize_tasks(serializer.data)
        
        return Response({"summary": summary})
