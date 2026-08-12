import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export const ServicesPage = () => {
  const { services } = useData();
  const navigate = useNavigate();

  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "What is your typical project timeline?",
      a: "Timelines range from 2 to 4 weeks for brand identity projects, and 3 to 6 weeks for full-scale React web applications, depending on project complexity."
    },
    {
      q: "Do you offer ongoing website maintenance?",
      a: "Yes! I offer post-launch support and monthly maintenance retainers to keep your application fast, secure, and up-to-date."
    },
    {
      q: "What tools and tech stack do you work with?",
      a: "Figma, Adobe Creative Suite (Photoshop/Illustrator), React, JavaScript (ES6+), Tailwind CSS, Vite, HTML5/CSS3, and Git."
    },
    {
      q: "How do we get started on a project?",
      a: "Simply send an inquiry through the Contact page. We will schedule a discovery call to discuss your objectives, timeline, and deliverables."
    }
  ];

  const handleSelectService = (serviceTitle) => {
    navigate('/contact', { state: { selectedService: serviceTitle } });
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-20">
      {/* Page Title */}
      <div className="space-y-4 border-b border-surface-variant dark:border-white/15 pb-8 text-center max-w-3xl mx-auto">
        <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
          Services & Offerings
        </span>
        <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
          Tailored Design & Tech Solutions
        </h1>
        <p className="text-on-surface-variant dark:text-stone-300 text-base leading-relaxed">
          From concept to code, I deliver high-caliber visual identities and modern web platforms tailored to client success.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 hover-lift space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary-container dark:bg-emerald-950/80 text-on-secondary-container dark:text-emerald-300 flex items-center justify-center border dark:border-emerald-700/50">
                  <span className="material-symbols-outlined text-2xl">{srv.icon}</span>
                </div>
                <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 bg-secondary-container/50 dark:bg-emerald-950 px-3 py-1 rounded-full border dark:border-emerald-700/50">
                  {srv.pricing}
                </span>
              </div>

              <h2 className="font-headline-sm text-2xl font-semibold text-on-surface dark:text-white">
                {srv.title}
              </h2>

              <p className="text-on-surface-variant dark:text-stone-300 text-sm leading-relaxed">
                {srv.description}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="font-label-caps text-xs uppercase tracking-wider text-primary dark:text-white font-bold">
                  Key Deliverables
                </h4>
                <ul className="space-y-1.5 text-sm text-on-surface-variant dark:text-stone-300">
                  {srv.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-sm">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleSelectService(srv.title)}
              className="w-full bg-primary text-on-primary dark:bg-white dark:text-black font-semibold py-3.5 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Inquire About {srv.title}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>

      {/* Process Workflow Section */}
      <div className="bg-surface-container-low dark:bg-neutral-900/80 p-8 md:p-12 rounded-2xl border border-outline-variant dark:border-white/15 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
            Working Process
          </span>
          <h2 className="font-headline-md text-3xl font-semibold text-on-surface dark:text-white">
            How We Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Discovery", desc: "Understanding your brand goals, target audience, and functional scope." },
            { step: "02", title: "Design Strategy", desc: "Crafting wireframes, typography tokens, and high-fidelity visual concepts." },
            { step: "03", title: "Development", desc: "Writing clean, modular React components and responsive CSS layouts." },
            { step: "04", title: "Launch & Handoff", desc: "Thorough testing, optimization, and seamless project deployment." }
          ].map((item, i) => (
            <div key={i} className="space-y-3 p-5 bg-surface dark:bg-neutral-800 rounded-xl border border-outline-variant dark:border-white/15">
              <span className="font-headline-md text-3xl font-bold text-secondary dark:text-emerald-400">{item.step}</span>
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface dark:text-white">{item.title}</h3>
              <p className="text-xs text-on-surface-variant dark:text-stone-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="font-headline-md text-3xl font-semibold text-center text-on-surface dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest dark:bg-neutral-900 rounded-xl border border-outline-variant dark:border-white/15 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full text-left p-5 font-headline-sm text-base font-semibold text-on-surface dark:text-white flex justify-between items-center"
              >
                {faq.q}
                <span className="material-symbols-outlined text-lg text-on-surface-variant dark:text-stone-300">
                  {activeFaq === i ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              {activeFaq === i && (
                <div className="px-5 pb-5 text-sm text-on-surface-variant dark:text-stone-300 border-t border-surface-variant/40 dark:border-white/15 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
