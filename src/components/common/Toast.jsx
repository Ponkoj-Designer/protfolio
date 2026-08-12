import React, { useEffect } from 'react';

export const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed top-8 right-8 z-50 animate-bounce-short flex items-center gap-4 bg-primary text-on-primary dark:bg-surface-bright dark:text-primary px-6 py-4 rounded-xl shadow-[0_20px_40px_rgba(28,27,27,0.25)] border border-outline-variant/30">
      <span className={`material-symbols-outlined icon-fill ${isSuccess ? 'text-secondary-fixed' : 'text-error'}`}>
        {isSuccess ? 'check_circle' : 'error'}
      </span>
      <span className="font-label-sm text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-70 transition-opacity p-1"
        aria-label="Close notification"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
