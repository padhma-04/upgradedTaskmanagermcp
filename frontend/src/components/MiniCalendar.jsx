import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MiniCalendar = ({ tasks = [], onDateSelect }) => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  // Function to check if a date has tasks
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.scheduled_at) return false;
      const taskDate = new Date(task.scheduled_at);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-1 h-1 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-bold">
        <CalendarIcon size={20} className="text-primary-600" />
        <h2>Schedule</h2>
      </div>

      <div className="custom-calendar-wrapper">
        <Calendar
          onChange={handleDateChange}
          value={date}
          nextLabel={<ChevronRight size={18} />}
          prevLabel={<ChevronLeft size={18} />}
          next2Label={null}
          prev2Label={null}
          tileContent={tileContent}
          className="border-none bg-transparent w-full font-sans"
        />
      </div>

      <style jsx>{`
        .custom-calendar-wrapper :global(.react-calendar) {
          border: none;
          background: transparent;
          width: 100%;
        }
        .custom-calendar-wrapper :global(.react-calendar__navigation) {
          margin-bottom: 20px;
        }
        .custom-calendar-wrapper :global(.react-calendar__month-view__weekdays) {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.65rem;
          color: #94a3b8;
        }
        .custom-calendar-wrapper :global(.react-calendar__tile) {
          padding: 12px 0;
          border-radius: 12px;
          font-size: 0.875rem;
          color: #64748b;
          transition: all 0.2s;
        }
        .dark .custom-calendar-wrapper :global(.react-calendar__tile) {
          color: #94a3b8;
        }
        .custom-calendar-wrapper :global(.react-calendar__tile:enabled:hover),
        .custom-calendar-wrapper :global(.react-calendar__tile:enabled:focus) {
          background-color: #f1f5f9;
          color: #0f172a;
        }
        .dark .custom-calendar-wrapper :global(.react-calendar__tile:enabled:hover) {
          background-color: #1e293b;
          color: #f8fafc;
        }
        .custom-calendar-wrapper :global(.react-calendar__tile--now) {
          background: #f8fafc !important;
          color: #2563eb !important;
          font-weight: 700;
          border: 1px solid #e2e8f0;
        }
        .dark .custom-calendar-wrapper :global(.react-calendar__tile--now) {
          background: #1e293b !important;
          color: #60a5fa !important;
          border-color: #334155;
        }
        .custom-calendar-wrapper :global(.react-calendar__tile--active) {
          background: #2563eb !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }
        .custom-calendar-wrapper :global(.react-calendar__navigation button:enabled:hover),
        .custom-calendar-wrapper :global(.react-calendar__navigation button:enabled:focus) {
          background-color: #f8fafc;
        }
        .dark .custom-calendar-wrapper :global(.react-calendar__navigation button:enabled:hover) {
          background-color: #1e293b;
        }
      `}</style>
    </div>
  );
};

export default MiniCalendar;
