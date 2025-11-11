import React, { useState, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';

const Calendar = ({ goalDate }) => {
  const today = new Date();
  const endDate = new Date(goalDate);

  const timeDiff = endDate - today;
  const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  const dates = [];
  let current = new Date(today);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  // Load saved drawings from localStorage
  const savedDrawings = JSON.parse(localStorage.getItem('drawings') || '{}');
  const [drawings, setDrawings] = useState(savedDrawings);
  const [resetKeys, setResetKeys] = useState({});

  useEffect(() => {
    localStorage.setItem('drawings', JSON.stringify(drawings));
  }, [drawings]);

  const saveDrawing = (dateStr, dataURL) => {
    setDrawings((prev) => {
      const newDrawings = { ...prev, [dateStr]: dataURL };
      localStorage.setItem('drawings', JSON.stringify(newDrawings));
      return newDrawings;
    });
  };

  const retryDrawing = (dateStr) => {
    setDrawings((prev) => ({ ...prev, [dateStr]: null }));
    setResetKeys((prev) => ({
      ...prev,
      [dateStr]: prev[dateStr] ? prev[dateStr] + 1 : 1,
    }));
  };

  const todayStr = today.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isToday = (date) => date.toDateString() === today.toDateString();

  return (
    <div className="mt-6 border border-gray-300 rounded-lg max-w-4xl p-4 bg-gray-50">
      {/* Title */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">Goal Calendar</h2>
        <p className="text-gray-700">
          Today: <span className="font-semibold">{todayStr}</span> | Remaining days:{' '}
          <span className="font-semibold">{remainingDays}</span>
        </p>
      </div>

      {/* Calendar weeks */}
      {weeks.map((week, idx) => (
        <div key={idx} className="grid grid-cols-7 gap-2 mb-2">
          {week.map((date) => {
            const dateStr = date.toDateString();
            return (
              <div
                key={dateStr}
                className={`relative border h-40 w-40 bg-white flex flex-col justify-between items-center p-2 ${
                  isToday(date) ? 'bg-yellow-200 border-yellow-400' : ''
                }`}
              >
                {/* Date number */}
                <span className="absolute top-1 left-2 text-sm text-gray-800 font-semibold z-10">
                  {date.getDate()}
                </span>

                {/* Canvas */}
                <div className="flex-1 w-full flex items-center justify-center relative mt-4 mb-2">
                  <DrawingCanvas
                    width={150}   // big canvas
                    height={150}
                    savedData={drawings[dateStr]}
                    onSave={(dataURL) => saveDrawing(dateStr, dataURL)}
                    resetKey={resetKeys[dateStr]}
                  />
                </div>

                {/* Retry button */}
                <button
                  onClick={() => retryDrawing(dateStr)}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 z-10"
                >
                  Retry
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
