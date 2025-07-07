import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const Calendar = ({ onDateSelect, user }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryDates, setDiaryDates] = useState([]);
  const [quote, setQuote] = useState('');

  const quotes = [
    "Today is the first day of the rest of your life.",
    "Every day is a new beginning, take a deep breath and start again.",
    "The secret of getting ahead is getting started.",
    "Life is what happens to you while you're busy making other plans.",
    "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    "The only way to do great work is to love what you do.",
    "Yesterday is history, tomorrow is a mystery, today is a gift.",
    "Be yourself; everyone else is already taken.",
    "Believe you can and you're halfway there.",
    "The journey of a thousand miles begins with one step."
  ];

  useEffect(() => {
    // Set random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    // Fetch diary dates
    fetchDiaryDates();
  }, []);

  const fetchDiaryDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/diary-dates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const dates = await response.json();
        setDiaryDates(dates);
      }
    } catch (error) {
      console.error('Error fetching diary dates:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    // Ensure consistent date formatting (YYYY-MM-DD)
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (year, month, day) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const isFutureDate = (year, month, day) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    // Set time to end of day for today to allow entries for today
    today.setHours(23, 59, 59, 999);
    return checkDate > today;
  };

  const hasDiaryEntry = (year, month, day) => {
    const dateStr = formatDate(year, month, day);
    return diaryDates.includes(dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (isFutureDate(year, month, day)) {
      return; // Don't allow future dates
    }
    
    const dateStr = formatDate(year, month, day);
    onDateSelect(dateStr);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-16 border border-gray-100"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(year, month, day);
      const isFuture = isFutureDate(year, month, day);
      const hasEntry = hasDiaryEntry(year, month, day);
      
      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-16 border border-gray-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative
            ${isFuture 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'hover:bg-blue-50 hover:scale-105'
            }
            ${isCurrentDay ? 'bg-blue-100 border-blue-300' : ''}
            ${hasEntry ? 'bg-emerald-50 border-emerald-200' : ''}
          `}
        >
          <span className={`
            text-sm font-medium
            ${isCurrentDay ? 'text-blue-800' : ''}
            ${hasEntry && !isCurrentDay ? 'text-emerald-800' : ''}
            ${isFuture ? 'text-gray-400' : 'text-gray-700'}
          `}>
            {day}
          </span>
          {hasEntry && (
            <BookOpen className="h-3 w-3 text-emerald-600 mt-1" />
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <h2 className="text-2xl font-bold">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(dayName => (
            <div key={dayName} className="p-4 text-center font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {days}
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-center">
                <BookOpen className="h-2 w-2 text-emerald-600" />
              </div>
              <span className="text-gray-600">Has Entry</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, <span className="text-primary-600">{user?.fullName}</span>
          </h1>
          
          {/* Daily Quote */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto shadow-lg border border-blue-200">
            <blockquote className="text-lg italic text-gray-700 leading-relaxed">
              "{quote}"
            </blockquote>
          </div>
        </div>

        {/* Calendar */}
        <div className="mb-8">
          {renderCalendar()}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600">
          <p className="text-lg">
            Click on any date to view or create your diary entry for that day.
          </p>
          <p className="text-sm mt-2 text-gray-500">
            Future dates are not available for diary entries.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;