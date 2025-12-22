import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import SetRow from './SetRow';

const ExerciseForm = ({ exercise, exerciseNumber, onChange, onRemove }) => {
  const handleNameChange = (e) => {
    onChange({ ...exercise, name: e.target.value });
  };

  const handleNotesChange = (e) => {
    onChange({ ...exercise, notes: e.target.value });
  };

  const handleAddSet = () => {
    const newSet = {
      id: uuidv4(),
      exerciseId: exercise.id,
      setNumber: exercise.sets.length + 1,
      reps: 0,
      weight: 0,
      completed: true,
      order: exercise.sets.length
    };
    onChange({
      ...exercise,
      sets: [...exercise.sets, newSet]
    });
  };

  const handleSetChange = (setId, updatedSet) => {
    onChange({
      ...exercise,
      sets: exercise.sets.map(s => s.id === setId ? updatedSet : s)
    });
  };

  const handleRemoveSet = (setId) => {
    const updatedSets = exercise.sets.filter(s => s.id !== setId);
    // Renumber sets
    const renumberedSets = updatedSets.map((s, index) => ({
      ...s,
      setNumber: index + 1,
      order: index
    }));
    onChange({
      ...exercise,
      sets: renumberedSets
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* Exercise Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">
              {exerciseNumber}
            </span>
            <input
              type="text"
              value={exercise.name}
              onChange={handleNameChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Exercise name (e.g., Bench Press)"
              required
            />
          </div>
        </div>
        <button
          onClick={onRemove}
          className="ml-2 text-red-600 hover:text-red-800 p-2"
          title="Remove exercise"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Sets */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Sets</h4>
          <button
            onClick={handleAddSet}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Set
          </button>
        </div>

        {exercise.sets.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <p className="text-sm text-gray-500">No sets yet. Click "Add Set" to begin.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-2 px-2 text-xs font-medium text-gray-500">
              <div className="col-span-1">Set</div>
              <div className="col-span-4">Reps</div>
              <div className="col-span-5">Weight (lbs)</div>
              <div className="col-span-2"></div>
            </div>

            {/* Set Rows */}
            {exercise.sets.map((set) => (
              <SetRow
                key={set.id}
                set={set}
                onChange={(updated) => handleSetChange(set.id, updated)}
                onRemove={() => handleRemoveSet(set.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exercise Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Exercise Notes (Optional)
        </label>
        <input
          type="text"
          value={exercise.notes}
          onChange={handleNotesChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Focused on form, felt strong"
        />
      </div>
    </div>
  );
};

export default ExerciseForm;
