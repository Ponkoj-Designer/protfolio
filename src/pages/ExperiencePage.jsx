import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const ExperiencePage = () => {
  const { experience } = useData();

  const education = [
    {
      degree: "B.Sc. in Computer Science & Engineering",
      institution: "Ahsanullah University of Science and Technology",
      year: "2015 - 2019",
      notes: "Specialized in Software Engineering, Human-Computer Interaction, and Interactive Media."
    }
  ];

  const awards = [
    {
      title: "Regional Design Excellence Award",
      issuer: "Creative Visual Guild",
      year: "2021",
      desc: "Awarded for outstanding editorial brand identity and interactive typography system."
    },
    {
      title: "Best UI Design Finalist",
      issuer: "Tech Craft Expo",
      year: "2023",
      desc: "Recognized for Nexus Financial real-time dark mode user experience."
    }
  ];

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-20">
      {/* Header */}
      <div className="space-y-4 border-b border-surface-variant dark:border-white/15 pb-8">
        <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
          Career Roadmap
        </span>
        <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
          Professional Experience & Milestone Timeline
        </h1>
        <p className="text-on-surface-variant dark:text-stone-300 text-base max-w-2xl leading-relaxed">
          A chronological journey of design leadership, frontend engineering, and collaborative client impact over 5+ years.
        </p>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-8">
        <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
          Work History
        </h2>

        <div className="relative border-l-2 border-surface-variant dark:border-white/20 ml-4 md:ml-6 space-y-12 pl-6 md:pl-10">
          {experience.map((item, index) => (
            <div key={item.id || index} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-secondary dark:bg-emerald-400 border-4 border-surface dark:border-black group-hover:scale-125 transition-transform"></div>

              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 hover-lift">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-surface-variant/40 dark:border-white/15 pb-4">
                  <div>
                    <h3 className="font-headline-sm text-2xl font-bold text-on-surface dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-sm font-label-caps font-semibold text-secondary dark:text-emerald-400">
                      {item.company} — <span className="text-on-surface-variant dark:text-stone-300 font-normal">{item.location}</span>
                    </p>
                  </div>
                  <span className="bg-surface-container-high dark:bg-neutral-800 text-on-surface dark:text-white px-4 py-1.5 rounded-full text-xs font-label-caps font-semibold tracking-wider w-fit border dark:border-white/15">
                    {item.duration}
                  </span>
                </div>

                <p className="text-on-surface-variant dark:text-stone-300 text-sm leading-relaxed">
                  {item.details}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-label-caps text-xs font-bold uppercase text-primary dark:text-white">
                      Key Highlights
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-on-surface-variant dark:text-stone-300">
                      {item.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-sm">check_circle</span>
                          {hl}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education & Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
        {/* Education */}
        <div className="space-y-6">
          <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
            Education
          </h2>
          {education.map((edu, i) => (
            <div key={i} className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">{edu.degree}</h3>
                <span className="text-xs font-label-caps bg-surface-container dark:bg-neutral-800 text-on-surface dark:text-white px-3 py-1 rounded border dark:border-white/15 font-semibold">{edu.year}</span>
              </div>
              <p className="text-xs font-semibold text-secondary dark:text-emerald-400">{edu.institution}</p>
              <p className="text-xs text-on-surface-variant dark:text-stone-300">{edu.notes}</p>
            </div>
          ))}
        </div>

        {/* Honors & Awards */}
        <div className="space-y-6">
          <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white border-b border-surface-variant dark:border-white/15 pb-4">
            Honors & Awards
          </h2>
          {awards.map((award, i) => (
            <div key={i} className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">{award.title}</h3>
                <span className="text-xs font-label-caps bg-surface-container dark:bg-neutral-800 text-on-surface dark:text-white px-3 py-1 rounded border dark:border-white/15 font-semibold">{award.year}</span>
              </div>
              <p className="text-xs font-semibold text-secondary dark:text-emerald-400">{award.issuer}</p>
              <p className="text-xs text-on-surface-variant dark:text-stone-300">{award.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Footer */}
      <div className="text-center pt-8">
        <Link
          to="/resume"
          className="inline-flex items-center gap-2 bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-8 py-4 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull"
        >
          <span className="material-symbols-outlined text-sm">description</span>
          View & Download Full Professional CV
        </Link>
      </div>
    </div>
  );
};
