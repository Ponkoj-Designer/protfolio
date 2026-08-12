import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '../data/portfolioData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Initialize state from local persistent storage first for instant render
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('ponkoj_portfolio_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.personalInfo) {
          return parsed;
        }
      } catch (err) {
        console.error('Failed to parse saved portfolio data', err);
      }
    }
    return initialPortfolioData;
  });

  const [loaded, setLoaded] = useState(false);

  // On mount: fetch from production server database (JSONBin / db.json) and update state & localStorage
  useEffect(() => {
    const loadFromServer = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.personalInfo) {
            setData(json.data);
            try {
              localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(json.data));
            } catch (e) {}
            setLoaded(true);
            return;
          }
        }
      } catch (err) {
        console.warn('[DataContext] Server fetch failed, using cached state:', err.message);
      }
      setLoaded(true);
    };

    loadFromServer();
  }, []);

  // Persist dataset to React state, localStorage, AND server production database
  const persistDataset = async (newDataset) => {
    setData(newDataset);
    try {
      localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(newDataset));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }

    const token = localStorage.getItem('ponkoj_admin_token');
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ data: newDataset })
      });
    } catch (err) {
      console.error('[DataContext] Server persistence sync notice:', err.message);
    }
  };

  // Project CRUD Actions
  const addProject = (newProject) => {
    const p = { ...newProject, id: newProject.id || `proj-${Date.now()}`, year: newProject.year || String(new Date().getFullYear()) };
    persistDataset({ ...data, projects: [p, ...data.projects] });
  };

  const updateProject = (id, fields) =>
    persistDataset({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...fields } : p)) });

  const deleteProject = (id) =>
    persistDataset({ ...data, projects: data.projects.filter((p) => p.id !== id) });

  // Inbox & Messages Actions
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

  // Testimonials Actions
  const addTestimonial = (testimonial) =>
    persistDataset({ ...data, testimonials: [{ ...testimonial, id: `test-${Date.now()}` }, ...data.testimonials] });

  // Personal Info (includes cropped images, social links, contact, bio)
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

  // Reset to initial defaults ONLY when explicitly triggered by Admin button
  const resetToDefaultData = () => {
    localStorage.removeItem('ponkoj_portfolio_data');
    persistDataset(initialPortfolioData);
  };

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
