import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface dark:bg-black text-on-surface dark:text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl animate-spin text-secondary dark:text-emerald-400">progress_activity</span>
          <span className="text-sm font-label-caps uppercase font-bold">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users directly to private login page
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};
