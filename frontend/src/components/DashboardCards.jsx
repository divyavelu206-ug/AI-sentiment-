import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Award, ShieldCheck, AlertCircle } from 'lucide-react';

export default function DashboardCards({ summary }) {
  if (!summary) return null;

  const {
    total = 0,
    positive_count = 0,
    positive_pct = 0,
    negative_count = 0,
    negative_pct = 0,
    neutral_count = 0,
    neutral_pct = 0,
    overall_sentiment = 'Neutral',
    avg_confidence = 0,
    high_negative_alert = false
  } = summary;

  const getSentimentBadge = (sent) => {
    switch (sent) {
      case 'Positive':
        return 'bg-emerald-500 text-white';
      case 'Negative':
        return 'bg-rose-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const cards = [
    {
      title: 'Total Feedback',
      value: total,
      subtext: 'Entries analyzed',
      icon: MessageSquare,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Positive Feedback',
      value: positive_count,
      subtext: `${positive_pct}% of total`,
      icon: ThumbsUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Negative Feedback',
      value: negative_count,
      subtext: `${negative_pct}% of total`,
      icon: ThumbsDown,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/50',
      borderColor: 'border-rose-200 dark:border-rose-800'
    },
    {
      title: 'Neutral Feedback',
      value: neutral_count,
      subtext: `${neutral_pct}% of total`,
      icon: Minus,
      color: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700'
    },
    {
      title: 'Overall Sentiment',
      value: overall_sentiment,
      isBadge: true,
      subtext: 'Dominant classification',
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      title: 'Average Confidence',
      value: `${avg_confidence}%`,
      subtext: 'Model prediction accuracy',
      icon: ShieldCheck,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Critical High-Negative Warning Alert */}
      {high_negative_alert && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100 flex items-start space-x-3 shadow-sm animate-glow">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">High Negative Feedback Alert Detected!</h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
              A significant amount of negative feedback ({negative_pct}%) was detected. Consider reviewing responses in the <span className="font-bold underline cursor-pointer">Needs Attention</span> section.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${card.borderColor} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>

              <div>
                {card.isBadge ? (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getSentimentBadge(card.value)}`}>
                    {card.value}
                  </span>
                ) : (
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </div>
                )}
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
