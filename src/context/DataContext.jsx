import React, { createContext, useContext, useEffect, useState } from 'react';
import { initialPortfolioData } from '../data/portfolioData';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('ponkoj_portfolio_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.personalInfo) {
          if (!parsed.personalInfo.email || parsed.personalInfo.email === 'contact@ponkojdas.com') {
            parsed.personalInfo.email = 'ponkojdas6586@gmail.com';
          }
          if (!parsed.personalInfo.phone || parsed.personalInfo.phone === '+880 1700-000000') {
            parsed.personalInfo.phone = '+8801741783521';
          }
        }
        return parsed;
      } catch (err) {
        console.error('Failed to parse saved portfolio data', err);
      }
    }
    return initialPortfolioData;
  });

  // Fetch production database data from backend server on initial mount
  useEffect(() => {
    const loadServerData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const resData = await res.json();
          if (resData.success && resData.data) {
            setData(resData.data);
            localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(resData.data));
          }
        }
      } catch (err) {
        console.warn('Could not connect to production server database on load (using cached state):', err);
      }
    };

    loadServerData();
  }, []);

  // Sync dataset changes to backend server storage & localStorage
  const persistDataset = (newDataset) => {
    setData(newDataset);
    localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(newDataset));

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
      personalInfo: { ...data.personalInfo, ...info }
    };
    persistDataset(updated);
  };

  // Reset to initial defaults
  const resetToDefaultData = () => {
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
