import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '../data/portfolioData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Pure Server Database Source of Truth
  const [data, setData] = useState(initialPortfolioData);
  const [loaded, setLoaded] = useState(false);

  // ── On mount: fetch latest portfolio data directly from persistent server database ──
  useEffect(() => {
    const loadFromServerDatabase = async () => {
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
        console.warn('[DataContext] Server database fetch error:', err.message);
      }
      setLoaded(true);
    };

    loadFromServerDatabase();
  }, []);

  // ── Persist dataset directly to production server database ───────────────────────
  const persistDataset = async (newDataset) => {
    const token = localStorage.getItem('ponkoj_admin_token');

    if (!token) {
      return { success: false, error: 'Authentication token missing. Please log in again.' };
    }

    try {
      const response = await fetch('/api/admin/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ data: newDataset })
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          setData(resJson.data);
          return { success: true, message: resJson.message || 'Saved permanently to production database.' };
        }
      }
      const errJson = await response.json().catch(() => ({}));
      return { success: false, error: errJson.error || 'Server database save failed.' };
    } catch (err) {
      console.error('[DataContext] Failed to persist dataset to production server database:', err.message);
      return { success: false, error: err.message || 'Server connection error.' };
    }
  };

  // Project CRUD Actions
  const addProject = async (newProject) => {
    const p = { ...newProject, id: newProject.id || `proj-${Date.now()}`, year: newProject.year || String(new Date().getFullYear()) };
    const updated = { ...data, projects: [p, ...data.projects] };
    return await persistDataset(updated);
  };

  const updateProject = async (id, fields) => {
    const updated = { ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...fields } : p)) };
    return await persistDataset(updated);
  };

  const deleteProject = async (id) => {
    const updated = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    return await persistDataset(updated);
  };

  // Inbox & Messages Actions
  const addMessage = async (msg) => {
    const newMsg = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      starred: false
    };
    const updated = { ...data, inboxMessages: [newMsg, ...(data.inboxMessages || [])] };
    await persistDataset(updated);
    return newMsg;
  };

  const toggleMessageRead = async (id) => {
    const updated = { ...data, inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, read: !m.read } : m)) };
    return await persistDataset(updated);
  };

  const toggleMessageStarred = async (id) => {
    const updated = { ...data, inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)) };
    return await persistDataset(updated);
  };

  const deleteMessage = async (id) => {
    const updated = { ...data, inboxMessages: (data.inboxMessages || []).filter((m) => m.id !== id) };
    return await persistDataset(updated);
  };

  // Testimonials Actions
  const addTestimonial = async (testimonial) => {
    const updated = { ...data, testimonials: [{ ...testimonial, id: `test-${Date.now()}` }, ...data.testimonials] };
    return await persistDataset(updated);
  };

  // Personal Info (includes cropped images, social links, contact info, bio, stats)
  const updatePersonalInfo = async (info) => {
    const updated = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        ...info,
        socials: { ...data.personalInfo.socials, ...(info.socials || {}) },
        stats: { ...data.personalInfo.stats, ...(info.stats || {}) }
      }
    };
    return await persistDataset(updated);
  };

  // Reset to initial defaults ONLY when explicitly triggered by Admin button
  const resetToDefaultData = async () => {
    return await persistDataset(initialPortfolioData);
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
