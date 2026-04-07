import os
import django
import sys
from datetime import datetime

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(os.getcwd())))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from tasks.models import Task
from ai_engine.services import get_ai_service
from django.contrib.auth import get_user_model

User = get_user_model()

def debug_ai_creation():
    print("--- Starting AI Creation Debug ---")
    try:
        user = User.objects.get(username='admin')
        text = "submit report tomorrow"
        print(f"Testing input: '{text}'")
        
        service = get_ai_service()
        print(f"Using service: {service.__class__.__name__}")
        
        structured_task = service.process_natural_language_task(text)
        print(f"AI Parsed Result: {structured_task}")
        
        create_params = {
            'user': user,
            'title': structured_task.get('title', 'New Task'),
            'description': structured_task.get('description', ''),
            'priority': structured_task.get('priority', 'MEDIUM'),
            'status': 'PENDING',
            'app_id': 'task_manager'
        }
        
        sched = structured_task.get('scheduled_at')
        if sched:
            print(f"AI suggested date: {sched}")
            # Try to validate date format
            try:
                datetime.strptime(sched, '%Y-%m-%d')
                create_params['scheduled_at'] = sched
            except ValueError:
                print(f"WARNING: AI returned invalid date format: {sched}. Falling back to default.")
        
        task = Task.objects.create(**create_params)
        print(f"SUCCESS! Task created with ID: {task.id}")
        
    except Exception as e:
        print("\n!!! ERROR CAUGHT !!!")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_ai_creation()
