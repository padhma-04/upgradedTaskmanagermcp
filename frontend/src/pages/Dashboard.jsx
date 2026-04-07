import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import AITaskInput from '../components/AITaskInput';
import MiniCalendar from '../components/MiniCalendar';
import NewTaskModal from '../components/NewTaskModal';
import { LayoutGrid, List, Plus, Sparkles, RefreshCw, CheckSquare, Calendar as CalendarIcon, X } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [summary, setSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const response = await api.post('/mcp/ai/summarize/');
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error summarizing tasks:', error);
    } finally {
      setSummarizing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (!selectedDate) return true;
    const taskDate = new Date(task.scheduled_at);
    return taskDate.getDate() === selectedDate.getDate() &&
           taskDate.getMonth() === selectedDate.getMonth() &&
           taskDate.getFullYear() === selectedDate.getFullYear();
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto px-4 lg:px-8">
      {/* Main Content Area (Tasks) */}
      <div className="flex-1 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Workspace</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {selectedDate 
                ? `Tasks for ${selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}` 
                : 'Manage your active tasks and projects'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all border border-slate-200 dark:border-slate-700"
              >
                <X size={14} />
                Clear Date
              </button>
            )}
            <button 
              onClick={fetchTasks}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center shadow-inner">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
              >
                <List size={18} />
              </button>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>
        </div>

        {/* AI Task Input */}
        <AITaskInput onTaskCreated={fetchTasks} />

        {/* AI Summary Section */}
        {tasks.length > 0 && !selectedDate && (
          <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-200 dark:shadow-none transition-all hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-primary-200" />
                <h2 className="text-lg font-bold">AI Workspace Insights</h2>
              </div>
              <button 
                onClick={handleSummarize}
                disabled={summarizing}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
              >
                {summarizing ? 'Analyzing...' : 'Generate Summary'}
              </button>
            </div>
            {summary ? (
              <p className="text-primary-50 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                {summary}
              </p>
            ) : (
              <p className="text-primary-100/70 text-sm">
                Click generate for a smart summary of your current tasks and priorities.
              </p>
            )}
          </div>
        )}

        {/* Task Grid/List */}
        <div className="pb-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                {selectedDate ? <CalendarIcon className="text-slate-300 dark:text-slate-600" size={32} /> : <CheckSquare className="text-slate-300 dark:text-slate-600" size={32} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedDate ? 'No tasks for this day' : 'All caught up!'}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {selectedDate ? 'Try selecting another date or create a task for this day.' : 'No tasks found. Use the AI input to create some.'}
              </p>
            </div>
          ) : (
            <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} view={view} onUpdate={fetchTasks} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Side Content Area (Calendar) */}
      <aside className="w-full lg:w-[320px] xl:w-[350px] shrink-0 sticky top-[65px] h-fit">
        <MiniCalendar tasks={tasks} onDateSelect={setSelectedDate} />
      </aside>

      {/* Modals */}
      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={fetchTasks} 
      />
    </div>
  );
};

export default Dashboard;
