import React, { useState, useEffect } from 'react';
import { Settings, Shield, User, Globe, Key } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ControlPanel = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('mcp_api_key') || 'secret-123');
  const [appId, setAppId] = useState(localStorage.getItem('mcp_app_id') || 'task_manager');
  const [userId, setUserId] = useState(localStorage.getItem('mcp_user_id') || 'admin');
  const [role, setRole] = useState(localStorage.getItem('mcp_role') || 'ADMIN');

  useEffect(() => {
    localStorage.setItem('mcp_api_key', apiKey);
    localStorage.setItem('mcp_app_id', appId);
    localStorage.setItem('mcp_user_id', userId);
    localStorage.setItem('mcp_role', role);
  }, [apiKey, appId, userId, role]);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold">
          <Settings size={20} />
          <span className="hidden sm:inline">CONTROL PANEL (TESTING)</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Security Key */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Key size={14} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Security Key (secret-123)" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-48 outline-none text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* Role */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Shield size={14} className="text-slate-500" />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-transparent border-none focus:ring-0 outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* App ID */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <Globe size={14} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="App ID" 
              value={appId} 
              onChange={(e) => setAppId(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-32 outline-none text-slate-700 dark:text-slate-300"
            />
          </div>

          {/* User ID */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <User size={14} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="User ID (optional)" 
              value={userId} 
              onChange={(e) => setUserId(e.target.value)}
              className="bg-transparent border-none focus:ring-0 w-32 outline-none text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
          <div className={cn(
            "w-2 h-2 rounded-full", 
            apiKey?.trim().toLowerCase() === 'secret-123' ? "bg-green-500" : (apiKey ? "bg-yellow-500" : "bg-red-500")
          )}></div>
          <div className="flex flex-col">
            <span>Status: {apiKey?.trim().toLowerCase() === 'secret-123' ? 'Authorized' : (apiKey ? 'Invalid Key' : 'Missing Key')}</span>
            {apiKey?.trim().toLowerCase() !== 'secret-123' && (
              <button 
                onClick={() => setApiKey('secret-123')}
                className="text-primary-600 hover:text-primary-700 font-bold underline text-[10px] text-left"
              >
                Auto-Fix Key
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
