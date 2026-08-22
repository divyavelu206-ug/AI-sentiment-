import React from 'react';
import { Sparkles, UploadCloud, PlayCircle, Edit3, Cpu, PieChart, Download, ShieldCheck } from 'lucide-react';

export default function Hero({ onAnalyzeClick, onUploadClick, onLoadDemoData, loading }) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
      
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-30 dark:opacity-20 blur-3xl -z-10">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl animate-glow"></div>
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl animate-glow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          FeedSense <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="mt-3 text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400">
          "Turn Feedback into Actionable Insights"
        </p>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Analyze large volumes of feedback using AI and transform opinions into meaningful insights. Designed for colleges, institutions, and businesses.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          
          <button
            onClick={onAnalyzeClick}
            className="px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <Edit3 className="w-5 h-5" />
            <span>Analyze Feedback</span>
          </button>

          <button
            onClick={onUploadClick}
            className="px-6 py-3.5 rounded-xl font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 border border-slate-300 dark:border-slate-700 shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <UploadCloud className="w-5 h-5 text-indigo-500" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={onLoadDemoData}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 disabled:opacity-50"
          >
            <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{loading ? 'Processing...' : 'Load Demo Data'}</span>
          </button>

        </div>

        {/* How It Works Section */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How It Works</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">End-to-end intelligent feedback processing pipeline</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto text-left">
            {[
              { step: '1', title: 'Enter or Upload', desc: 'Paste text manually or drag and drop a bulk CSV file.', icon: Edit3, color: 'text-blue-500' },
              { step: '2', title: 'AI Analysis', desc: 'Pre-trained NLP model evaluates context & sentiment.', icon: Cpu, color: 'text-purple-500' },
              { step: '3', title: 'Sentiment Classify', desc: 'Categorizes into Positive, Negative, or Neutral with confidence.', icon: ShieldCheck, color: 'text-emerald-500' },
              { step: '4', title: 'Dashboard Insights', desc: 'Generates interactive charts, metrics & topic trends.', icon: PieChart, color: 'text-amber-500' },
              { step: '5', title: 'Export Results', desc: 'Download structured CSV data or executive PDF report.', icon: Download, color: 'text-indigo-500' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-4 rounded-xl glass-card relative group hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center text-slate-700 dark:text-slate-300">
                      {item.step}
                    </span>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
