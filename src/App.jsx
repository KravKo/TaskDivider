import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

const TaskCalendar = () => {
  // Start from current month (December 2025 = month 0 in our system)
  const todayDate = new Date();
  const initialMonth = todayDate.getFullYear() === 2025 && todayDate.getMonth() === 11 ? 0 : 
                       todayDate.getFullYear() === 2026 ? todayDate.getMonth() + 1 : 0;
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  
  const people = ['Jenish', 'Ashis', 'Krishav', 'Prazwal', 'Madhav'];
  const tasks = ['Cook Morning', 'Wash Dishes Morning', 'Cook Evening', 'Wash Dishes Evening'];
  
  const months = [
    'December 2025', 'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026',
    'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'
  ];
  
  // Check if person can do a task
  const canDoTask = (person, task) => {
    if ((person === 'Jenish' || person === 'Ashis') && task === 'Cook Morning') {
      return false;
    }
    if (person === 'Krishav' && (task === 'Cook Morning' || task === 'Wash Dishes Morning')) {
      return false;
    }
    return true;
  };
  
  // Generate rotation for entire year following the pattern from Dec 27-28
  const generateYearRotation = () => {
    const rotation = [];
    
    // Day 0: December 27, 2025 (as specified)
    const dec27 = {
      'Jenish': 'Wash Dishes Morning',
      'Madhav': 'Cook Morning',
      'Krishav': 'Wash Dishes Evening',
      'Ashis': 'Cook Evening',
      'Prazwal': 'Rest'
    };
    rotation.push(dec27);
    
    // Day 1: December 28, 2025 (as specified)
    const dec28 = {
      'Prazwal': 'Cook Morning',
      'Ashis': 'Wash Dishes Morning',
      'Krishav': 'Cook Evening',
      'Jenish': 'Wash Dishes Evening',
      'Madhav': 'Rest'
    };
    rotation.push(dec28);
    
    // Now generate remaining days by rotating through people and tasks
    for (let day = 2; day < 397; day++) {
      const dayAssignments = {};
      const prevDay = rotation[day - 1];
      
      // Find who rested yesterday
      let prevRestPerson = null;
      for (const person of people) {
        if (prevDay[person] === 'Rest') {
          prevRestPerson = person;
          break;
        }
      }
      
      // Get the index of who rested yesterday and move to next person for rest
      const prevRestIndex = people.indexOf(prevRestPerson);
      const nextRestIndex = (prevRestIndex + 1) % 5;
      const restPerson = people[nextRestIndex];
      
      dayAssignments[restPerson] = 'Rest';
      
      // Now assign tasks to the 4 workers
      const workers = people.filter(p => p !== restPerson);
      const availableTasks = [...tasks];
      
      // For each worker, try to assign a task they can do and didn't do yesterday
      for (const person of workers) {
        let assigned = false;
        const prevTask = prevDay[person];
        
        // First try: find a task they can do and didn't do yesterday
        for (let i = 0; i < availableTasks.length; i++) {
          const task = availableTasks[i];
          if (canDoTask(person, task) && task !== prevTask) {
            dayAssignments[person] = task;
            availableTasks.splice(i, 1);
            assigned = true;
            break;
          }
        }
        
        // Second try: if no other option, assign any task they can do
        if (!assigned) {
          for (let i = 0; i < availableTasks.length; i++) {
            const task = availableTasks[i];
            if (canDoTask(person, task)) {
              dayAssignments[person] = task;
              availableTasks.splice(i, 1);
              assigned = true;
              break;
            }
          }
        }
      }
      
      rotation.push(dayAssignments);
    }
    
    return rotation;
  };
  
  const yearRotation = generateYearRotation();
  
  const getDaysInMonth = (month, year = 2025) => {
    // month 0 = Dec 2025, month 1-12 = Jan-Dec 2026
    if (month === 0) return new Date(2025, 12, 0).getDate(); // December 2025
    return new Date(2026, month, 0).getDate(); // 2026 months
  };
  
  const getFirstDayOfMonth = (month, year = 2025) => {
    if (month === 0) return new Date(2025, 11, 1).getDay(); // December 2025
    return new Date(2026, month - 1, 1).getDay(); // 2026 months
  };
  
  const getDayOfYear = (month, day) => {
    // Month 0 = December 2025, Month 1-12 = Jan-Dec 2026
    
    // If we're in December 2025 (month 0)
    if (month === 0) {
      // December 27, 2025 should map to day 0 in our rotation
      // December 28, 2025 should map to day 1 in our rotation
      return day - 27; // So day 27 becomes 0, day 28 becomes 1, etc.
    }
    
    // For 2026 months, we need to add the remaining December 2025 days
    // December has 31 days, we start from day 27, so we have days 27-31 = 5 days
    let dayOfYear = 31 - 27 + 1; // 5 days from Dec 27-31
    
    // Add days from Jan to current month of 2026
    const daysInMonths2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let m = 1; m < month; m++) {
      dayOfYear += daysInMonths2026[m - 1];
    }
    
    dayOfYear += day - 1;
    return dayOfYear;
  };
  
  const generateCalendar = () => {
    const days = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const calendar = [];
    
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null);
    }
    
    for (let day = 1; day <= days; day++) {
      calendar.push(day);
    }
    
    return calendar;
  };
  
  const [selectedDate, setSelectedDate] = useState(null);
  const calendar = generateCalendar();
  
  // Get today's date
  const isToday = (day) => {
    if (!day) return false;
    
    // Check if viewing Dec 2025
    if (currentMonth === 0) {
      return todayDate.getMonth() === 11 && todayDate.getFullYear() === 2025 && todayDate.getDate() === day;
    }
    
    // Check if viewing 2026 months
    return todayDate.getMonth() === currentMonth - 1 && todayDate.getFullYear() === 2026 && todayDate.getDate() === day;
  };
  
  const getPersonColor = (person) => {
    const colors = {
      'Jenish': 'bg-blue-500 text-white',
      'Ashis': 'bg-green-500 text-white',
      'Krishav': 'bg-purple-500 text-white',
      'Prazwal': 'bg-orange-500 text-white',
      'Madhav': 'bg-pink-500 text-white'
    };
    return colors[person];
  };
  
  const getTaskIcon = (task) => {
    if (task.includes('Cook')) return '🍳';
    if (task.includes('Wash')) return '🧼';
    return '😴';
  };
  
  const getTaskColor = (task) => {
    if (task.includes('Cook Morning')) return 'bg-amber-50 border-amber-200';
    if (task.includes('Cook Evening')) return 'bg-orange-50 border-orange-200';
    if (task.includes('Wash') && task.includes('Morning')) return 'bg-blue-50 border-blue-200';
    if (task.includes('Wash') && task.includes('Evening')) return 'bg-indigo-50 border-indigo-200';
    return 'bg-gray-50 border-gray-200';
  };
  
  const handleDateClick = (day) => {
    if (day) {
      setSelectedDate(day);
    }
  };
  
  const assignments = selectedDate ? yearRotation[getDayOfYear(currentMonth, selectedDate)] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
              Task Rotation
            </h1>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
              disabled={currentMonth === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              {months[currentMonth]}
            </h2>
            <button
              onClick={() => setCurrentMonth(Math.min(12, currentMonth + 1))}
              disabled={currentMonth === 12}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className="text-center font-semibold text-gray-600 text-xs sm:text-sm py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendar.map((day, idx) => (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                disabled={!day}
                className={`aspect-square rounded-lg flex items-center justify-center text-sm sm:text-base font-medium transition-all ${
                  day
                    ? selectedDate === day
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : isToday(day)
                      ? 'bg-green-500 text-white shadow-md ring-2 ring-green-300'
                      : 'bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:scale-105 active:scale-95'
                    : 'invisible'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Task Assignments */}
        {selectedDate && assignments && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              {months[currentMonth]} {selectedDate}
            </h3>
            
            <div className="space-y-3">
              {people.map(person => (
                <div 
                  key={person} 
                  className={`border-2 rounded-xl p-4 ${getTaskColor(assignments[person])}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getPersonColor(person)} shadow-sm`}>
                        {person}
                      </span>
                      <span className="text-2xl">{getTaskIcon(assignments[person])}</span>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-gray-700">
                      {assignments[person]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
          <div className="mt-4 pt-4 border-t">
            <h5 className="font-semibold text-gray-700 mb-2 text-sm">Tasks:</h5>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>🍳 Cook Morning</div>
              <div>🍳 Cook Evening</div>
              <div>🧼 Wash Dishes Morning</div>
              <div>🧼 Wash Dishes Evening</div>
            </div>
          </div>

         
        </div>
      </div>
       <div className='bg-white rounded-xl shadow-lg p-4 sm:p-6 mt-4 sm:mt-6 content-center flex items-center justify-center'>
            <h3 className="font-semibold text-red-700 "> Made by krishav koirala </h3>
          </div>
    </div>
  );
};

export default TaskCalendar;