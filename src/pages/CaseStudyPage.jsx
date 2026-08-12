import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const CaseStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useData();

  const currentIndex = projects.findIndex((p) => p.id === id);
  const project = projects[currentIndex];

  if (!project) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile py-24 text-center space-y-6">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant dark:text-stone-400">folder_off</span>
        <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
          Project Not Found
        </h1>
        <p className="text-on-surface-variant dark:text-stone-300">
          The requested case study could not be located in our portfolio records.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-6 py-3 rounded font-label-caps text-xs uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Projects Gallery
        </Link>
      </div>
    );
  }

  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-16">
      {/* Back Button Navigation */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-label-caps uppercase text-on-surface-variant dark:text-stone-300 hover:text-primary dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Portfolio
        </button>
      </div>

      {/* Case Study Hero */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-secondary-container dark:bg-emerald-950 text-on-secondary-container dark:text-emerald-200 border dark:border-emerald-700/50 px-3.5 py-1 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold">
              {project.category}
            </span>
            {project.featured && (
              <span className="bg-surface-container-high dark:bg-neutral-800 text-on-surface dark:text-white px-3.5 py-1 rounded-full text-xs font-label-caps tracking-wider uppercase font-semibold border dark:border-white/15">
                Featured Case Study
              </span>
            )}
          </div>
          <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
            {project.title}
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant dark:text-stone-300 max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Project Metadata Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-surface-container-low dark:bg-neutral-900 rounded-2xl border border-outline-variant dark:border-white/15 text-sm">
          <div>
            <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase block font-semibold">Client</span>
            <span className="font-semibold text-on-surface dark:text-white">{project.client}</span>
          </div>
          <div>
            <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase block font-semibold">Year</span>
            <span className="font-semibold text-on-surface dark:text-white">{project.year}</span>
          </div>
          <div>
            <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase block font-semibold">My Role</span>
            <span className="font-semibold text-on-surface dark:text-white">{project.role || 'Lead Designer & Frontend Developer'}</span>
          </div>
          <div>
            <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase block font-semibold">Tags</span>
            <span className="font-semibold text-on-surface dark:text-white">{project.tags.join(', ')}</span>
          </div>
        </div>

        {/* Main Hero Showcase Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-outline-variant dark:border-white/20">
          <img
            src={project.heroImage || project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Challenge & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        <div className="space-y-4 bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15">
          <div className="w-10 h-10 rounded-lg bg-error-container dark:bg-red-950 text-on-error-container dark:text-red-300 flex items-center justify-center border dark:border-red-700/50">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <h2 className="font-headline-sm text-2xl font-semibold text-on-surface dark:text-white">
            The Challenge
          </h2>
          <p className="text-on-surface-variant dark:text-stone-300 text-sm leading-relaxed">
            {project.challenge || "Balancing intuitive UI layout requirements with dense data architecture and modern visual brand aesthetics across responsive breakpoints."}
          </p>
        </div>

        <div className="space-y-4 bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15">
          <div className="w-10 h-10 rounded-lg bg-secondary-container dark:bg-emerald-950 text-on-secondary-container dark:text-emerald-300 flex items-center justify-center border dark:border-emerald-700/50">
            <span className="material-symbols-outlined">lightbulb</span>
          </div>
          <h2 className="font-headline-sm text-2xl font-semibold text-on-surface dark:text-white">
            The Solution
          </h2>
          <p className="text-on-surface-variant dark:text-stone-300 text-sm leading-relaxed">
            {project.solution || "Created a component-driven design system with cohesive Playfair Display typography, warm surface tones, fluid micro-interactions, and performant frontend code."}
          </p>
        </div>
      </div>

      {/* Key Results & Metrics */}
      {project.results && (
        <div className="bg-primary text-on-primary dark:bg-neutral-900 dark:text-white p-8 rounded-2xl border border-outline-variant/20 dark:border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-label-caps text-xs text-secondary-fixed dark:text-emerald-400 uppercase tracking-wider font-bold">
              Impact & Key Metrics
            </span>
            <h3 className="font-headline-sm text-2xl font-bold">Project Results</h3>
          </div>
          <p className="text-sm opacity-90 dark:text-stone-200 max-w-xl leading-relaxed">
            {project.results}
          </p>
        </div>
      )}

      {/* Gallery Showcase */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
            Visual Gallery & Deliverables
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((imgUrl, i) => (
              <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden shadow-md border border-outline-variant dark:border-white/20">
                <img src={imgUrl} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Next / Prev Footer Nav */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-surface-variant dark:border-white/15">
        <Link
          to={`/projects/${prevProject.id}`}
          className="p-6 rounded-2xl border border-outline-variant dark:border-white/15 bg-surface-container-lowest dark:bg-neutral-900 hover-lift space-y-2 group"
        >
          <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase flex items-center gap-1 group-hover:text-primary dark:group-hover:text-white font-semibold">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Previous Project
          </span>
          <p className="font-headline-sm text-lg font-semibold text-on-surface dark:text-white">
            {prevProject.title}
          </p>
        </Link>

        <Link
          to={`/projects/${nextProject.id}`}
          className="p-6 rounded-2xl border border-outline-variant dark:border-white/15 bg-surface-container-lowest dark:bg-neutral-900 hover-lift space-y-2 text-right group"
        >
          <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase flex items-center justify-end gap-1 group-hover:text-primary dark:group-hover:text-white font-semibold">
            Next Project
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
          <p className="font-headline-sm text-lg font-semibold text-on-surface dark:text-white">
            {nextProject.title}
          </p>
        </Link>
      </div>
    </div>
  );
};
