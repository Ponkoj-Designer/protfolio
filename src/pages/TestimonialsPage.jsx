import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Toast } from '../components/common/Toast';

export const TestimonialsPage = () => {
  const { testimonials, addTestimonial } = useData();

  const [ratingFilter, setRatingFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar: '',
    quote: '',
    rating: 5,
    project: ''
  });

  const filteredTestimonials = testimonials.filter((t) => {
    if (ratingFilter === '5') return t.rating === 5;
    return true;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;

    addTestimonial({
      ...formData,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    });

    setModalOpen(false);
    setToastMsg('Thank you! Your client review has been recorded.');
    setFormData({ name: '', role: '', company: '', avatar: '', quote: '', rating: 5, project: '' });
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 space-y-12">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-variant dark:border-white/15 pb-8">
        <div className="space-y-4 max-w-2xl">
          <span className="font-label-caps text-xs font-bold text-secondary dark:text-emerald-400 uppercase tracking-widest">
            Client Feedback & Endorsements
          </span>
          <h1 className="font-headline-md md:font-display-lg text-4xl md:text-6xl font-bold text-on-surface dark:text-white">
            What Collaborators & Clients Say
          </h1>
          <p className="text-on-surface-variant dark:text-stone-300 text-base leading-relaxed">
            Honest feedback from design directors, product managers, and founders on our collaborative journey.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-6 py-3.5 rounded font-label-caps text-xs uppercase tracking-wider magnetic-pull flex items-center gap-2 shadow-md w-fit"
        >
          <span className="material-symbols-outlined text-sm">rate_review</span>
          Submit A Review
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setRatingFilter('all')}
          className={`px-4 py-2 rounded-full font-label-caps text-xs uppercase ${
            ratingFilter === 'all'
              ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
              : 'bg-surface-container-low dark:bg-neutral-900 text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
          }`}
        >
          All Reviews ({testimonials.length})
        </button>
        <button
          onClick={() => setRatingFilter('5')}
          className={`px-4 py-2 rounded-full font-label-caps text-xs uppercase ${
            ratingFilter === '5'
              ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
              : 'bg-surface-container-low dark:bg-neutral-900 text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
          }`}
        >
          5-Star Reviews Only
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 hover-lift space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 dark:text-amber-400">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm icon-fill">star</span>
                  ))}
                </div>
                {item.project && (
                  <span className="text-[11px] font-label-caps bg-surface-container dark:bg-neutral-800 px-2.5 py-1 rounded text-on-surface-variant dark:text-stone-300 border dark:border-white/10">
                    {item.project}
                  </span>
                )}
              </div>

              <p className="text-on-surface dark:text-stone-200 italic text-sm leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-surface-variant/40 dark:border-white/15">
              <img
                src={item.avatar}
                alt={item.name}
                loading="eager"
                fetchPriority="low"
                decoding="async"
                className="w-12 h-12 rounded-full object-cover border border-outline-variant dark:border-white/20"
              />
              <div>
                <h4 className="font-label-sm font-bold text-on-surface dark:text-white text-sm">
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

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-neutral-900 max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl border border-outline-variant dark:border-white/20 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-white/15 pb-4">
              <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
                Leave Client Feedback
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant dark:text-stone-300 hover:text-primary dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Role/Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Design Director"
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Studio Vertex"
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Project Name</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  placeholder="e.g. E-Commerce Redesign"
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Rating (1 to 5 Stars)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value={5} className="bg-white dark:bg-neutral-900 text-black dark:text-white">5 Stars - Outstanding</option>
                  <option value={4} className="bg-white dark:bg-neutral-900 text-black dark:text-white">4 Stars - Great Work</option>
                  <option value={3} className="bg-white dark:bg-neutral-900 text-black dark:text-white">3 Stars - Good</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Review Quote *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Share your experience collaborating with Ponkoj..."
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-secondary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant dark:border-white/15">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded font-label-caps text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-bold rounded font-label-caps text-xs uppercase"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
