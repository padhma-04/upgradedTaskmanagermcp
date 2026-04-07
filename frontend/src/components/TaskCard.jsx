import React from 'react';
import api from '../services/api';
import { Clock, CheckCircle2, AlertCircle, Trash2, Edit2, MoreVertical, RefreshCw } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TaskCard = ({ task, view, onUpdate }) => {
  const handleToggleStatus = async () => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.patch(`/tasks/${task.id}/`, { status: newStatus });
      onUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task.id}/`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const statusIcons = {
    'PENDING': <Clock className="text-yellow-500" size={14} />,
    'IN_PROGRESS': <RefreshCw className="text-blue-500 animate-spin-slow" size={14} />,
    'COMPLETED': <CheckCircle2 className="text-green-500" size={14} />,
  };

  const priorityColors = {
    'LOW': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'MEDIUM': 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    'HIGH': 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden",
      view === 'grid' ? "p-5 flex flex-col h-full" : "p-4 flex items-center gap-4",
      task.status === 'COMPLETED' && "opacity-70 grayscale-[0.3]"
    )}>
      {/* Status Sidebar Indicator (Visual only) */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        task.status === 'COMPLETED' ? "bg-green-500" : (task.priority === 'HIGH' ? "bg-red-500" : "bg-primary-500")
      )}></div>

      {/* Grid View Content */}
      {view === 'grid' && (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider", priorityColors[task.priority])}>
              {task.priority}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleToggleStatus}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  task.status === 'COMPLETED' ? "bg-green-50 hover:bg-green-100 text-green-600" : "bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                )}
                title={task.status === 'COMPLETED' ? "Mark as Pending" : "Mark as Done"}
              >
                <CheckCircle2 size={16} />
              </button>
              <button onClick={handleDelete} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <h3 className={cn("font-bold text-slate-900 dark:text-white leading-tight mb-2 truncate", task.status === 'COMPLETED' && "line-through text-slate-400")}>
            {task.title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-grow mb-4">
            {task.description || 'No description provided.'}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              {statusIcons[task.status] || <AlertCircle size={14} className="text-slate-300" />}
              {task.status.replace('_', ' ')}
            </div>
            {task.scheduled_at && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Clock size={10} />
                {new Date(task.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            )}
          </div>
        </>
      )}

      {/* List View Content */}
      {view === 'list' && (
        <>
          <button 
            onClick={handleToggleStatus}
            className={cn(
              "flex items-center justify-center p-2 rounded-xl transition-all",
              task.status === 'COMPLETED' ? "bg-green-100 text-green-600" : "bg-slate-50 dark:bg-slate-800 text-slate-300 hover:text-primary-500"
            )}
          >
            <CheckCircle2 size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className={cn("font-bold text-slate-900 dark:text-white truncate", task.status === 'COMPLETED' && "line-through text-slate-400")}>
              {task.title}
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate tracking-tight">{task.description}</p>
              {task.scheduled_at && (
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                  • {new Date(task.scheduled_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block", priorityColors[task.priority])}>
              {task.priority}
            </span>
            <button onClick={handleDelete} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-400 hover:text-red-600 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
