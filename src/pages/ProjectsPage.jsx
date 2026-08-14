import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/common/ProjectCard';

export const ProjectsPage = () => {
  const { projects } = useData();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [quickViewProject, setQuickViewProject] = useState(null);

  const categories = ['All', 'UI/UX Design', 'Branding', 'Web Development', 'Graphic Design'];

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesCategory =
          activeCategory === 'All' || project.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch =
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return (b.year || '2025').localeCompare(a.year || '2025');
      });
  }, [projects, activeCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 border-b border-surface-variant dark:border-white/15 pb-8">
        <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
          Portfolio Archive
        </span>
        <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
          All Selected Projects & Case Studies
        </h1>
        <p className="text-on-surface-variant dark:text-stone-300 text-base max-w-2xl leading-relaxed">
          Explore a curated showcase of user interfaces, brand systems, editorial design, and web applications created with intention.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-container-low dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-label-caps text-xs tracking-wider uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold shadow-sm'
                  : 'bg-surface-container-lowest dark:bg-neutral-800 text-on-surface-variant dark:text-stone-200 hover:bg-surface-container dark:hover:bg-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-stone-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search work or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded-full text-xs text-on-surface dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400 focus:outline-none focus:border-secondary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-stone-300 hover:text-primary dark:hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded-full text-xs font-label-caps text-on-surface dark:text-white focus:outline-none focus:border-secondary cursor-pointer"
            >
              <option value="newest" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Sort: Newest</option>
              <option value="featured" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Sort: Featured First</option>
              <option value="title" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Sort: Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onQuickView={(p) => setQuickViewProject(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-container-low dark:bg-neutral-900 rounded-2xl border border-dashed border-outline-variant dark:border-white/15 space-y-4">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant dark:text-stone-400">search_off</span>
          <h3 className="font-headline-sm text-xl text-on-surface dark:text-white">
            No projects match your search criteria.
          </h3>
          <p className="text-sm text-on-surface-variant dark:text-stone-300">
            Try clearing filters or searching for different terms like "UI/UX", "Branding", or "React".
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-semibold rounded font-label-caps text-xs uppercase"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-neutral-900 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-outline-variant dark:border-white/20 space-y-6 max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-white/15 pb-4">
              <div>
                <span className="text-xs font-label-caps text-secondary dark:text-emerald-400 uppercase font-bold">
                  {quickViewProject.category}
                </span>
                <h3 className="font-headline-sm text-2xl font-semibold text-on-surface dark:text-white">
                  {quickViewProject.title}
                </h3>
              </div>
              <button
                onClick={() => setQuickViewProject(null)}
                className="w-8 h-8 rounded-full bg-surface-container dark:bg-neutral-800 flex items-center justify-center hover:opacity-80 text-on-surface dark:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800">
              <img
                src={quickViewProject.heroImage || quickViewProject.thumbnail}
                alt={quickViewProject.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-sm text-on-surface-variant dark:text-stone-300 leading-relaxed">
              {quickViewProject.fullDescription || quickViewProject.shortDescription}
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs bg-surface-container-low dark:bg-neutral-800 p-4 rounded-xl">
              <div>
                <span className="text-on-surface-variant dark:text-stone-400 block font-medium">Client</span>
                <span className="font-semibold text-on-surface dark:text-white">{quickViewProject.client}</span>
              </div>
              <div>
                <span className="text-on-surface-variant dark:text-stone-400 block font-medium">Year</span>
                <span className="font-semibold text-on-surface dark:text-white">{quickViewProject.year}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setQuickViewProject(null)}
                className="px-5 py-2.5 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded font-label-caps text-xs uppercase"
              >
                Close Preview
              </button>
              <Link
                to={`/projects/${quickViewProject.id}`}
                onClick={() => setQuickViewProject(null)}
                className="px-6 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-semibold rounded font-label-caps text-xs uppercase flex items-center gap-1.5"
              >
                Full Case Study
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
