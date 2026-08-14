import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/common/ProjectCard';

export const HomePage = () => {
  const { personalInfo, projects, services, testimonials } = useData();

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  if (featuredProjects.length === 0) {
    featuredProjects.push(...projects.slice(0, 3));
  }

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden pt-8">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-surface-variant rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter w-full z-10 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2.5 bg-surface-container-high dark:bg-neutral-800 px-4 py-2 rounded-full w-fit shadow-xs border border-outline-variant/30 dark:border-white/15">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping"></span>
              <span className="font-label-caps text-xs font-semibold text-on-surface-variant dark:text-stone-200">
                {personalInfo.availability}
              </span>
            </div>

            <h1 className="font-headline-md lg:font-display-lg text-4xl lg:text-7xl font-bold tracking-tight leading-tight text-on-surface dark:text-white">
              Crafting Digital <br />
              <span className="text-gradient">Experiences</span>
            </h1>

            <p className="font-body-lg text-lg text-on-surface-variant dark:text-stone-300 max-w-xl leading-relaxed">
              {personalInfo.bio}
            </p>

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <Link
                to="/projects"
                className="bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-8 py-4 rounded font-label-caps text-xs tracking-wider uppercase magnetic-pull flex items-center gap-2 hover:opacity-90 transition-all shadow-md"
              >
                View My Work
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                to="/contact"
                className="border border-primary dark:border-white text-primary dark:text-white px-8 py-4 rounded font-label-caps text-xs tracking-wider uppercase magnetic-pull hover:bg-surface-container dark:hover:bg-white/10 transition-colors"
              >
                Contact Me
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-surface-variant dark:border-white/15 max-w-lg">
              <div>
                <p className="font-headline-md text-3xl md:text-4xl font-bold text-primary dark:text-white">
                  {personalInfo.stats.projectsCompleted}+
                </p>
                <p className="font-label-caps text-xs text-on-surface-variant dark:text-stone-300 mt-1 uppercase font-medium">
                  Projects Completed
                </p>
              </div>
              <div>
                <p className="font-headline-md text-3xl md:text-4xl font-bold text-primary dark:text-white">
                  {personalInfo.stats.happyClients}+
                </p>
                <p className="font-label-caps text-xs text-on-surface-variant dark:text-stone-300 mt-1 uppercase font-medium">
                  Happy Clients
                </p>
              </div>
              <div>
                <p className="font-headline-md text-3xl md:text-4xl font-bold text-primary dark:text-white">
                  {personalInfo.stats.yearsExperience}
                </p>
                <p className="font-label-caps text-xs text-on-surface-variant dark:text-stone-300 mt-1 uppercase font-medium">
                  Years Exp.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Designer Portrait */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group shadow-2xl border border-outline-variant dark:border-white/20">
              {personalInfo.heroImage ? (
                <>
                  <img
                    src={personalInfo.heroImage}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-70"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <p className="font-headline-sm text-lg font-bold">{personalInfo.name}</p>
                    <p className="text-xs opacity-90 font-label-caps">{personalInfo.title}</p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high dark:from-neutral-800 dark:to-neutral-900 p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-primary dark:text-white">person</span>
                  </div>
                  <p className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">{personalInfo.name}</p>
                  <p className="text-xs text-on-surface-variant dark:text-stone-400 font-label-caps mt-1">{personalInfo.title}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant dark:border-white/15 pb-6">
          <div>
            <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
              Selected Portfolio
            </span>
            <h2 className="font-headline-md text-3xl md:text-4xl font-semibold text-on-surface dark:text-white mt-1">
              Featured Case Studies
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-label-caps uppercase text-primary dark:text-white hover:underline font-semibold"
          >
            Explore All Projects ({projects.length})
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="bg-surface-container-low dark:bg-neutral-900/60 py-20 border-y border-outline-variant dark:border-white/15">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
              Expertise & Capabilities
            </span>
            <h2 className="font-headline-md text-3xl md:text-4xl font-semibold text-on-surface dark:text-white">
              Comprehensive Design & Dev Services
            </h2>
            <p className="text-on-surface-variant dark:text-stone-300 text-sm">
              Blending editorial aesthetics with robust software engineering to deliver modern web solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 hover-lift space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container dark:bg-emerald-950/80 text-on-secondary-container dark:text-emerald-300 flex items-center justify-center border dark:border-emerald-700/50">
                    <span className="material-symbols-outlined text-2xl">{srv.icon}</span>
                  </div>
                  <h3 className="font-headline-sm text-xl font-semibold text-on-surface dark:text-white">
                    {srv.title}
                  </h3>
                  <p className="text-on-surface-variant dark:text-stone-300 text-sm leading-relaxed">
                    {srv.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-surface-variant/40 dark:border-white/15">
                  <span className="font-label-caps text-xs text-secondary dark:text-emerald-400 font-bold">
                    {srv.pricing}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-6 py-3 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull"
            >
              Explore Full Service Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Highlight Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
            Client Feedback
          </span>
          <h2 className="font-headline-md text-3xl md:text-4xl font-semibold text-on-surface dark:text-white">
            What Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500 dark:text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm icon-fill">star</span>
                  ))}
                </div>
                <p className="text-on-surface dark:text-stone-200 italic text-sm leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-surface-variant/40 dark:border-white/15">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-outline-variant dark:border-white/20"
                />
                <div>
                  <h4 className="font-label-sm font-semibold text-on-surface dark:text-white text-sm">
                    {item.name}
                  </h4>
                  <p className="text-xs text-on-surface-variant dark:text-stone-300">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
