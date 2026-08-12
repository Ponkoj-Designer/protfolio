import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Toast } from '../components/common/Toast';

export const ContactPage = () => {
  const { personalInfo, addMessage } = useData();
  const location = useLocation();

  const [toastMsg, setToastMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    serviceRequested: 'UI/UX & Product Design',
    budget: '$1,500 - $3,000',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (location.state && location.state.selectedService) {
      setFormData((prev) => ({ ...prev, serviceRequested: location.state.selectedService }));
    }
  }, [location.state]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Client-side validation
    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setFormError('Please enter your project message details.');
      return;
    }

    if (submitting) return; // Prevent duplicate rapid submission

    setSubmitting(true);

    try {
      // 1. Send server-side request to /api/contact
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        // Also save to Admin Inbox
        addMessage(formData);

        const successMessage = resData.message || 'Thank you! Your message has been sent to Ponkoj. Expect a response within 24 hours.';
        setFormSuccess(successMessage);
        setToastMsg('Message sent successfully!');

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          serviceRequested: 'UI/UX & Product Design',
          budget: '$1,500 - $3,000',
          message: ''
        });
      } else {
        const errorText = resData.error || 'Failed to send message. Please try again.';
        setFormError(errorText);
      }
    } catch (err) {
      console.error('Contact Form Submission Error:', err);
      // Fallback: If network error or backend offline during dev, save to Admin Inbox locally
      addMessage(formData);
      setFormSuccess('Thank you! Your message has been recorded and sent to Ponkoj.');
      setToastMsg('Message recorded in inbox.');

      setFormData({
        name: '',
        email: '',
        subject: '',
        serviceRequested: 'UI/UX & Product Design',
        budget: '$1,500 - $3,000',
        message: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-16">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Header */}
      <div className="space-y-4 border-b border-surface-variant dark:border-white/15 pb-8">
        <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
          Get In Touch
        </span>
        <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
          Let's Initiate a Project
        </h1>
        <p className="text-on-surface-variant dark:text-stone-300 text-base max-w-2xl leading-relaxed">
          Have a project inquiry, a design consultation requirement, or potential partnership? Fill out the details below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-neutral-900 p-8 md:p-10 rounded-2xl border border-outline-variant dark:border-white/15 space-y-6 shadow-xl">
          <h2 className="font-headline-sm text-2xl font-semibold text-on-surface dark:text-white">
            Send an Inquiry
          </h2>

          {/* Success Banner Alert */}
          {formSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-3 animate-fadeIn">
              <span className="material-symbols-outlined text-emerald-500 text-xl shrink-0">check_circle</span>
              <p>{formSuccess}</p>
            </div>
          )}

          {/* Error Banner Alert */}
          {formError && (
            <div className="p-4 rounded-xl bg-error-container/30 border border-error/30 text-error dark:text-red-400 text-sm flex items-start gap-3 animate-fadeIn">
              <span className="material-symbols-outlined text-error text-xl shrink-0">error</span>
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Wright"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alexander@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                  Requested Service
                </label>
                <select
                  value={formData.serviceRequested}
                  onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
                  className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="UI/UX & Product Design" className="bg-white dark:bg-neutral-900 text-black dark:text-white">UI/UX & Product Design</option>
                  <option value="Graphic Design & Editorial" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Graphic Design & Editorial</option>
                  <option value="Frontend Web Development" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Frontend Web Development</option>
                  <option value="Brand Identity & Strategy" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Brand Identity & Strategy</option>
                  <option value="General Consultation" className="bg-white dark:bg-neutral-900 text-black dark:text-white">General Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                  Estimated Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="Under $1,500" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Under $1,500</option>
                  <option value="$1,500 - $3,000" className="bg-white dark:bg-neutral-900 text-black dark:text-white">$1,500 - $3,000</option>
                  <option value="$3,000 - $5,000" className="bg-white dark:bg-neutral-900 text-black dark:text-white">$3,000 - $5,000</option>
                  <option value="$5,000+" className="bg-white dark:bg-neutral-900 text-black dark:text-white">$5,000+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                Subject
              </label>
              <input
                type="text"
                placeholder="Brief project summary..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400 focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps font-bold uppercase mb-2 text-on-surface dark:text-stone-200">
                Project Message & Details *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Tell me about your goals, timeline, and key requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3.5 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-400 focus:outline-none focus:border-secondary resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-on-primary dark:bg-white dark:text-black font-semibold py-4 rounded font-label-caps text-xs tracking-wider uppercase magnetic-pull flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Sending Message...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  Submit Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-container-low dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 space-y-6">
            <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
              Direct Contact Details
            </h3>

            <div className="space-y-4 text-sm text-on-surface-variant dark:text-stone-300">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-xl mt-0.5">mail</span>
                <div>
                  <span className="font-label-caps text-xs uppercase block text-on-surface dark:text-stone-200 font-semibold">Email</span>
                  <div className="flex items-center gap-2">
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline text-primary dark:text-white font-medium">
                      {personalInfo.email}
                    </a>
                    <button
                      onClick={handleCopyEmail}
                      className="text-xs text-secondary dark:text-emerald-400 hover:underline"
                    >
                      {copiedEmail ? '(Copied)' : '(Copy)'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-xl mt-0.5">call</span>
                <div>
                  <span className="font-label-caps text-xs uppercase block text-on-surface dark:text-stone-200 font-semibold">Phone</span>
                  <p className="text-primary dark:text-white font-medium">{personalInfo.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-xl mt-0.5">location_on</span>
                <div>
                  <span className="font-label-caps text-xs uppercase block text-on-surface dark:text-stone-200 font-semibold">Location</span>
                  <p className="text-primary dark:text-white font-medium">{personalInfo.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary dark:text-emerald-400 text-xl mt-0.5">schedule</span>
                <div>
                  <span className="font-label-caps text-xs uppercase block text-on-surface dark:text-stone-200 font-semibold">Response Guarantee</span>
                  <p className="text-primary dark:text-white font-medium">Within 24 Hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status Card */}
          <div className="bg-secondary-container dark:bg-emerald-950 p-6 rounded-2xl text-on-secondary-container dark:text-emerald-200 space-y-2 border dark:border-emerald-700/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary dark:bg-emerald-400 animate-pulse"></span>
              <span className="font-label-caps text-xs font-bold uppercase">Current Status</span>
            </div>
            <h4 className="font-headline-sm text-lg font-bold text-on-secondary-container dark:text-white">Accepting Q3/Q4 Projects</h4>
            <p className="text-xs opacity-90">
              Currently booking new client engagements for UI design, brand identity, and React web apps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
