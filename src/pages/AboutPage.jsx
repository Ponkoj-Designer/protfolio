import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const AboutPage = () => {
  const { personalInfo, skills } = useData();

  const values = [
    {
      title: "Editorial Elegance",
      description: "Believing that high-end typography and generous whitespace define timeless digital art.",
      icon: "menu_book"
    },
    {
      title: "Human-Centric UX",
      description: "Designing interfaces rooted in user research, cognitive clarity, and intuitive interaction flow.",
      icon: "fingerprint"
    },
    {
      title: "Performant Code",
      description: "Building fast, lightweight React components optimized for seamless performance on all devices.",
      icon: "bolt"
    },
    {
      title: "Continuous Craft",
      description: "Refining visual techniques, modern frontend frameworks, and design system methodologies daily.",
      icon: "auto_awesome"
    }
  ];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-5 md:py-6 space-y-6 md:space-y-8">
      {/* Main Bio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2 border-b border-surface-variant dark:border-white/15 pb-4">
            <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
              About Ponkoj Das
            </span>
            <h1 className="font-headline-md md:font-display-lg text-3xl md:text-5xl font-bold leading-tight text-on-surface dark:text-white">
              Designing with Intent, <br />
              Building with Precision.
            </h1>
          </div>

          <div className="space-y-4 text-on-surface-variant dark:text-stone-300 font-body-lg text-base leading-relaxed">
          <p className="text-lg md:text-xl font-headline-sm text-on-surface dark:text-white">
            Hello, I'm Ponkoj Das. Over the past 5 years, I've bridged the gap between graphic art and modern software development.
          </p>
          <p>
            My work focuses on helping brands, tech startups, and editorial platforms create distinct visual voices. I believe design is not just how something looks, but how clearly it communicates and functions under real-world usage.
          </p>
          <p>
            Whether architecting an expansive design system in Figma or writing clean, modular React and Tailwind CSS code, I ensure that every detail—from color contrast to animation timing—serves a defined goal.
          </p>
            <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/resume"
              className="bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-6 py-3 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull inline-flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              View Full CV / Resume
            </Link>
            <Link
              to="/contact"
              className="border border-primary dark:border-white text-primary dark:text-white px-6 py-3 rounded font-label-caps text-xs uppercase tracking-wider hover:bg-surface-container dark:hover:bg-white/10 transition-colors"
            >
              Let's Talk
            </Link>
            </div>
          </div>
        </div>

        {/* Studio Photo */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group shadow-2xl border border-outline-variant dark:border-white/20">
            {(personalInfo.aboutImage || personalInfo.heroImage) ? (
              <img
                src={personalInfo.aboutImage || personalInfo.heroImage}
                alt={personalInfo.name}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
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

      {/* Core Values Section */}
      <div className="space-y-6">
        <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
          Core Design Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-xl border border-outline-variant dark:border-white/15 space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container dark:bg-neutral-800 text-primary dark:text-emerald-400 flex items-center justify-center border dark:border-white/10">
                <span className="material-symbols-outlined">{v.icon}</span>
              </div>
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface dark:text-white">
                {v.title}
              </h3>
              <p className="text-xs text-on-surface-variant dark:text-stone-300 leading-relaxed">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills Breakdown */}
      <div className="space-y-8">
        <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
          Skills & Proficiency
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-label-sm font-semibold text-on-surface dark:text-white">
                  {skill.name}
                </span>
                <span className="text-on-surface-variant dark:text-emerald-400 font-bold">
                  {skill.percentage}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-high dark:bg-neutral-800 overflow-hidden border dark:border-white/10">
                <div
                  className="h-full bg-secondary dark:bg-emerald-400 rounded-full transition-all duration-1000"
                  style={{ width: `${skill.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
