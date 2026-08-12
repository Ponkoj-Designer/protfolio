import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { personalInfo } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/projects' },
    { name: 'Experience', path: '/experience' },
    { name: 'Resume', path: '/resume' },
    { name: 'Reviews', path: '/testimonials' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-surface-variant/40 dark:border-white/10 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="font-headline-sm text-2xl font-bold tracking-tight text-on-surface dark:text-surface-bright hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <span>{personalInfo.name}</span>
          <span className="w-2 h-2 rounded-full bg-secondary inline-block"></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 font-label-caps text-label-caps tracking-wider uppercase">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-200 magnetic-pull py-1 relative ${
                  active
                    ? 'text-primary dark:text-on-primary font-bold border-b-2 border-primary dark:border-on-primary'
                    : 'text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-on-primary'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Actions: Theme Switcher & Contact CTA */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-surface-bright hover:scale-105 transition-transform shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <Link
            to="/contact"
            className="bg-primary text-on-primary dark:bg-surface-bright dark:text-primary px-5 py-2.5 rounded font-label-caps text-label-caps tracking-wider uppercase hover:opacity-90 magnetic-pull transition-all shadow-sm"
          >
            Get In Touch
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-surface-bright"
          >
            <span className="material-symbols-outlined text-xl">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-on-surface dark:text-surface-bright focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface dark:bg-inverse-surface border-b border-outline-variant px-margin-mobile py-6 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-3 font-label-caps text-label-caps tracking-wider">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-on-primary dark:bg-surface-bright dark:text-primary font-bold'
                    : 'text-on-surface-variant dark:text-surface-variant hover:bg-surface-container'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-outline-variant">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center bg-secondary text-on-secondary py-3 rounded font-label-caps text-label-caps"
            >
              Contact Me
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
