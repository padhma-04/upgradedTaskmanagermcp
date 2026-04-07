import React, { useState } from 'react';
import api from '../services/api';
import { Send, Sparkles, Loader2 } from 'lucide-react';

const AITaskInput = ({ onTaskCreated }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await api.post('/mcp/ai/create/', { text });
      setText('');
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      console.error('Error creating AI task:', error);
      alert('Failed to process task with AI. Check API key and logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-1.5 shadow-xl shadow-slate-200/40 dark:shadow-none focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-none p-3 text-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
          <Sparkles size={20} />
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Try 'Submit project report by tomorrow high priority'..."
          disabled={loading}
          className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium px-2 py-3"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className={`
            flex items-center justify-center p-3 rounded-2xl transition-all
            ${loading || !text.trim() 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600' 
              : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 active:scale-95'}
          `}
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default AITaskInput;
