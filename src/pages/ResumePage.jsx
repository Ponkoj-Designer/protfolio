import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const ResumePage = () => {
  const { personalInfo, experience, skills, services } = useData();
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-10">
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant dark:border-white/15 pb-6 no-print">
        <div>
          <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
            Curriculum Vitae
          </span>
          <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
            Professional Resume
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyEmail}
            className="px-4 py-2.5 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded font-label-caps text-xs uppercase flex items-center gap-1.5 hover:bg-surface-container dark:hover:bg-neutral-800 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Email Copied!' : 'Copy Email'}
          </button>

          <button
            onClick={handlePrint}
            className="bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-6 py-2.5 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull flex items-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Resume Card Container */}
      <div className="print-container bg-surface-container-lowest dark:bg-neutral-900 border border-outline-variant dark:border-white/15 rounded-2xl p-8 md:p-14 space-y-12 shadow-xl">
        {/* Resume Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant dark:border-white/15 pb-8">
          <div className="space-y-2">
            <h1 className="font-headline-md text-4xl font-bold text-on-surface dark:text-white">
              {personalInfo.name}
            </h1>
            <p className="font-label-caps text-sm font-semibold text-secondary dark:text-emerald-400 uppercase tracking-wider">
              {personalInfo.title}
            </p>
            <p className="text-sm text-on-surface-variant dark:text-stone-300 max-w-xl leading-relaxed">
              {personalInfo.bio}
            </p>
          </div>

          <div className="space-y-1 text-xs text-on-surface-variant dark:text-stone-300 md:text-right">
            <p><strong className="text-on-surface dark:text-white">Email:</strong> {personalInfo.email}</p>
            <p><strong className="text-on-surface dark:text-white">Phone:</strong> {personalInfo.phone}</p>
            <p><strong className="text-on-surface dark:text-white">Location:</strong> {personalInfo.location}</p>
            <p><strong className="text-on-surface dark:text-white">Portfolio:</strong> ponkojdas.com</p>
          </div>
        </div>

        {/* Work Experience */}
        <div className="space-y-6">
          <h2 className="font-headline-sm text-xl font-bold uppercase tracking-wider text-primary dark:text-white border-b border-surface-variant/40 dark:border-white/15 pb-2">
            Work History & Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white">
                    {exp.role} <span className="text-secondary dark:text-emerald-400 font-normal">@ {exp.company}</span>
                  </h3>
                  <span className="text-xs font-label-caps text-on-surface-variant dark:text-stone-300 font-semibold">
                    {exp.duration} | {exp.location}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-stone-300 leading-relaxed">
                  {exp.details}
                </p>
                {exp.highlights && (
                  <ul className="list-disc list-inside text-xs text-on-surface-variant dark:text-stone-300 space-y-0.5 pl-2">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key Expertise & Core Services */}
        <div className="space-y-6">
          <h2 className="font-headline-sm text-xl font-bold uppercase tracking-wider text-primary dark:text-white border-b border-surface-variant/40 dark:border-white/15 pb-2">
            Core Technical & Design Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((srv, idx) => (
              <div key={idx} className="p-4 bg-surface-container-low dark:bg-neutral-800 rounded-xl space-y-1 border dark:border-white/10">
                <h4 className="font-label-sm font-bold text-xs text-on-surface dark:text-white">{srv.title}</h4>
                <p className="text-[11px] text-on-surface-variant dark:text-stone-300 line-clamp-2">{srv.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="space-y-6">
          <h2 className="font-headline-sm text-xl font-bold uppercase tracking-wider text-primary dark:text-white border-b border-surface-variant/40 dark:border-white/15 pb-2">
            Skills & Software Matrix
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {skills.map((skill, idx) => (
              <div key={idx} className="p-3 bg-surface-container dark:bg-neutral-800 rounded-lg flex items-center justify-between border dark:border-white/10">
                <span className="font-medium text-on-surface dark:text-white">{skill.name}</span>
                <span className="text-secondary dark:text-emerald-400 font-bold">{skill.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-2">
            <h2 className="font-headline-sm text-base font-bold uppercase tracking-wider text-primary dark:text-white">
              Education
            </h2>
            <p className="text-xs font-bold text-on-surface dark:text-white">
              B.Sc. in Computer Science & Engineering
            </p>
            <p className="text-xs text-on-surface-variant dark:text-stone-300">
              Ahsanullah University of Science and Technology (2015 - 2019)
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-headline-sm text-base font-bold uppercase tracking-wider text-primary dark:text-white">
              Languages
            </h2>
            <p className="text-xs text-on-surface dark:text-white">
              <strong className="text-on-surface dark:text-white">English:</strong> Full Professional Proficiency | <strong className="text-on-surface dark:text-white">Bengali:</strong> Native
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
