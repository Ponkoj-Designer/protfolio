import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile py-32 text-center space-y-6">
      <h1 className="font-headline-md text-6xl font-bold text-primary dark:text-on-primary">
        404
      </h1>
      <h2 className="font-headline-sm text-2xl text-on-surface dark:text-surface-bright">
        Page Not Found
      </h2>
      <p className="text-on-surface-variant dark:text-surface-variant text-sm max-w-md mx-auto">
        The route you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-primary text-on-primary dark:bg-surface-bright dark:text-primary px-6 py-3 rounded font-label-caps text-xs uppercase tracking-wider"
      >
        <span className="material-symbols-outlined text-sm">home</span>
        Return to Home Page
      </Link>
    </div>
  );
};
