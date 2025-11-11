import React, { useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ goalDate }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(goalDate);

  const savedDrawings = JSON.parse(localStorage.getItem('drawings') || '{}');
  const [drawings, setDrawings] = useState(savedDrawings);
  const [resetKeys, setResetKeys] = useState({});
  const [unlocked, setUnlocked] = useState({}); // Track unlocked past days

  useEffect(() => {
    localStorage.setItem('drawings', JSON.stringify(drawings));
  }, [drawings]);

  const saveDrawing = (dateStr, dataURL) => {
    setDrawings((prev) => ({ ...prev, [dateStr]: dataURL }));
  };

  const retryDrawing = (dateStr) => {
    setDrawings((prev) => ({ ...prev, [dateStr]: null }));
    setResetKeys((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr] ? prev[dateStr] + 1 : 1,
    }));
    setUnlocked((prev) => ({ ...prev, [dateStr]: true })); // Unlock for drawing
  };

  const editDrawing = (dateStr) => {
    setUnlocked((prev) => ({ ...prev, [dateStr]: true })); // Unlock without clearing
  };

  const generateMonthlyCalendar = () => {
    let current = new Date(today);
    const months = {};

    while (current <= endDate) {
      const monthKey = current.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!months[monthKey]) months[monthKey] = [];
      months[monthKey].push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return months;
  };

  const months = generateMonthlyCalendar();

  const todayStr = today.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="mt-6 p-2 sm:p-4 max-w-full bg-gray-50">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Goal Calendar</h2>
        <p className="text-gray-700">
          Today: <span className="font-semibold">{todayStr}</span> | Remaining days:{' '}
          <span className="font-semibold">{remainingDays}</span>
        </p>
      </div>

      {Object.keys(months).map((month) => {
        const monthDates = months[month];

        const weeks = [];
        let week = [];
        const firstDay = monthDates[0].getDay();
        for (let i = 0; i < firstDay; i++) week.push(null);
        monthDates.forEach((date) => {
          week.push(date);
          if (week.length === 7) {
            weeks.push(week);
            week = [];
          }
        });
        if (week.length > 0) {
          while (week.length < 7) week.push(null);
          weeks.push(week);
        }

        return (
          <div key={month} className="mb-8">
            <h3 className="text-xl font-bold mb-2">{month}</h3>

            <div className="overflow-x-auto">
              {/* Day Names */}
              <div
                className="grid grid-cols-7"
                style={{ gridTemplateColumns: 'repeat(7, 200px)' }}
              >
                {dayNames.map((day, idx) => (
                  <div
                    key={idx}
                    className="h-8 border-b border-gray-300 flex items-center justify-center font-semibold"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div
                className="grid gap-2 mt-1"
                style={{ gridTemplateColumns: 'repeat(7, 200px)', gridAutoRows: '260px' }}
              >
                {weeks.flat().map((date, idx) => {
                  if (!date)
                    return (
                      <div
                        key={idx}
                        className="bg-gray-200 rounded-lg w-[200px] h-[260px]"
                      ></div>
                    );

                  const dateStr = date.toDateString();
                  const isToday = date.toDateString() === today.toDateString();
                  const isPastDate = date < today;
                  const isUnlocked = unlocked[dateStr] || !isPastDate;

                  return (
                    <div
                      key={dateStr}
                      className={`relative border rounded-lg w-[200px] h-[260px] flex flex-col
                        ${isToday ? 'bg-green-100' : isPastDate ? 'bg-gray-100' : 'bg-green-50'}
                      `}
                    >
                      {/* Date */}
                      <span
                        className={`absolute top-1 left-2 text-sm font-semibold z-10 ${
                          isToday
                            ? 'text-green-600'
                            : isPastDate
                            ? 'text-gray-400'
                            : 'text-gray-800'
                        }`}
                      >
                        {date.getDate()}
                      </span>

                      {/* Canvas */}
                      <div className="flex-1 mt-4 mb-4 w-full flex items-center justify-center">
                        <div className="border border-gray-400 w-[180px] h-[180px] rounded-md flex items-center justify-center">
                          <DrawingCanvas
                            savedData={drawings[dateStr]}
                            onSave={(dataURL) => saveDrawing(dateStr, dataURL)}
                            resetKey={resetKeys[dateStr]}
                            disabled={!isUnlocked} // disable if locked
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex justify-center gap-2 pb-2">
                        {isPastDate && !isUnlocked && drawings[dateStr] && (
                          <button
                            onClick={() => editDrawing(dateStr)}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => retryDrawing(dateStr)}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Calendar;
