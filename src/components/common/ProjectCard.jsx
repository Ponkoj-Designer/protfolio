import React from 'react';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ project, onQuickView }) => {
  return (
    <div className="group bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-white/10 rounded-2xl overflow-hidden hover-lift flex flex-col h-full transition-all duration-300">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container dark:bg-neutral-800">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high dark:from-neutral-800 dark:to-neutral-900 p-4 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant/40 dark:text-stone-500 mb-1">image</span>
            <span className="font-headline-sm text-sm font-semibold text-on-surface/60 dark:text-stone-400 line-clamp-1">{project.title}</span>
          </div>
        )}
        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-surface/90 dark:bg-black/80 backdrop-blur-md text-on-surface dark:text-surface-bright px-3 py-1 rounded-full text-xs font-label-caps tracking-wider shadow-sm">
            {project.category}
          </span>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
          {onQuickView && (
            <button
              onClick={() => onQuickView(project)}
              className="bg-white text-black px-4 py-2 rounded-full font-label-caps text-xs flex items-center gap-1.5 hover:scale-105 transition-transform shadow-md"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              Quick View
            </button>
          )}
          <Link
            to={`/projects/${project.id}`}
            className="bg-primary text-on-primary dark:bg-surface-bright dark:text-primary px-4 py-2 rounded-full font-label-caps text-xs flex items-center gap-1.5 hover:scale-105 transition-transform shadow-md"
          >
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
            Case Study
          </Link>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant dark:text-surface-variant">
            <span>{project.client}</span>
            <span>{project.year}</span>
          </div>

          <Link to={`/projects/${project.id}`}>
            <h3 className="font-headline-sm text-xl font-semibold text-on-surface dark:text-surface-bright group-hover:text-secondary transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>

          <p className="text-on-surface-variant dark:text-surface-variant font-body-md text-sm line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-surface-variant/40 dark:border-white/10">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-0.5 rounded bg-surface-container dark:bg-white/10 text-on-surface-variant dark:text-surface-variant font-label-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
