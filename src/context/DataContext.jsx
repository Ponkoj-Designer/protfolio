import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '../data/portfolioData';

const DataContext = createContext();

// Helper: Intelligently merge new dataset over existing data without overwriting custom user fields with empty/demo fallbacks
const mergeDatasets = (existingData, incomingData) => {
  if (!incomingData || !incomingData.personalInfo) return existingData || initialPortfolioData;

  const mergedPersonalInfo = {
    ...initialPortfolioData.personalInfo,
    ...(existingData?.personalInfo || {}),
    ...(incomingData.personalInfo || {})
  };

  // Preserve social links
  mergedPersonalInfo.socials = {
    ...initialPortfolioData.personalInfo.socials,
    ...(existingData?.personalInfo?.socials || {}),
    ...(incomingData.personalInfo?.socials || {})
  };

  // Preserve stats
  mergedPersonalInfo.stats = {
    ...initialPortfolioData.personalInfo.stats,
    ...(existingData?.personalInfo?.stats || {}),
    ...(incomingData.personalInfo?.stats || {})
  };

  return {
    ...initialPortfolioData,
    ...existingData,
    ...incomingData,
    personalInfo: mergedPersonalInfo,
    projects: incomingData.projects || existingData?.projects || initialPortfolioData.projects,
    services: incomingData.services || existingData?.services || initialPortfolioData.services,
    experience: incomingData.experience || existingData?.experience || initialPortfolioData.experience,
    skills: incomingData.skills || existingData?.skills || initialPortfolioData.skills,
    testimonials: incomingData.testimonials || existingData?.testimonials || initialPortfolioData.testimonials,
    inboxMessages: incomingData.inboxMessages || existingData?.inboxMessages || []
  };
};

export const DataProvider = ({ children }) => {
  // Initialize state from local persistent storage first
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('ponkoj_portfolio_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.personalInfo) {
          return mergeDatasets(initialPortfolioData, parsed);
        }
      } catch (err) {
        console.error('Failed to parse saved portfolio data', err);
      }
    }
    return initialPortfolioData;
  });

  // Fetch production database data from backend server on initial mount and merge cleanly
  useEffect(() => {
    const loadServerData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data && resData.data.personalInfo) {
            setData((prev) => {
              const merged = mergeDatasets(prev, resData.data);
              localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not connect to production server database on load (using cached state):', err);
      }
    };

    loadServerData();
  }, []);

  // Sync dataset changes permanently to backend server storage & local storage
  const persistDataset = (newDataset) => {
    setData(newDataset);
    try {
      localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(newDataset));
    } catch (e) {
      console.warn('localStorage save warning (quota or restricted):', e);
    }

    const token = localStorage.getItem('ponkoj_admin_token');
    fetch('/api/admin/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ data: newDataset })
    }).catch((err) => {
      console.warn('Backend server database sync notice:', err);
    });
  };

  // Project CRUD Actions
  const addProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: newProject.id || `proj-${Date.now()}`,
      year: newProject.year || new Date().getFullYear().toString()
    };
    const updated = {
      ...data,
      projects: [projectWithId, ...data.projects]
    };
    persistDataset(updated);
  };

  const updateProject = (id, updatedFields) => {
    const updated = {
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    };
    persistDataset(updated);
  };

  const deleteProject = (id) => {
    const updated = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id)
    };
    persistDataset(updated);
  };

  // Inbox & Messages Actions
  const addMessage = (msg) => {
    const newMsg = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      starred: false
    };
    const updated = {
      ...data,
      inboxMessages: [newMsg, ...(data.inboxMessages || [])]
    };
    persistDataset(updated);
    return newMsg;
  };

  const toggleMessageRead = (id) => {
    const updated = {
      ...data,
      inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    };
    persistDataset(updated);
  };

  const toggleMessageStarred = (id) => {
    const updated = {
      ...data,
      inboxMessages: (data.inboxMessages || []).map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    };
    persistDataset(updated);
  };

  const deleteMessage = (id) => {
    const updated = {
      ...data,
      inboxMessages: (data.inboxMessages || []).filter((m) => m.id !== id)
    };
    persistDataset(updated);
  };

  // Testimonials Actions
  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      ...testimonial,
      id: `test-${Date.now()}`
    };
    const updated = {
      ...data,
      testimonials: [newTestimonial, ...data.testimonials]
    };
    persistDataset(updated);
  };

  // Personal Info Update Action
  const updatePersonalInfo = (info) => {
    const updated = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        ...info,
        socials: {
          ...data.personalInfo.socials,
          ...(info.socials || {})
        },
        stats: {
          ...data.personalInfo.stats,
          ...(info.stats || {})
        }
      }
    };
    persistDataset(updated);
  };

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
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
