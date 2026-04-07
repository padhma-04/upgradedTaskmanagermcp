import os
from django.http import JsonResponse
from django.conf import settings

class MCPAuthMiddleware:
    """
    Middleware to handle:
    1. API Key validation (x-api-key)
    2. Multi-app routing (app-id)
    3. User identification (user-id) - optional, handled by JWT but can be cross-checked
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip API Key check for admin panel, static files, and AUTH endpoints
        exempt_paths = [
            '/admin/', 
            '/static/', 
            '/api/v1/auth/', 
            '/api/v1/auth/login/',
            '/api/v1/auth/register/'
        ]
        if any(request.path.startswith(path) for path in exempt_paths):
            return self.get_response(request)

        # 1. API Key validation
        api_key = request.headers.get('x-api-key')
        expected_api_key = getattr(settings, 'MCP_API_KEY', None)
        
        # DEBUG: See what's happening
        print(f"--- [DEBUG] MCP Auth Middleware ---")
        print(f"Path: {request.path}")
        print(f"Received Key: {'***' + api_key[-4:] if api_key else 'None'}")
        print(f"Expected Key: {'***' + expected_api_key[-4:] if expected_api_key else 'None'}")
        
        if not api_key:
            return JsonResponse({'error': 'Missing API key in x-api-key header'}, status=403)
        
        if api_key != expected_api_key:
            return JsonResponse({'error': 'Invalid API key'}, status=403)

        # 2. Multi-app support (Optional check)
        app_id = request.headers.get('app-id')
        if not app_id:
            return JsonResponse({'error': 'Missing app-id header'}, status=400)
        
        # In a real multi-app system, we might route logic based on this ID
        request.app_id = app_id

        # 3. User-id (For testing/debugging purposes in this case)
        # In production, we rely on the JWT token for user identification.
        # But we'll store it in the request for easy access in our control panel testing.
        request.test_user_id = request.headers.get('user-id')

        response = self.get_response(request)
        return response
