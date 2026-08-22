import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

export default function ChartsSection({ summary }) {
  if (!summary) return null;

  const pieData = [
    { name: 'Positive', value: summary.positive_count || 0, color: '#10b981' },
    { name: 'Negative', value: summary.negative_count || 0, color: '#f43f5e' },
    { name: 'Neutral', value: summary.neutral_count || 0, color: '#64748b' }
  ];

  const barData = [
    { name: 'Positive', count: summary.positive_count || 0, fill: '#10b981' },
    { name: 'Negative', count: summary.negative_count || 0, fill: '#f43f5e' },
    { name: 'Neutral', count: summary.neutral_count || 0, fill: '#64748b' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-slate-700">
          <p className="font-bold">{data.name}</p>
          <p className="text-slate-300">Count: {data.value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1 - Doughnut Distribution */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Chart 1 – Sentiment Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Proportion of Positive, Negative, and Neutral responses</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2 - Sentiment Count Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Chart 2 – Sentiment Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Comparative count of analyzed feedback entries</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
