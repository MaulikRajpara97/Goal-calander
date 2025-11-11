import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';

const App = () => {
  const [goalDate, setGoalDate] = useState('');
  const [tempDate, setTempDate] = useState('');

  useEffect(() => {
    const savedGoal = localStorage.getItem('goalDate');
    if (savedGoal) setGoalDate(savedGoal);
  }, []);

  const confirmGoal = () => {
    if (!tempDate) return;
    setGoalDate(tempDate);
    localStorage.setItem('goalDate', tempDate);
  };

  const resetGoal = () => {
    setGoalDate('');
    setTempDate('');
    localStorage.removeItem('goalDate');
    localStorage.removeItem('drawings');
  };

  // Export goal and drawings as JSON
  const exportData = () => {
    const data = {
      goalDate: localStorage.getItem('goalDate'),
      drawings: JSON.parse(localStorage.getItem('drawings') || '{}'),
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'goal_calendar.json';
    a.click();
  };

  // Import JSON file
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.goalDate) localStorage.setItem('goalDate', data.goalDate);
        if (data.drawings) localStorage.setItem('drawings', JSON.stringify(data.drawings));
        window.location.reload();
      } catch (err) {
        alert('Invalid file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-100 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Goal Calendar</h1>

      {!goalDate ? (
        <div className="flex flex-col items-center gap-2">
          <label className="text-lg" htmlFor="goalDate">
            Select your goal date:
          </label>
          <input
            type="date"
            id="goalDate"
            value={tempDate}
            onChange={(e) => setTempDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={confirmGoal}
            disabled={!tempDate}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Confirm Goal
          </button>
        </div>
      ) : (
        <>
          <Calendar goalDate={goalDate} />

          <div className="mt-4 flex gap-2">
            <button
              onClick={resetGoal}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset Goal
            </button>

            <button
              onClick={exportData}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Export
            </button>

            <label className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
              Import
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
