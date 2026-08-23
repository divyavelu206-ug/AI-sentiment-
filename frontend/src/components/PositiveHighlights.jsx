import React from 'react';
import { Sparkles, ThumbsUp, Star } from 'lucide-react';

export default function PositiveHighlights({ results }) {
  if (!results) return null;

  const allPositiveItems = results.filter(item => item.sentiment === 'Positive');
  const positiveItems = allPositiveItems
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-emerald-200 dark:border-emerald-950/80">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Positive Highlights
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {allPositiveItems.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Showing top {positiveItems.length} highest confidence positive predictions
          </p>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {positiveItems.length > 0 ? (
          positiveItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
                  "{item.text}"
                </p>
                <Star className="w-4 h-4 text-emerald-500 fill-emerald-500 shrink-0" />
              </div>
              
              <div className="flex items-center justify-between text-[11px] font-semibold border-t border-emerald-200/50 dark:border-emerald-900/40 pt-2">
                <span className="flex items-center text-emerald-700 dark:text-emerald-300">
                  <ThumbsUp className="w-3.5 h-3.5 mr-1" />
                  Positive
                </span>
                <span className="text-emerald-800 dark:text-emerald-400">
                  Confidence: <span className="font-bold">{item.confidence}%</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No positive feedback entries found in current analysis.
          </div>
        )}
      </div>

    </div>
  );
}
