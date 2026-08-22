import React, { useState, useEffect } from 'react';
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, PieChart, Sparkles, AlertCircle, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, darkMode, setDarkMode }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Registered Accounts Store (persisted in localStorage)
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('feedsense_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save accounts to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('feedsense_users', JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save user accounts:', e);
    }
  }, [accounts]);

  // Email Verification OTP State
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const validateEmailFormat = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (isRegisterMode) {
      // Create Account Validation
      if (!username.trim()) {
        setError('Please enter a username.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email ID.');
        return;
      }
      if (!validateEmailFormat(email.trim())) {
        setError('Invalid Email Format! Please enter a valid email address (e.g. name@domain.com).');
        return;
      }

      // Check if account already exists
      const existingAccount = accounts.find(
        acc => acc.email.toLowerCase() === email.trim().toLowerCase() || acc.username.toLowerCase() === username.trim().toLowerCase()
      );
      if (existingAccount) {
        setError('Account already exists! An account with this Email ID or Username is already registered. Please login.');
        return;
      }

      if (!password) {
        setError('Please enter a password.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (!confirmPassword) {
        setError('Please confirm your password.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please check and try again.');
        return;
      }

      // Generate 6-digit OTP code for Email Verification
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomOtp);
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        setIsVerifyingEmail(true);
      }, 700);

    } else {
      // Login Validation & Account Check
      if (!email.trim()) {
        setError('Please enter your Email ID or Username.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      // Strict Account Existence Check: Must be registered first!
      const userAccount = accounts.find(
        acc => acc.email.toLowerCase() === email.trim().toLowerCase() || acc.username.toLowerCase() === email.trim().toLowerCase()
      );

      if (!userAccount) {
        setError('Account Not Found! No account exists with this Email ID or Username. Please create an account first.');
        return;
      }

      if (userAccount.password !== password) {
        setError('Incorrect Password! Please check your password and try again.');
        return;
      }

      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          email: userAccount.email,
          name: userAccount.username.toUpperCase(),
          role: 'Registered User'
        });
      }, 600);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (otpCode.trim() !== generatedOtp) {
      setError('Incorrect Verification Code! Please enter the 6-digit code shown above.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Save new account into database
      const newAccount = {
        username: username.trim(),
        email: email.trim(),
        password: password
      };

      setAccounts(prev => [...prev, newAccount]);
      setLoading(false);
      setIsVerifyingEmail(false);
      setIsRegisterMode(false);
      setPassword('');
      setConfirmPassword('');
      setOtpCode('');
      setSuccessMsg('Account created & verified successfully! You can now login with your credentials.');
    }, 600);
  };

  const handleResendOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpCode('');
    setError(null);
  };

  const toggleMode = (mode) => {
    setIsRegisterMode(mode);
    setIsVerifyingEmail(false);
    setError(null);
    setSuccessMsg(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtpCode('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-200">
      
      {/* Container Box */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Left Side Banner (5 cols on lg) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 mb-8">
              <BrainCircuit className="w-6 h-6 text-blue-300 animate-pulse" />
              <span className="text-lg font-extrabold text-white tracking-wide">
                FeedSense<span className="text-blue-300">AI</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
              Turn Written Feedback into Actionable Intelligence
            </h2>
            <p className="text-sm text-blue-100/80 mt-3 leading-relaxed">
              Automated AI sentiment analysis designed for colleges, institutions, and businesses to process bulk feedback forms effortlessly.
            </p>
          </div>

          {/* Visual Cards */}
          <div className="my-8 relative z-10 space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-50 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-blue-200">
                <span>"The canteen food quality was excellent today!"</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30">
                  Positive 96%
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-50 space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] text-blue-200">
                <span>"Library desk service was slow and unhelpful."</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-400/20 text-rose-300 font-bold border border-rose-400/30">
                  Negative 94%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <PieChart className="w-4 h-4 mx-auto mb-1 text-amber-300" />
                <span className="font-medium text-blue-100">Live Charts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-300" />
                <span className="font-medium text-blue-100">AI Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-purple-300" />
                <span className="font-medium text-blue-100">CSV/PDF Export</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-blue-200/60 flex items-center justify-between">
            <span>FeedSense AI Enterprise</span>
            <span className="font-semibold text-emerald-300">Registered Users: {accounts.length}</span>
          </div>

        </div>

        {/* Right Side Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
          
          <div>
            {/* Header / Theme Switch */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  FeedSense AI
                </span>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>

            {/* Email OTP Verification Screen */}
            {isVerifyingEmail ? (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 mb-3">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Email Authentication Step</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Verify Your Email ID
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    We sent a 6-digit verification code to <span className="font-bold text-slate-900 dark:text-white">{email}</span>.
                  </p>
                </div>

                <div className="p-3.5 mb-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Verification Code:</span>
                  </div>
                  <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-indigo-600 text-white tracking-widest">
                    {generatedOtp}
                  </span>
                </div>

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enter 6-Digit OTP Code
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        maxLength="6"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 849201"
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-center font-mono text-lg font-bold tracking-widest border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{loading ? 'Verifying...' : 'Verify & Register Account'}</span>
                  </button>
                </form>

                <div className="mt-4 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsVerifyingEmail(false)}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    Back to Form
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Form (Login / Create Account) */
              <div>
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {isRegisterMode ? 'Create Account' : 'Welcome Back'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {isRegisterMode
                      ? 'Register your account to access FeedSense AI analysis features.'
                      : 'Sign in to your registered account to analyze feedback.'}
                  </p>
                </div>

                {/* Notifications & Error Alerts */}
                {successMsg && (
                  <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  
                  {/* Username Field (Create Account mode) */}
                  {isRegisterMode && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Username
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. johndoe"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email ID / Username Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {isRegisterMode ? 'Email ID' : 'Email ID or Username'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={isRegisterMode ? 'email' : 'text'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isRegisterMode ? 'name@institution.edu' : 'Enter registered Email or Username'}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field (Create Account mode) */}
                  {isRegisterMode && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember me & Forgot Password (Login mode) */}
                  {!isRegisterMode && (
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => alert('Password reset instructions have been sent to your registered email.')}
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
                  >
                    <span>{loading ? 'Processing...' : isRegisterMode ? 'Verify Email & Create Account' : 'Login'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>

                </form>
              </div>
            )}

          </div>

          {/* Mode Switcher Footer */}
          {!isVerifyingEmail && (
            <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
              {isRegisterMode ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => toggleMode(false)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => toggleMode(true)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Create Account
                  </button>
                </span>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
