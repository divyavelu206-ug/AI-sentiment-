import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeedbackInput from './components/FeedbackInput';
import CSVUpload from './components/CSVUpload';
import DashboardCards from './components/DashboardCards';
import ChartsSection from './components/ChartsSection';
import ResultsTable from './components/ResultsTable';
import NeedsAttention from './components/NeedsAttention';
import PositiveHighlights from './components/PositiveHighlights';
import AIInsights from './components/AIInsights';
import ExportSection from './components/ExportSection';
import LoginPage from './components/LoginPage';

import { checkHealth, analyzeFeedback, analyzeCSV } from './services/api';
import { Loader2, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  // Persistent Dark Mode Theme State
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('feedsense_theme');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // User Auth State - defaults to null requiring Login
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('login'); // 'login' | 'home' | 'input' | 'dashboard' | 'results'
  const [inputTab, setInputTab] = useState('manual'); // 'manual' | 'csv'
  const [analysisData, setAnalysisData] = useState(null);
  const [activeSearch, setActiveSearch] = useState('');

  // Check Backend Health on mount & poll periodically
  useEffect(() => {
    const verifyBackend = async () => {
      try {
        await checkHealth();
        setBackendOnline(true);
      } catch (err) {
        setBackendOnline(false);
      }
    };
    verifyBackend();
    const interval = setInterval(verifyBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update document dark mode class & save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('feedsense_theme', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save theme setting:', e);
    }
  }, [darkMode]);

  const showToast = (msg, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}! Access granted to FeedSense AI.`);
    setActiveSection('home');
  };

  const handleLogout = () => {
    setUser(null);
    showToast('Signed out successfully.');
    setActiveSection('login');
  };

  // Run Manual Analysis
  const handleAnalyzeManual = async (feedbackList) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await analyzeFeedback(feedbackList);
      setAnalysisData(data);
      showToast('Analysis completed successfully!');
      setActiveSection('dashboard');
    } catch (err) {
      showToast(err.message || 'Analysis failed. Please check backend connection.', false);
    } finally {
      setLoading(false);
    }
  };

  // Run CSV Upload Analysis
  const handleAnalyzeCSV = async (file) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await analyzeCSV(file);
      setAnalysisData(data);
      showToast(`Successfully analyzed ${data.summary?.total || 0} feedback entries from CSV!`);
      setActiveSection('dashboard');
    } catch (err) {
      showToast(err.message || 'Failed to process CSV file.', false);
    } finally {
      setLoading(false);
    }
  };

  // Load Demo Data
  const handleLoadDemoData = async () => {
    const demoItems = [
      "The food quality in the canteen was excellent today!",
      "The service at the library desk was extremely slow and unhelpful.",
      "The classroom temperature was okay, but the seats are decent.",
      "Staff members were super friendly and helped me resolve my fee registration quickly.",
      "Hostel rooms are dirty, overcrowded, and the plumbing is broken!",
      "The guest lecture on Artificial Intelligence was super inspiring and informative.",
      "Wifi network keeps disconnecting every 5 minutes in the lab.",
      "The annual cultural fest was organized well and had great music.",
      "The food was cold, tasteless, and overpriced.",
      "I had a neutral experience during the online portal enrollment.",
      "Professors are very approachable and always clear our doubts after class.",
      "The elevator is out of order again for the third time this week.",
      "The new library books collection is amazing!",
      "Bus transport service arrives on time most days.",
      "Air conditioning in the main auditorium is way too loud.",
      "Cleanliness around the campus gardens has improved significantly.",
      "The lab assistant didn't explain the experiment properly at all.",
      "Breakfast options in the mess are acceptable but could use more variety.",
      "Projectors in Block B classrooms are old and blurry.",
      "Customer support resolved my queries within two hours. Great job!",
      "The parking area is congested and poorly managed.",
      "Sports complex facilities are top notch and well maintained.",
      "Cafeteria coffee is really good and affordable.",
      "Exam schedule was released at the very last minute with no buffer days.",
      "Overall campus environment is vibrant and welcoming."
    ];

    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await analyzeFeedback(demoItems);
      setAnalysisData(data);
      showToast('Loaded demo dataset (25 entries) into AI Sentiment Engine!');
      setActiveSection('dashboard');
    } catch (err) {
      showToast('Backend offline. Please start Flask backend to run demo data.', false);
    } finally {
      setLoading(false);
    }
  };

  // Topic click filter
  const handleTopicClick = (topicName) => {
    setActiveSearch(topicName);
    setActiveSection('results');
  };

  // Render Login Screen if user is not authenticated or explicitly viewing login
  if (!user || activeSection === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center space-x-3 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-600 text-white shadow-xl flex items-center space-x-3 text-xs font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Header */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        backendOnline={backendOnline}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Container - Renders only the active standalone page section */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Loading Overlay Spinner */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center shadow-2xl animate-pulse max-w-sm w-full mx-4">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Analyzing feedback with AI...</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Evaluating NLP context, sentiment polarities, and common topics.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 1: HOME (HERO) */}
        {activeSection === 'home' && (
          <div className="space-y-6">
            <Hero
              onAnalyzeClick={() => {
                setInputTab('manual');
                setActiveSection('input');
              }}
              onUploadClick={() => {
                setInputTab('csv');
                setActiveSection('input');
              }}
              onLoadDemoData={handleLoadDemoData}
              loading={loading}
            />
          </div>
        )}

        {/* PAGE 2: ANALYZE FEEDBACK (INPUT STUDIO) */}
        {activeSection === 'input' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Feedback Analysis Studio
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose your input method below to process feedback with the NLP engine.
                </p>
              </div>

              {/* Input Method Toggle Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-sm">
                <button
                  onClick={() => setInputTab('manual')}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    inputTab === 'manual'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={() => setInputTab('csv')}
                  className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                    inputTab === 'csv'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Bulk CSV Upload
                </button>
              </div>
            </div>

            <div className="pt-4">
              {inputTab === 'manual' ? (
                <FeedbackInput onAnalyze={handleAnalyzeManual} loading={loading} />
              ) : (
                <CSVUpload onUploadCSV={handleAnalyzeCSV} loading={loading} />
              )}
            </div>
          </div>
        )}

        {/* PAGE 3: DASHBOARD & CHARTS */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {!analysisData ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Data Available Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Run an analysis on feedback data first to unlock the interactive dashboard.
                </p>
                <button
                  onClick={() => setActiveSection('input')}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-colors"
                >
                  Go to Analysis Studio
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Analytics & Insights Dashboard
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Dynamic visual metrics generated from <span className="font-bold text-slate-900 dark:text-white">{analysisData.summary?.total}</span> analyzed responses
                    </p>
                  </div>

                  <button
                    onClick={handleLoadDemoData}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors flex items-center space-x-2 shrink-0 border border-slate-200 dark:border-slate-700"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Load Sample Data</span>
                  </button>
                </div>

                <DashboardCards summary={analysisData.summary} />
                <ChartsSection summary={analysisData.summary} />

                <div className="grid grid-cols-1 gap-8">
                  <NeedsAttention results={analysisData.results} summary={analysisData.summary} />
                  <PositiveHighlights results={analysisData.results} />
                </div>
              </>
            )}
          </div>
        )}

        {/* PAGE 4: RESULTS & INSIGHTS */}
        {activeSection === 'results' && (
          <div className="space-y-8">
            {!analysisData ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Results Available</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Run an analysis on feedback data first to view detailed row-by-row results and AI topics.
                </p>
                <button
                  onClick={() => setActiveSection('input')}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-colors"
                >
                  Go to Analysis Studio
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Results & AI Insights
                  </h2>
                </div>

                <AIInsights
                  insights={analysisData.insights}
                  topics={analysisData.topics}
                  onTopicClick={handleTopicClick}
                />

                <ResultsTable
                  results={analysisData.results}
                  activeSearch={activeSearch}
                  setActiveSearch={setActiveSearch}
                />

                <ExportSection analysisData={analysisData} />
              </>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 bg-white/50 dark:bg-slate-900/50 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FeedSense AI. Enterprise Sentiment Analysis System.</p>
          <div className="flex items-center space-x-4 font-medium">
            <span>Flask REST API</span>
            <span>•</span>
            <span>VADER + HuggingFace NLP</span>
            <span>•</span>
            <span>React & Tailwind CSS</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
