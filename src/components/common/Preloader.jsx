import React, { useEffect, useState } from 'react';

export const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 600);

    const timer2 = setTimeout(() => {
      setLoading(false);
    }, 1100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-surface dark:bg-black text-on-surface dark:text-white flex flex-col items-center justify-center transition-all duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      <div className="text-center space-y-4 max-w-sm px-6">
        <div className="space-y-1">
          <h2 className="font-headline-md text-3xl font-bold tracking-tight text-primary dark:text-white">
            Ponkoj Das
          </h2>
          <p className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase tracking-widest">
            Graphics & Web Design Studio
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-1 bg-surface-container-high dark:bg-neutral-800 rounded-full overflow-hidden mx-auto border dark:border-white/10">
          <div className="h-full bg-secondary dark:bg-emerald-400 rounded-full animate-preloaderBar"></div>
        </div>
      </div>
    </div>
  );
};
