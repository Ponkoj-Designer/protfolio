import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '../data/portfolioData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Start with initial defaults — server is the source of truth
  const [data, setData] = useState(initialPortfolioData);
  const [loaded, setLoaded] = useState(false);

  // ── On mount: fetch from server (JSONBin) — the single global source of truth ──
  useEffect(() => {
    const loadFromServer = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.personalInfo) {
            setData(json.data);
            setLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.warn('[DataContext] Server fetch failed, using initial data:', err.message);
      }
      // Server not available (first deploy before any save) — use initial defaults
      setLoaded(true);
    };

    loadFromServer();
  }, []);

  // ── Persist to server (JSONBin) immediately on every Admin change ──────────────
  const persistDataset = async (newDataset) => {
    setData(newDataset);

    const token = localStorage.getItem('ponkoj_admin_token');
    if (!token) return;

    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: newDataset })
      });
    } catch (err) {
      console.error('[DataContext] Failed to persist to server:', err.message);
    }
  };

  // ── Project CRUD ───────────────────────────────────────────────────────────────
  const addProject = (newProject) => {
    const p = { ...newProject, id: newProject.id || `proj-${Date.now()}`, year: newProject.year || String(new Date().getFullYear()) };
    persistDataset({ ...data, projects: [p, ...data.projects] });
  };

  const updateProject = (id, fields) =>
    persistDataset({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...fields } : p)) });

  const deleteProject = (id) =>
    persistDataset({ ...data, projects: data.projects.filter((p) => p.id !== id) });

  // ── Inbox / Messages ───────────────────────────────────────────────────────────
  const addMessage = (msg) => {
    const newMsg = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      starred: false
    };
    persistDataset({ ...data, inboxMessages: [newMsg, ...(data.inboxMessages || [])] });
    return newMsg;
  };

  const toggleMessageRead = (id) =>
    persistDataset({ ...data, inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, read: !m.read } : m)) });

  const toggleMessageStarred = (id) =>
    persistDataset({ ...data, inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)) });

  const deleteMessage = (id) =>
    persistDataset({ ...data, inboxMessages: (data.inboxMessages || []).filter((m) => m.id !== id) });

  // ── Testimonials ───────────────────────────────────────────────────────────────
  const addTestimonial = (testimonial) =>
    persistDataset({ ...data, testimonials: [{ ...testimonial, id: `test-${Date.now()}` }, ...data.testimonials] });

  // ── Personal Info (includes images, socials, contact, bio) ────────────────────
  const updatePersonalInfo = (info) =>
    persistDataset({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        ...info,
        socials: { ...data.personalInfo.socials, ...(info.socials || {}) },
        stats: { ...data.personalInfo.stats, ...(info.stats || {}) }
      }
    });

  // ── Reset (only on explicit admin button press) ────────────────────────────────
  const resetToDefaultData = () => persistDataset(initialPortfolioData);

  return (
    <DataContext.Provider
      value={{
        personalInfo: data.personalInfo,
        projects: data.projects,
        services: data.services,
        experience: data.experience,
        skills: data.skills,
        testimonials: data.testimonials,
        inboxMessages: data.inboxMessages || [],
        dataLoaded: loaded,
        addProject,
        updateProject,
        deleteProject,
        addMessage,
        toggleMessageRead,
        toggleMessageStarred,
        deleteMessage,
        addTestimonial,
        updatePersonalInfo,
        resetToDefaultData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
};
