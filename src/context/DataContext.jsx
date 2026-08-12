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
          // Auto-migrate stale email & phone to updated values if old placeholders were cached
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

  useEffect(() => {
    localStorage.setItem('ponkoj_portfolio_data', JSON.stringify(data));
  }, [data]);

  // Project CRUD Actions
  const addProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: newProject.id || `proj-${Date.now()}`,
      year: newProject.year || new Date().getFullYear().toString()
    };
    setData((prev) => ({
      ...prev,
      projects: [projectWithId, ...prev.projects]
    }));
  };

  const updateProject = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    }));
  };

  const deleteProject = (id) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
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
    setData((prev) => ({
      ...prev,
      inboxMessages: [newMsg, ...(prev.inboxMessages || [])]
    }));
    return newMsg;
  };

  const toggleMessageRead = (id) => {
    setData((prev) => ({
      ...prev,
      inboxMessages: prev.inboxMessages.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    }));
  };

  const toggleMessageStarred = (id) => {
    setData((prev) => ({
      ...prev,
      inboxMessages: prev.inboxMessages.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    }));
  };

  const deleteMessage = (id) => {
    setData((prev) => ({
      ...prev,
      inboxMessages: prev.inboxMessages.filter((m) => m.id !== id)
    }));
  };

  // Testimonials Actions
  const addTestimonial = (testimonial) => {
    const newTestimonial = {
      ...testimonial,
      id: `test-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      testimonials: [newTestimonial, ...prev.testimonials]
    }));
  };

  // Personal Info Update Action
  const updatePersonalInfo = (info) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info }
    }));
  };

  // Reset to initial defaults
  const resetToDefaultData = () => {
    setData(initialPortfolioData);
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
