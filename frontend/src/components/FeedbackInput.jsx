import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Cpu, ListCheck } from 'lucide-react';

export default function FeedbackInput({ onAnalyze, loading }) {
  const [entries, setEntries] = useState([
    "The food quality in the canteen was excellent today!",
    "The service at the library desk was extremely slow and unhelpful.",
    "The classroom temperature was okay, but the seats are decent."
  ]);

  const handleAddEntry = () => {
    setEntries([...entries, '']);
  };

  const handleUpdateEntry = (index, value) => {
    const updated = [...entries];
    updated[index] = value;
    setEntries(updated);
  };

  const handleRemoveEntry = (index) => {
    if (entries.length === 1) {
      setEntries(['']);
    } else {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  const handleClearAll = () => {
    setEntries(['']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEntries = entries.map(e => e.trim()).filter(Boolean);
    if (validEntries.length === 0) return;
    onAnalyze(validEntries);
  };

  const validCount = entries.filter(e => e.trim().length > 0).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <ListCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manual Feedback Input</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enter one or more feedback statements for AI analysis</p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {validCount} {validCount === 1 ? 'Entry' : 'Entries'}
          </span>
          <button
            onClick={handleClearAll}
            type="button"
            className="p-1.5 text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
            title="Clear all entries"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Input List */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {entries.map((entry, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <span className="mt-3 text-xs font-bold text-slate-400 w-5 text-right">{idx + 1}.</span>
            <div className="flex-1">
              <input
                type="text"
                value={entry}
                onChange={(e) => handleUpdateEntry(idx, e.target.value)}
                placeholder="Enter feedback statement (e.g. 'Staff was friendly and helpful')"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveEntry(idx)}
              className="mt-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              title="Remove entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Action Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          
          <button
            type="button"
            onClick={handleAddEntry}
            className="px-4 py-2 rounded-xl text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>

          <button
            type="submit"
            disabled={validCount === 0 || loading}
            className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Cpu className="w-4 h-4" />
            <span>{loading ? 'Analyzing with AI...' : `Analyze ${validCount} Entries`}</span>
          </button>

        </div>
      </form>
    </div>
  );
}
