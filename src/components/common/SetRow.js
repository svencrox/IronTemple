import React from 'react';

const SetRow = ({ set, onChange, onRemove }) => {
  const handleChange = (field, value) => {
    onChange({
      ...set,
      [field]: field === 'completed' ? value : Number(value)
    });
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center bg-white p-2 rounded border border-gray-200">
      {/* Set Number */}
      <div className="col-span-1">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
          {set.setNumber}
        </span>
      </div>

      {/* Reps Input */}
      <div className="col-span-4">
        <input
          type="number"
          min="0"
          value={set.reps}
          onChange={(e) => handleChange('reps', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
          required
        />
      </div>

      {/* Weight Input */}
      <div className="col-span-5">
        <input
          type="number"
          min="0"
          step="0.5"
          value={set.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
          required
        />
      </div>

      {/* Completed Checkbox & Delete Button */}
      <div className="col-span-2 flex items-center gap-1 justify-end">
        <input
          type="checkbox"
          checked={set.completed}
          onChange={(e) => handleChange('completed', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          title="Mark as completed"
        />
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 p-1"
          title="Remove set"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SetRow;
