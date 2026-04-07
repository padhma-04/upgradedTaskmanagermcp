import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, Settings, LogOut, CheckSquare, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/', name: 'Workspace', icon: LayoutDashboard },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full sticky top-[65px]">
      <div className="p-6 flex-1">
        <div className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
              `}
            >
              <link.icon size={18} />
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-4">
            Actions
          </p>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 w-full text-left transition-colors">
            <PlusCircle size={18} />
            Quick Add
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold uppercase">
            {user?.username?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
              {user?.username}
            </p>
            <p className="text-xs text-slate-500 truncate uppercase tracking-tighter">
              {user?.role}
            </p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
