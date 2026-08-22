import React from 'react';
import { BrainCircuit, Moon, Sun, CheckCircle, AlertCircle, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, backendOnline, activeSection, setActiveSection, user, onLogout }) {
  
  const handleNavClick = (sectionId) => {
    if (!user) {
      setActiveSection('login');
      return;
    }
    setActiveSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/20">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                FeedSense
              </span>
              <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                AI
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'input', label: 'Analyze Feedback' },
              { id: 'dashboard', label: 'Dashboard & Charts' },
              { id: 'results', label: 'Results & Insights' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activeSection === tab.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Status */}
          <div className="flex items-center space-x-3">
            
            {/* Backend Health Badge */}
            <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              backendOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}>
              {backendOnline ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>AI Engine Ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>Connecting AI...</span>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* User Profile / Login Button */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-3">
                <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveSection('login')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
