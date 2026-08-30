import React, { useState, useEffect } from 'react';
import { Project, Category } from './types/project';
import { projectService } from './services/projectService';
import { authService } from './services/authService';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/navigation/Navbar';
import { HomePage } from './pages/HomePage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ProjectEditorModal } from './components/admin/ProjectEditorModal';
import { CategoryManagerModal } from './components/admin/CategoryManagerModal';
import Lenis from 'lenis';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'admin'>('home');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  
  const [isProjectEditorOpen, setIsProjectEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  // Initialize Lenis smooth scroll with fallback
  useEffect(() => {
    let lenisInstance: Lenis | null = null;
    let rafId: number;

    try {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    } catch (err) {
      console.warn('Lenis smooth scroll fallback to native scroll', err);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
    };
  }, []);

  // Fetch initial project data
  const refreshData = async () => {
    const cats = await projectService.getCategories();
    setCategories(cats);

    const projs = await projectService.getProjects();
    setProjects(projs);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = authService.onAuthChange(user => {
      setIsAdminLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const handleOpenAdmin = () => {
    if (authService.isAuthenticated()) {
      setActiveTab('admin');
      setSelectedProjectSlug(null);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoginOpen(false);
    setIsAdminLoggedIn(true);
    setActiveTab('admin');
    setSelectedProjectSlug(null);
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAdminLoggedIn(false);
    setActiveTab('home');
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (editingProject) {
      await projectService.updateProject(editingProject.id, projectData);
    } else {
      await projectService.createProject(projectData);
    }
    setIsProjectEditorOpen(false);
    setEditingProject(null);
    refreshData();
  };

  const selectedProject = projects.find(p => p.slug === selectedProjectSlug || p.id === selectedProjectSlug);

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F0F5] flex flex-col font-body selection:bg-[#6366F1] selection:text-white">

      {/* Editorial Sticky Navigation (Hidden on Admin Tab) */}
      {activeTab !== 'admin' && (
        <Navbar
          activeTab={selectedProjectSlug ? 'work' : activeTab}
          onNavigate={tab => {
            setSelectedProjectSlug(null);
            setActiveTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={handleOpenAdmin}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-grow">
        {selectedProject ? (
          <ProjectDetailPage
            project={selectedProject}
            allProjects={projects}
            onBack={() => setSelectedProjectSlug(null)}
            onSelectProject={p => {
              setSelectedProjectSlug(p.slug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'admin' ? (
          isAdminLoggedIn ? (
            <AdminDashboard
              projects={projects}
              categories={categories}
              onRefresh={refreshData}
              onOpenCreate={() => {
                setEditingProject(null);
                setIsProjectEditorOpen(true);
              }}
              onOpenEdit={proj => {
                setEditingProject(proj);
                setIsProjectEditorOpen(true);
              }}
              onOpenCategoryManager={() => setIsCategoryManagerOpen(true)}
              onLogout={handleLogout}
              onPreviewProject={slug => setSelectedProjectSlug(slug)}
              onGoHome={() => setActiveTab('home')}
            />
          ) : (
            <div className="p-32 text-center font-mono text-zinc-500 text-sm">
              ADMIN CMS AUTHENTICATION REQUIRED
            </div>
          )
        ) : (
          <HomePage
            projects={projects}
            onSelectProject={p => setSelectedProjectSlug(p.slug)}
            onNavigate={tab => {
              setActiveTab(tab as any);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>


      {/* ADMIN CMS MODALS */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <ProjectEditorModal
        isOpen={isProjectEditorOpen}
        project={editingProject}
        categories={categories}
        onClose={() => setIsProjectEditorOpen(false)}
        onSave={handleSaveProject}
      />

      <CategoryManagerModal
        isOpen={isCategoryManagerOpen}
        categories={categories}
        onClose={() => setIsCategoryManagerOpen(false)}
        onRefresh={refreshData}
      />

    </div>
  );
};
