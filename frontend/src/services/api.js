import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token, x-api-key, and multi-app headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const apiKey = localStorage.getItem('mcp_api_key') || '';
  const appId = localStorage.getItem('mcp_app_id') || 'task_manager';
  const userId = localStorage.getItem('mcp_user_id') || '';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Multi-app and Security Headers
  config.headers['x-api-key'] = apiKey;
  config.headers['app-id'] = appId;
  if (userId) {
    config.headers['user-id'] = userId;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
