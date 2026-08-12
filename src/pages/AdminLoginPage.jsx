import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/common/Toast';

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const from = location.state?.from?.pathname || '/admin';

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await login(username.trim(), password);

      if (res.success) {
        setToastMsg('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError(res.error || 'Invalid credentials. Access denied.');
      }
    } catch (err) {
      setError('Authentication failed. Please check server connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-margin-mobile py-16">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="bg-surface-container-lowest dark:bg-neutral-900 max-w-md w-full rounded-2xl p-8 md:p-10 border border-outline-variant dark:border-white/15 space-y-6 shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-white/10 text-primary dark:text-emerald-400 flex items-center justify-center mx-auto border dark:border-white/15">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <h1 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white">
            Admin Authentication
          </h1>
          <p className="text-xs text-on-surface-variant dark:text-stone-300 font-label-caps uppercase tracking-wider">
            Authorized Personnel Only
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-error-container/30 border border-error/30 text-error dark:text-red-400 text-xs flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-label-caps font-bold uppercase mb-1.5 text-on-surface dark:text-stone-200">
              Admin Username
            </label>
            <input
              type="text"
              required
              placeholder="Enter admin username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
            />
          </div>

          <div>
            <label className="block text-xs font-label-caps font-bold uppercase mb-1.5 text-on-surface dark:text-stone-200">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="Enter admin password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-on-primary dark:bg-white dark:text-black font-semibold py-3.5 rounded font-label-caps text-xs tracking-wider uppercase magnetic-pull flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-bold shadow-md disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">lock</span>
                Sign In to Admin
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-on-surface-variant dark:text-stone-400 font-label-caps">
          Protected area. Unauthorized login attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
};
