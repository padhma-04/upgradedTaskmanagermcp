from django.urls import path
from .views import AICreateTaskView, AISummarizeTasksView

urlpatterns = [
    path('ai/create/', AICreateTaskView.as_view(), name='ai-create-task'),
    path('ai/summarize/', AISummarizeTasksView.as_view(), name='ai-summarize-tasks'),
]
