import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/common/Toast';
import { ImageUploadModal } from '../components/common/ImageUploadModal';

export const AdminPage = () => {
  const {
    personalInfo,
    projects,
    inboxMessages,
    testimonials,
    addProject,
    updateProject,
    deleteProject,
    toggleMessageRead,
    toggleMessageStarred,
    deleteMessage,
    addTestimonial,
    updatePersonalInfo,
    resetToDefaultData
  } = useData();
  const { logout, authToken } = useAuth();

  const [activeTab, setActiveTab] = useState('media'); // 'media', 'overview', 'projects', 'inbox', 'profile', 'email'
  const [toastMsg, setToastMsg] = useState('');

  // Email Server Configuration State
  const [emailConfigData, setEmailConfigData] = useState({
    recipientEmail: 'ponkojdas6586@gmail.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: 'ponkojdas6586@gmail.com',
    smtpPass: '',
    web3FormsKey: ''
  });
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState('');
  const [emailTestError, setEmailTestError] = useState('');

  React.useEffect(() => {
    if (authToken) {
      fetch('/api/admin/email-config', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.config) {
            setEmailConfigData((prev) => ({
              ...prev,
              recipientEmail: data.config.recipientEmail || prev.recipientEmail,
              smtpHost: data.config.smtpHost || prev.smtpHost,
              smtpPort: data.config.smtpPort || prev.smtpPort,
              smtpUser: data.config.smtpUser || prev.smtpUser,
              web3FormsKey: data.config.web3FormsKey || ''
            }));
          }
        })
        .catch(() => {});
    }
  }, [authToken]);

  const handleSaveEmailConfig = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/email-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(emailConfigData)
      });
      const data = await res.json();
      if (data.success) {
        setToastMsg('Email server configuration saved!');
      } else {
        setToastMsg(`Failed: ${data.error}`);
      }
    } catch (err) {
      setToastMsg('Failed to update email configuration.');
    }
  };

  const handleSendTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestResult('');
    setEmailTestError('');

    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ testEmail: emailConfigData.recipientEmail })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailTestResult(data.message || `Test email delivered successfully to ${emailConfigData.recipientEmail}!`);
        setToastMsg('Test email sent successfully!');
      } else {
        setEmailTestError(data.error || 'Failed to deliver test email.');
      }
    } catch (err) {
      setEmailTestError('Error contacting email test API endpoint.');
    } finally {
      setTestingEmail(false);
    }
  };

  // Universal Crop Modal Control
  const [cropperState, setCropperState] = useState({
    isOpen: false,
    title: 'Upload & Crop Image',
    currentImage: '',
    aspectRatio: '4:5',
    onSaveCallback: null
  });

  // Project Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: 'UI/UX Design',
    shortDescription: '',
    fullDescription: '',
    client: '',
    year: '2025',
    thumbnail: '',
    heroImage: '',
    gallery: [],
    tags: 'UI/UX, Web Design',
    featured: true
  });

  // Profile Edit Form State
  const [profileFormData, setProfileFormData] = useState({
    name: personalInfo.name,
    title: personalInfo.title,
    tagline: personalInfo.tagline,
    bio: personalInfo.bio,
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    availability: personalInfo.availability,
    heroImage: personalInfo.heroImage,
    aboutImage: personalInfo.aboutImage || personalInfo.heroImage,
    adminAvatar: personalInfo.adminAvatar || personalInfo.heroImage,
    socials: {
      facebook: personalInfo.socials?.facebook || 'https://facebook.com',
      instagram: personalInfo.socials?.instagram || 'https://instagram.com',
      linkedin: personalInfo.socials?.linkedin || 'https://linkedin.com',
      github: personalInfo.socials?.github || 'https://github.com',
      dribbble: personalInfo.socials?.dribbble || 'https://dribbble.com'
    },
    projectsCompleted: personalInfo.stats.projectsCompleted,
    happyClients: personalInfo.stats.happyClients,
    yearsExperience: personalInfo.stats.yearsExperience
  });

  // Trigger Crop Modal Helper
  const triggerCropper = ({ title, currentImage, aspectRatio, onSave }) => {
    setCropperState({
      isOpen: true,
      title,
      currentImage,
      aspectRatio,
      onSaveCallback: onSave
    });
  };

  // Open Project Add Modal
  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectFormData({
      title: '',
      category: 'UI/UX Design',
      shortDescription: '',
      fullDescription: '',
      client: '',
      year: '2025',
      thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZcJsniiLEsvlnkht-UJyO0b0G0a_JPGLlbfDs0NXM5Z42RJa4caagDv-elIHO9CM2_yL_8TJisVHnEJ65IfIZsB2ryXxiz5DtGb-P_09gfnWpVxVguCBzASTt9D9D6KSd7quiDFU-S3m_AzTYHMyxYxom1IkYkdl0eVDLYzjJQL9PrXC9Ft_lBmVS-RFM3hcvy3Zwm1V4Nmo2b5J63FLx7HHTiOfvTD7jO0RWWozsw8LYCgmgyXmb4Q',
      heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZcJsniiLEsvlnkht-UJyO0b0G0a_JPGLlbfDs0NXM5Z42RJa4caagDv-elIHO9CM2_yL_8TJisVHnEJ65IfIZsB2ryXxiz5DtGb-P_09gfnWpVxVguCBzASTt9D9D6KSd7quiDFU-S3m_AzTYHMyxYxom1IkYkdl0eVDLYzjJQL9PrXC9Ft_lBmVS-RFM3hcvy3Zwm1V4Nmo2b5J63FLx7HHTiOfvTD7jO0RWWozsw8LYCgmgyXmb4Q',
      gallery: [],
      tags: 'UI/UX, Web Design',
      featured: true
    });
    setProjectModalOpen(true);
  };

  // Open Project Edit Modal
  const handleOpenEditProject = (proj) => {
    setEditingProjectId(proj.id);
    setProjectFormData({
      title: proj.title,
      category: proj.category,
      shortDescription: proj.shortDescription,
      fullDescription: proj.fullDescription || proj.shortDescription,
      client: proj.client,
      year: proj.year,
      thumbnail: proj.thumbnail,
      heroImage: proj.heroImage || proj.thumbnail,
      gallery: proj.gallery || [],
      tags: proj.tags ? proj.tags.join(', ') : '',
      featured: proj.featured
    });
    setProjectModalOpen(true);
  };

  // Add Gallery Image Item
  const handleAddGalleryImage = () => {
    triggerCropper({
      title: 'Upload & Crop Gallery Image',
      currentImage: '',
      aspectRatio: '16:9',
      onSave: (croppedDataUrl) => {
        setProjectFormData((prev) => ({
          ...prev,
          gallery: [...prev.gallery, croppedDataUrl]
        }));
        setToastMsg('Gallery image added!');
      }
    });
  };

  // Remove Gallery Image Item
  const handleRemoveGalleryImage = (index) => {
    setProjectFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  // Save Project Form
  const handleSaveProject = (e) => {
    e.preventDefault();
    const formattedProject = {
      ...projectFormData,
      tags: typeof projectFormData.tags === 'string'
        ? projectFormData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : projectFormData.tags
    };

    if (editingProjectId) {
      updateProject(editingProjectId, formattedProject);
      setToastMsg('Project updated successfully!');
    } else {
      addProject(formattedProject);
      setToastMsg('New project added successfully!');
    }

    setProjectModalOpen(false);
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      setToastMsg('Project deleted.');
    }
  };

  // Save Profile Info
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updatePersonalInfo({
      name: profileFormData.name,
      title: profileFormData.title,
      tagline: profileFormData.tagline,
      bio: profileFormData.bio,
      email: profileFormData.email,
      phone: profileFormData.phone,
      location: profileFormData.location,
      availability: profileFormData.availability,
      heroImage: profileFormData.heroImage,
      aboutImage: profileFormData.aboutImage,
      adminAvatar: profileFormData.adminAvatar,
      socials: profileFormData.socials,
      stats: {
        projectsCompleted: Number(profileFormData.projectsCompleted),
        happyClients: Number(profileFormData.happyClients),
        yearsExperience: Number(profileFormData.yearsExperience)
      }
    });
    setToastMsg('Profile information & site images updated live!');
  };

  const unreadMessagesCount = inboxMessages.filter((m) => !m.read).length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-surface dark:bg-black text-on-surface dark:text-white">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-surface-container-low dark:bg-neutral-900 border-b lg:border-b-0 lg:border-r border-outline-variant dark:border-white/15 shrink-0 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <img
              src={personalInfo.adminAvatar || personalInfo.heroImage}
              alt="Admin Avatar"
              className="w-12 h-12 rounded-full object-cover border border-outline-variant dark:border-white/20"
            />
            <button
              onClick={() => triggerCropper({
                title: 'Upload & Crop Admin Avatar',
                currentImage: personalInfo.adminAvatar || personalInfo.heroImage,
                aspectRatio: '1:1',
                onSave: (croppedDataUrl) => {
                  setProfileFormData((prev) => ({ ...prev, adminAvatar: croppedDataUrl }));
                  updatePersonalInfo({ adminAvatar: croppedDataUrl });
                  setToastMsg('Admin avatar updated live!');
                }
              })}
              className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] transition-opacity"
              title="Crop & Replace Avatar"
            >
              <span className="material-symbols-outlined text-xs">edit</span>
            </button>
          </div>
          <div>
            <h2 className="font-headline-sm text-lg font-bold text-primary dark:text-white">
              {personalInfo.name}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-stone-300 font-label-caps">
              Portfolio Admin Portal
            </p>
          </div>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto font-label-sm text-xs font-semibold">
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'media'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">photo_library</span>
            Site Media & Photos
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Overview
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'projects'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">work</span>
            Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'inbox'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-lg">inbox</span>
              Inbox
            </div>
            {unreadMessagesCount > 0 && (
              <span className="bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Profile Settings
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === 'email'
                ? 'bg-primary text-on-primary dark:bg-white dark:text-black font-bold'
                : 'text-on-surface-variant dark:text-stone-300 hover:bg-surface-container dark:hover:bg-neutral-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">mail</span>
            Email Server & SMTP
          </button>
        </nav>

        <div className="pt-6 border-t border-outline-variant dark:border-white/15 space-y-2">
          <button
            onClick={() => {
              logout();
            }}
            className="w-full text-left px-4 py-2.5 bg-error-container/30 text-error dark:text-red-400 rounded flex items-center gap-2 font-label-caps text-xs uppercase font-bold hover:bg-error dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out Admin
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all portfolio data to initial defaults?')) {
                resetToDefaultData();
                setToastMsg('Data reset to default.');
              }
            }}
            className="w-full text-left px-4 py-2 text-xs text-on-surface-variant dark:text-stone-400 hover:bg-surface-container rounded flex items-center gap-2 font-medium"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 lg:p-10 space-y-8 overflow-y-auto">
        {/* SITE MEDIA MANAGER TAB */}
        {activeTab === 'media' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
                Site Media & Photos Manager
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-stone-300">
                Upload, replace, crop, and resize images across all sections of the website.
              </p>
            </div>

            {/* Main Section Photos (Hero, About, Avatar) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Hero Photo Card */}
              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-5 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 shadow-sm">
                <div>
                  <span className="text-xs font-label-caps font-bold uppercase text-secondary dark:text-emerald-400">Homepage</span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">Hero Section Portrait</h3>
                </div>
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800 border dark:border-white/10 relative">
                  <img src={personalInfo.heroImage} alt="Hero" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => triggerCropper({
                    title: 'Crop & Resize Hero Photo',
                    currentImage: personalInfo.heroImage,
                    aspectRatio: '4:5',
                    onSave: (croppedDataUrl) => {
                      setProfileFormData((prev) => ({ ...prev, heroImage: croppedDataUrl }));
                      updatePersonalInfo({ heroImage: croppedDataUrl });
                      setToastMsg('Hero Section photo updated!');
                    }
                  })}
                  className="w-full bg-primary text-on-primary dark:bg-white dark:text-black py-2.5 rounded font-label-caps text-xs font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">crop</span>
                  Upload & Crop Hero Photo
                </button>
              </div>

              {/* About Photo Card */}
              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-5 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 shadow-sm">
                <div>
                  <span className="text-xs font-label-caps font-bold uppercase text-secondary dark:text-emerald-400">About Page</span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">Studio Portrait Photo</h3>
                </div>
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800 border dark:border-white/10 relative">
                  <img src={personalInfo.aboutImage || personalInfo.heroImage} alt="About" className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => triggerCropper({
                    title: 'Crop & Resize About Photo',
                    currentImage: personalInfo.aboutImage || personalInfo.heroImage,
                    aspectRatio: '4:5',
                    onSave: (croppedDataUrl) => {
                      setProfileFormData((prev) => ({ ...prev, aboutImage: croppedDataUrl }));
                      updatePersonalInfo({ aboutImage: croppedDataUrl });
                      setToastMsg('About Me section photo updated!');
                    }
                  })}
                  className="w-full bg-primary text-on-primary dark:bg-white dark:text-black py-2.5 rounded font-label-caps text-xs font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">crop</span>
                  Upload & Crop About Photo
                </button>
              </div>

              {/* Avatar Photo Card */}
              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-5 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 shadow-sm">
                <div>
                  <span className="text-xs font-label-caps font-bold uppercase text-secondary dark:text-emerald-400">Global Admin</span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface dark:text-white">Profile Avatar</h3>
                </div>
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800 border dark:border-white/10 flex items-center justify-center p-4">
                  <img src={personalInfo.adminAvatar || personalInfo.heroImage} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-2 border-primary dark:border-white/30" />
                </div>
                <button
                  onClick={() => triggerCropper({
                    title: 'Crop & Resize Avatar',
                    currentImage: personalInfo.adminAvatar || personalInfo.heroImage,
                    aspectRatio: '1:1',
                    onSave: (croppedDataUrl) => {
                      setProfileFormData((prev) => ({ ...prev, adminAvatar: croppedDataUrl }));
                      updatePersonalInfo({ adminAvatar: croppedDataUrl });
                      setToastMsg('Admin avatar photo updated!');
                    }
                  })}
                  className="w-full bg-primary text-on-primary dark:bg-white dark:text-black py-2.5 rounded font-label-caps text-xs font-bold uppercase flex items-center justify-center gap-2 hover:opacity-90 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">crop</span>
                  Upload & Crop Avatar
                </button>
              </div>
            </div>

            {/* Project Thumbnails & Banners Quick Media List */}
            <div className="space-y-4 pt-4 border-t border-surface-variant dark:border-white/15">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
                    Project Case Study Media
                  </h3>
                  <p className="text-xs text-on-surface-variant dark:text-stone-300">
                    Upload and crop thumbnails and hero banners for every project card.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-surface-container-lowest dark:bg-neutral-900 p-5 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800 border dark:border-white/10 relative">
                        <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-headline-sm text-base font-bold text-on-surface dark:text-white">{proj.title}</h4>
                        <span className="text-[11px] font-label-caps text-secondary dark:text-emerald-400 font-bold">{proj.category}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-surface-variant/40 dark:border-white/10">
                      <button
                        onClick={() => triggerCropper({
                          title: `Crop Thumbnail: ${proj.title}`,
                          currentImage: proj.thumbnail,
                          aspectRatio: '16:9',
                          onSave: (croppedDataUrl) => {
                            updateProject(proj.id, { thumbnail: croppedDataUrl });
                            setToastMsg('Project thumbnail updated!');
                          }
                        })}
                        className="flex-1 py-2 bg-primary text-on-primary dark:bg-white dark:text-black text-xs font-label-caps font-bold uppercase rounded flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">crop</span>
                        Crop Thumbnail
                      </button>
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="px-3 py-2 border border-outline-variant dark:border-white/20 text-xs font-label-caps font-bold uppercase rounded text-on-surface dark:text-white"
                      >
                        Edit Media
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
                Dashboard Overview
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-stone-300">
                Live metrics and status of your portfolio web platform.
              </p>
            </div>

            {/* Stats Cards Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
                <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase font-semibold">Total Projects</span>
                <p className="font-headline-md text-3xl font-bold text-primary dark:text-white">{projects.length}</p>
                <p className="text-xs text-secondary dark:text-emerald-400 font-semibold">{projects.filter((p) => p.featured).length} Featured</p>
              </div>

              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
                <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase font-semibold">Inbox Messages</span>
                <p className="font-headline-md text-3xl font-bold text-primary dark:text-white">{inboxMessages.length}</p>
                <p className="text-xs text-error dark:text-red-400 font-semibold">{unreadMessagesCount} Unread</p>
              </div>

              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
                <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase font-semibold">Completed Work</span>
                <p className="font-headline-md text-3xl font-bold text-primary dark:text-white">{personalInfo.stats.projectsCompleted}+</p>
                <p className="text-xs text-secondary dark:text-emerald-400 font-semibold">Verified</p>
              </div>

              <div className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-2">
                <span className="font-label-caps text-xs text-on-surface-variant dark:text-stone-400 uppercase font-semibold">Experience</span>
                <p className="font-headline-md text-3xl font-bold text-primary dark:text-white">{personalInfo.stats.yearsExperience} Yrs</p>
                <p className="text-xs text-secondary dark:text-emerald-400 font-semibold">Active</p>
              </div>
            </div>

            {/* Quick Recent Messages */}
            <div className="space-y-4">
              <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
                Recent Contact Messages
              </h3>
              <div className="space-y-3">
                {inboxMessages.slice(0, 3).map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border border-outline-variant dark:border-white/15 flex items-center justify-between gap-4 ${
                      msg.read ? 'bg-surface-container-low dark:bg-neutral-900' : 'bg-surface-container-lowest dark:bg-neutral-800 font-semibold border-l-4 border-l-secondary dark:border-l-emerald-400'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-on-surface dark:text-white">{msg.name} ({msg.email})</p>
                      <p className="text-xs text-on-surface-variant dark:text-stone-300">{msg.subject || 'Project Inquiry'}</p>
                    </div>
                    <span className="text-xs text-on-surface-variant dark:text-stone-400 font-medium">{msg.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-surface-variant dark:border-white/15 pb-4">
              <div>
                <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
                  Manage Projects & Case Studies
                </h1>
                <p className="text-sm text-on-surface-variant dark:text-stone-300">
                  Add, edit, or remove work case studies and crop project images live.
                </p>
              </div>

              <button
                onClick={handleOpenAddProject}
                className="bg-primary text-on-primary dark:bg-white dark:text-black font-semibold px-5 py-2.5 rounded font-label-caps text-xs uppercase flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-surface-container-lowest dark:bg-neutral-900 p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/9] rounded-xl overflow-hidden bg-surface-container dark:bg-neutral-800 border dark:border-white/10">
                      <img src={proj.thumbnail} alt={proj.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-label-caps text-secondary dark:text-emerald-400 font-bold">
                        {proj.category}
                      </span>
                      {proj.featured && (
                        <span className="text-[10px] bg-secondary-container dark:bg-emerald-950 text-on-secondary-container dark:text-emerald-200 px-2 py-0.5 rounded font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {proj.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-variant/40 dark:border-white/15">
                    <button
                      onClick={() => handleOpenEditProject(proj)}
                      className="px-4 py-2 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded text-xs font-label-caps uppercase hover:bg-surface-container dark:hover:bg-neutral-800"
                    >
                      Edit Project & Images
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="px-4 py-2 bg-error dark:bg-red-600 text-on-error dark:text-white rounded text-xs font-label-caps uppercase font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INBOX TAB */}
        {activeTab === 'inbox' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-surface-variant dark:border-white/15 pb-4">
              <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
                Message Inbox
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-stone-300">
                Client inquiries submitted via the contact form.
              </p>
            </div>

            <div className="space-y-4">
              {inboxMessages.length > 0 ? (
                inboxMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl border border-outline-variant dark:border-white/15 space-y-4 ${
                      msg.read ? 'bg-surface-container-low dark:bg-neutral-900' : 'bg-surface-container-lowest dark:bg-neutral-800 border-l-4 border-l-secondary dark:border-l-emerald-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-variant/40 dark:border-white/15 pb-3">
                      <div>
                        <h4 className="font-label-sm font-bold text-base text-on-surface dark:text-white">
                          {msg.name} <span className="text-xs font-normal text-on-surface-variant dark:text-stone-300">({msg.email})</span>
                        </h4>
                        <p className="text-xs text-secondary dark:text-emerald-400 font-semibold">
                          Service Requested: {msg.serviceRequested || 'General'} | Budget: {msg.budget || 'N/A'}
                        </p>
                      </div>
                      <span className="text-xs text-on-surface-variant dark:text-stone-400">{msg.date}</span>
                    </div>

                    <p className="text-sm text-on-surface dark:text-stone-200 leading-relaxed">
                      "{msg.message}"
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        onClick={() => toggleMessageRead(msg.id)}
                        className="text-xs font-label-caps uppercase px-3 py-1.5 border border-outline-variant dark:border-white/20 text-on-surface dark:text-white rounded"
                      >
                        {msg.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="text-xs font-label-caps uppercase px-3 py-1.5 bg-error dark:bg-red-600 text-on-error dark:text-white rounded font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-on-surface-variant dark:text-stone-400">No messages in inbox.</div>
              )}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div className="border-b border-surface-variant dark:border-white/15 pb-4">
              <h1 className="font-headline-md text-3xl font-bold text-on-surface dark:text-white">
                Profile Settings
              </h1>
              <p className="text-sm text-on-surface-variant dark:text-stone-300">
                Update your biography, title, and website stats.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Full Name</label>
                <input
                  type="text"
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Title</label>
                <input
                  type="text"
                  value={profileFormData.title}
                  onChange={(e) => setProfileFormData({ ...profileFormData, title: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Tagline</label>
                <input
                  type="text"
                  value={profileFormData.tagline}
                  onChange={(e) => setProfileFormData({ ...profileFormData, tagline: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Bio</label>
                <textarea
                  rows={3}
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Email Address</label>
                  <input
                    type="email"
                    value={profileFormData.email || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Phone Number</label>
                  <input
                    type="text"
                    value={profileFormData.phone || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Location / Timezone</label>
                  <input
                    type="text"
                    value={profileFormData.location || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, location: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Availability Status</label>
                  <input
                    type="text"
                    value={profileFormData.availability || ''}
                    onChange={(e) => setProfileFormData({ ...profileFormData, availability: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
              </div>

              {/* Social Media Profiles Section */}
              <div className="space-y-4 pt-2 border-t border-surface-variant dark:border-white/15">
                <h3 className="font-headline-sm text-base font-bold text-on-surface dark:text-white">
                  Social Media Links (Footer & Public Profile)
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Facebook Profile URL</label>
                    <input
                      type="url"
                      value={profileFormData.socials?.facebook || ''}
                      onChange={(e) => setProfileFormData({
                        ...profileFormData,
                        socials: { ...profileFormData.socials, facebook: e.target.value }
                      })}
                      placeholder="https://facebook.com/your-profile"
                      className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Instagram Profile URL</label>
                    <input
                      type="url"
                      value={profileFormData.socials?.instagram || ''}
                      onChange={(e) => setProfileFormData({
                        ...profileFormData,
                        socials: { ...profileFormData.socials, instagram: e.target.value }
                      })}
                      placeholder="https://instagram.com/your-profile"
                      className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={profileFormData.socials?.linkedin || ''}
                      onChange={(e) => setProfileFormData({
                        ...profileFormData,
                        socials: { ...profileFormData.socials, linkedin: e.target.value }
                      })}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Projects Count</label>
                  <input
                    type="number"
                    value={profileFormData.projectsCompleted}
                    onChange={(e) => setProfileFormData({ ...profileFormData, projectsCompleted: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Clients Count</label>
                  <input
                    type="number"
                    value={profileFormData.happyClients}
                    onChange={(e) => setProfileFormData({ ...profileFormData, happyClients: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Years Exp</label>
                  <input
                    type="number"
                    value={profileFormData.yearsExperience}
                    onChange={(e) => setProfileFormData({ ...profileFormData, yearsExperience: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary text-on-primary dark:bg-white dark:text-black font-bold px-6 py-3 rounded font-label-caps text-xs uppercase"
              >
                Save Profile Updates
              </button>
            </form>
          </div>
        )}

        {/* EMAIL SERVER & SMTP CONFIGURATION TAB */}
        {activeTab === 'email' && (
          <div className="bg-surface-container-lowest dark:bg-neutral-900 p-8 rounded-2xl border border-outline-variant dark:border-white/15 space-y-6 max-w-3xl animate-fadeIn">
            <div>
              <h2 className="font-headline-sm text-2xl font-bold text-on-surface dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary dark:text-emerald-400">mark_email_read</span>
                Email Server & Delivery Configuration
              </h2>
              <p className="text-xs text-on-surface-variant dark:text-stone-300 mt-1">
                Configure your live SMTP email delivery credentials so visitor inquiries on the Contact Form reach your email inbox at <strong className="text-primary dark:text-white">{emailConfigData.recipientEmail}</strong>.
              </p>
            </div>

            {/* Test Email Success Alert */}
            {emailTestResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0">check_circle</span>
                <span>{emailTestResult}</span>
              </div>
            )}

            {/* Test Email Error Alert */}
            {emailTestError && (
              <div className="p-4 rounded-xl bg-error-container/30 border border-error/30 text-error dark:text-red-400 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="material-symbols-outlined text-error text-lg shrink-0">error</span>
                <span>{emailTestError}</span>
              </div>
            )}

            <form onSubmit={handleSaveEmailConfig} className="space-y-5">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">
                  Target Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailConfigData.recipientEmail}
                  onChange={(e) => setEmailConfigData({ ...emailConfigData, recipientEmail: e.target.value })}
                  placeholder="ponkojdas6586@gmail.com"
                  className="w-full p-3 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">
                    SMTP Host / Server
                  </label>
                  <input
                    type="text"
                    required
                    value={emailConfigData.smtpHost}
                    onChange={(e) => setEmailConfigData({ ...emailConfigData, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="w-full p-3 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    required
                    value={emailConfigData.smtpPort}
                    onChange={(e) => setEmailConfigData({ ...emailConfigData, smtpPort: e.target.value })}
                    placeholder="587"
                    className="w-full p-3 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">
                  SMTP Username (Sender Email)
                </label>
                <input
                  type="email"
                  required
                  value={emailConfigData.smtpUser}
                  onChange={(e) => setEmailConfigData({ ...emailConfigData, smtpUser: e.target.value })}
                  placeholder="ponkojdas6586@gmail.com"
                  className="w-full p-3 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">
                  Gmail App Password / SMTP Password
                </label>
                <input
                  type="password"
                  value={emailConfigData.smtpPass}
                  onChange={(e) => setEmailConfigData({ ...emailConfigData, smtpPass: e.target.value })}
                  placeholder="Enter 16-character Gmail App Password..."
                  className="w-full p-3 bg-surface-container-low dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
                <p className="text-[11px] text-on-surface-variant dark:text-stone-400 mt-1">
                  💡 For Gmail: Generate a 16-character App Password at <em>Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords</em>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-surface-variant dark:border-white/15">
                <button
                  type="submit"
                  className="bg-primary text-on-primary dark:bg-white dark:text-black font-bold px-6 py-3 rounded font-label-caps text-xs uppercase"
                >
                  Save Email Configuration
                </button>

                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={testingEmail}
                  className="bg-secondary text-on-secondary dark:bg-emerald-400 dark:text-black font-bold px-6 py-3 rounded font-label-caps text-xs uppercase flex items-center gap-2 disabled:opacity-50"
                >
                  {testingEmail ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      Sending Test...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">send</span>
                      Send Test Email to {emailConfigData.recipientEmail}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* PROJECT ADD/EDIT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface dark:bg-neutral-900 max-w-2xl w-full rounded-2xl p-8 space-y-6 shadow-2xl border border-outline-variant dark:border-white/20 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-variant dark:border-white/15 pb-4">
              <h3 className="font-headline-sm text-xl font-bold text-on-surface dark:text-white">
                {editingProjectId ? 'Edit Project & Media' : 'Add New Project'}
              </h3>
              <button onClick={() => setProjectModalOpen(false)} className="text-on-surface dark:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-5">
              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Category</label>
                  <select
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white cursor-pointer"
                  >
                    <option value="UI/UX Design" className="bg-white dark:bg-neutral-900 text-black dark:text-white">UI/UX Design</option>
                    <option value="Branding" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Branding</option>
                    <option value="Web Development" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Web Development</option>
                    <option value="Graphic Design" className="bg-white dark:bg-neutral-900 text-black dark:text-white">Graphic Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Client</label>
                  <input
                    type="text"
                    value={projectFormData.client}
                    onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                    className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                  />
                </div>
              </div>

              {/* Crop & Upload Thumbnail */}
              <div className="space-y-2 p-4 bg-surface-container-low dark:bg-neutral-800/80 rounded-xl border border-outline-variant dark:border-white/15">
                <span className="block text-xs font-label-caps font-bold uppercase text-on-surface dark:text-white">Project Thumbnail Image (16:9)</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-outline-variant">
                    {projectFormData.thumbnail ? (
                      <img src={projectFormData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">No img</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerCropper({
                      title: 'Upload & Crop Thumbnail Image',
                      currentImage: projectFormData.thumbnail,
                      aspectRatio: '16:9',
                      onSave: (croppedDataUrl) => {
                        setProjectFormData((prev) => ({ ...prev, thumbnail: croppedDataUrl }));
                      }
                    })}
                    className="px-4 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-label-caps text-xs font-bold uppercase rounded flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">crop</span>
                    Upload & Crop Thumbnail
                  </button>
                </div>
              </div>

              {/* Crop & Upload Hero Banner */}
              <div className="space-y-2 p-4 bg-surface-container-low dark:bg-neutral-800/80 rounded-xl border border-outline-variant dark:border-white/15">
                <span className="block text-xs font-label-caps font-bold uppercase text-on-surface dark:text-white">Case Study Hero Banner Image (16:9)</span>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-outline-variant">
                    {projectFormData.heroImage ? (
                      <img src={projectFormData.heroImage} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">No img</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerCropper({
                      title: 'Upload & Crop Hero Banner Image',
                      currentImage: projectFormData.heroImage || projectFormData.thumbnail,
                      aspectRatio: '16:9',
                      onSave: (croppedDataUrl) => {
                        setProjectFormData((prev) => ({ ...prev, heroImage: croppedDataUrl }));
                      }
                    })}
                    className="px-4 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-label-caps text-xs font-bold uppercase rounded flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">crop</span>
                    Upload & Crop Banner
                  </button>
                </div>
              </div>

              {/* Gallery Screenshots Manager */}
              <div className="space-y-3 p-4 bg-surface-container-low dark:bg-neutral-800/80 rounded-xl border border-outline-variant dark:border-white/15">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-label-caps font-bold uppercase text-on-surface dark:text-white">Project Deliverable Screenshots Gallery</span>
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3 py-1.5 bg-secondary text-on-secondary dark:bg-emerald-400 dark:text-black font-label-caps text-[11px] font-bold uppercase rounded flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">add_photo_alternate</span>
                    Add Screenshot
                  </button>
                </div>

                {projectFormData.gallery && projectFormData.gallery.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {projectFormData.gallery.map((imgUrl, i) => (
                      <div key={i} className="relative group aspect-[16/10] rounded-lg overflow-hidden border border-outline-variant">
                        <img src={imgUrl} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1 right-1 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant dark:text-stone-400 italic">No gallery screenshots added yet.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={projectFormData.shortDescription}
                  onChange={(e) => setProjectFormData({ ...projectFormData, shortDescription: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-label-caps font-bold uppercase mb-1 text-on-surface dark:text-stone-200">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={projectFormData.tags}
                  onChange={(e) => setProjectFormData({ ...projectFormData, tags: e.target.value })}
                  className="w-full p-3 bg-surface-container-lowest dark:bg-neutral-800 border border-outline-variant dark:border-white/20 rounded text-sm text-on-surface dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectFormData.featured}
                  onChange={(e) => setProjectFormData({ ...projectFormData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-xs font-bold uppercase text-on-surface dark:text-stone-200 cursor-pointer">Featured Project on Homepage</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-surface-variant dark:border-white/15">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant dark:border-white/20 rounded font-label-caps text-xs uppercase text-on-surface dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-on-primary dark:bg-white dark:text-black font-bold rounded font-label-caps text-xs uppercase"
                >
                  Save Project & Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Image Upload & Crop Modal */}
      <ImageUploadModal
        isOpen={cropperState.isOpen}
        onClose={() => setCropperState((prev) => ({ ...prev, isOpen: false }))}
        onSave={(croppedDataUrl) => {
          if (cropperState.onSaveCallback) {
            cropperState.onSaveCallback(croppedDataUrl);
          }
        }}
        title={cropperState.title}
        currentImage={cropperState.currentImage}
        aspectRatio={cropperState.aspectRatio}
      />
    </div>
  );
};
