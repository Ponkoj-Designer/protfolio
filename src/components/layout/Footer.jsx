import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export const Footer = () => {
  const { personalInfo } = useData();

  return (
    <footer className="bg-surface-container dark:bg-black border-t border-outline-variant dark:border-white/10 text-on-surface dark:text-surface-bright pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-outline-variant/60 dark:border-white/10">
          {/* Brand Info & Socials Column */}
          <div className="md:col-span-5 space-y-5">
            <Link to="/" className="font-headline-md text-2xl font-bold tracking-tight inline-block">
              {personalInfo.name}
            </Link>
            
            <p className="text-on-surface-variant dark:text-surface-variant max-w-md font-body-md text-sm leading-relaxed">
              {personalInfo.tagline}. Specializing in editorial graphic design, user interface architecture, and high-performance web development.
            </p>

            {/* Facebook, Instagram & LinkedIn Social Icons (Placed directly below name & description) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={personalInfo.socials?.facebook || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-white hover:bg-primary hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-all text-xs font-label-caps font-bold shadow-xs border dark:border-white/10"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current text-blue-600 dark:text-blue-400 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={personalInfo.socials?.instagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-white hover:bg-primary hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-all text-xs font-label-caps font-bold shadow-xs border dark:border-white/10"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current text-pink-600 dark:text-pink-400 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href={personalInfo.socials?.linkedin || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface-container-high dark:bg-inverse-surface text-on-surface dark:text-white hover:bg-primary hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black transition-all text-xs font-label-caps font-bold shadow-xs border dark:border-white/10"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current text-sky-600 dark:text-sky-400 group-hover:text-white" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>

            {/* Existing three small feature icons (Placed below the main social icons row) */}
            <div className="flex items-center gap-3 pt-2 border-t border-surface-variant/30 dark:border-white/10 w-fit">
              <a
                href={personalInfo.socials?.github || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-high dark:bg-inverse-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                title="GitHub"
              >
                <span className="material-symbols-outlined text-lg">code</span>
              </a>
              <a
                href={personalInfo.socials?.linkedin || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-high dark:bg-inverse-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                title="LinkedIn Work"
              >
                <span className="material-symbols-outlined text-lg">work</span>
              </a>
              <a
                href={personalInfo.socials?.dribbble || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-high dark:bg-inverse-surface flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                title="Dribbble Design"
              >
                <span className="material-symbols-outlined text-lg">palette</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-label-caps text-label-caps font-bold tracking-wider uppercase text-primary dark:text-on-primary">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant dark:text-surface-variant">
              <li><Link to="/" className="hover:text-primary dark:hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary dark:hover:text-white transition-colors">About Me</Link></li>
              <li><Link to="/services" className="hover:text-primary dark:hover:text-white transition-colors">Services Offered</Link></li>
              <li><Link to="/projects" className="hover:text-primary dark:hover:text-white transition-colors">Portfolio Gallery</Link></li>
              <li><Link to="/experience" className="hover:text-primary dark:hover:text-white transition-colors">Career Timeline</Link></li>
              <li><Link to="/resume" className="hover:text-primary dark:hover:text-white transition-colors">Professional CV</Link></li>
              <li><Link to="/testimonials" className="hover:text-primary dark:hover:text-white transition-colors">Client Reviews</Link></li>
            </ul>
          </div>

          {/* Contact Details & Status */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-label-caps text-label-caps font-bold tracking-wider uppercase text-primary dark:text-on-primary">
              Direct Contact
            </h3>
            <p className="text-sm text-on-surface-variant dark:text-surface-variant">
              Email: <a href={`mailto:${personalInfo.email}`} className="underline hover:text-primary dark:hover:text-white">{personalInfo.email}</a>
            </p>
            <p className="text-sm text-on-surface-variant dark:text-surface-variant">
              Phone: <a href={`tel:${personalInfo.phone}`} className="hover:text-primary dark:hover:text-white">{personalInfo.phone}</a>
            </p>
            <p className="text-sm text-on-surface-variant dark:text-surface-variant">
              Location: {personalInfo.location}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                {personalInfo.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant dark:text-surface-variant">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
          <p className="font-label-caps">Crafted with Editorial Elegance & React</p>
        </div>
      </div>
    </footer>
  );
};
