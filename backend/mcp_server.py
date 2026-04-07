import os
import django
import sys
import asyncio
from asgiref.sync import sync_to_async
from mcp.server.fastmcp import FastMCP

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
# Allow async queries to be extra safe
os.environ["DJANGO_ALLOW_ASYNC_QUERY"] = "true"
django.setup()

from tasks.models import Task
from django.contrib.auth import get_user_model

User = get_user_model()

# Create MCP server
mcp = FastMCP("Local Task Manager")

# helper to wrap sync calls
def run_sync(func, *args, **kwargs):
    # thread_sensitive=False is CRITICAL here to avoid AsynchronousContextError
    # It tells Django to run this in a separate thread instead of the main one
    return sync_to_async(func, thread_sensitive=False)(*args, **kwargs)

@mcp.tool()
async def list_tasks(username: str, app_id: str = "task_manager") -> str:
    """Lists all tasks for a specific user and app."""
    try:
        user = await run_sync(User.objects.get, username=username)
        # Use a lambda or helper function for complex filters
        tasks_query = Task.objects.filter(user=user, app_id=app_id)
        tasks = await run_sync(list, tasks_query)
        
        if not tasks:
            return f"No tasks found for user '{username}'."
        
        result = []
        for t in tasks:
            result.append(f"[{t.id}] {t.title} | Status: {t.status} | Priority: {t.priority}")
        return "\n".join(result)
    except User.DoesNotExist:
        return f"User '{username}' not found."
    except Exception as e:
        return f"Error: {str(e)}"

@mcp.tool()
async def add_task(username: str, title: str, description: str = "", priority: str = "MEDIUM", scheduled_at: str = None, app_id: str = "task_manager") -> str:
    """
    Adds a new task to the workspace.
    scheduled_at should be in YYYY-MM-DD format (optional).
    """
    try:
        user = await run_sync(User.objects.get, username=username)
        create_params = {
            'user': user,
            'title': title,
            'description': description,
            'priority': priority.upper(),
            'status': 'PENDING',
            'app_id': app_id
        }
        
        if scheduled_at:
            create_params['scheduled_at'] = scheduled_at
            
        task = await run_sync(Task.objects.create, **create_params)
        return f"Task created successfully: ID {task.id}"
    except User.DoesNotExist:
        return f"User '{username}' not found."
    except Exception as e:
        # Detailed error for internal logs
        print(f"DEBUG Error in add_task: {str(e)}", file=sys.stderr)
        return f"Error creating task: {str(e)}"

@mcp.tool()
async def update_task_status(task_id: int, status: str) -> str:
    """Updates the status of an existing task (PENDING, IN_PROGRESS, COMPLETED)."""
    try:
        task = await run_sync(Task.objects.get, id=task_id)
        old_status = task.status
        task.status = status.upper()
        await run_sync(task.save)
        return f"Task {task_id} updated from {old_status} to {task.status}"
    except Task.DoesNotExist:
        return f"Task with ID {task_id} not found."
    except Exception as e:
        return f"Error updating task: {str(e)}"

if __name__ == "__main__":
    mcp.run()
