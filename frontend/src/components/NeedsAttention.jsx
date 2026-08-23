import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Search, XCircle, HelpCircle } from 'lucide-react';

export default function NeedsAttention({ results, summary }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!results) return null;

  // Filter ONLY negative feedback items
  const attentionItems = results.filter(item => {
    const isNegative = item.sentiment === 'Negative';
    const matchesSearch = searchQuery ? item.text.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return isNegative && matchesSearch;
  });

  const highNegativeAlert = summary?.high_negative_alert;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-rose-200 dark:border-rose-950/80">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Needs Attention
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                {attentionItems.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Isolates negative feedback requiring administrative action
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search negative feedback..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Dynamic Warning Alert */}
      {highNegativeAlert && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">High Risk Warning:</span> A significant amount of negative feedback ({summary?.negative_pct}%) was detected. Consider reviewing these responses and prioritizing action items.
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {attentionItems.length > 0 ? (
          attentionItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-900 transition-all flex flex-col justify-between"
            >
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                "{item.text}"
              </p>
              
              <div className="flex items-center justify-between text-[11px] font-semibold border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                <div className="flex items-center space-x-2">
                  <span className={`flex items-center ${
                    item.sentiment === 'Negative' 
                      ? 'text-rose-600 dark:text-rose-400' 
                      : item.sentiment === 'Positive'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {item.sentiment === 'Negative' ? (
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                    ) : item.sentiment === 'Positive' ? (
                      <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    ) : (
                      <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    )}
                    {item.sentiment}
                  </span>
                  {item.sentiment !== 'Negative' && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                      Low Confidence
                    </span>
                  )}
                </div>
                <span className="text-slate-500 dark:text-slate-400">
                  Confidence: <span className="font-bold text-slate-700 dark:text-slate-300">{item.confidence}%</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            ✅ No negative or low-confidence feedback detected requiring immediate attention!
          </div>
        )}
      </div>

    </div>
  );
}
