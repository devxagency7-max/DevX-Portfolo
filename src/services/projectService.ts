import { Project, Category, FilterState } from '../types/project';
import {
  getStoredProjects,
  saveProject,
  deleteProjectDoc,
  getStoredCategories,
  saveCategory,
  deleteCategoryDoc,
  resetStorageToDefaults
} from './firestoreService';

export const projectService = {
  // Public project fetching
  getProjects: async (filter?: Partial<FilterState>): Promise<Project[]> => {
    let projects = await getStoredProjects();

    // Sort by display order
    projects.sort((a, b) => a.displayOrder - b.displayOrder);

    if (!filter) return projects;

    if (filter.category && filter.category !== 'all' && filter.category !== 'cat-all') {
      const catLower = filter.category.toLowerCase();
      projects = projects.filter(p =>
        p.category.toLowerCase() === catLower ||
        p.tags.some(t => t.toLowerCase() === catLower)
      );
    }

    if (filter.type && filter.type !== 'all') {
      projects = projects.filter(p => p.projectType === filter.type);
    }

    if (filter.search && filter.search.trim() !== '') {
      const q = filter.search.toLowerCase().trim();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q)) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filter.featuredOnly) {
      projects = projects.filter(p => p.featured);
    }

    return projects;
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    const projects = await getStoredProjects();
    return projects.find(p => p.slug === slug || p.id === slug) || null;
  },

  // Admin APIs
  getAllProjectsAdmin: async (): Promise<Project[]> => {
    const projects = await getStoredProjects();
    return projects.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    const projects = await getStoredProjects();
    const now = new Date().toISOString();

    const slugBase = projectData.title
      ? projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : 'project-' + Date.now();

    const newProject: Project = {
      id: 'proj-' + Date.now(),
      title: projectData.title || 'Untitled Project',
      slug: projectData.slug || slugBase,
      shortDescription: projectData.shortDescription || '',
      fullDescription: projectData.fullDescription || '',
      projectType: projectData.projectType || 'product',
      category: projectData.category || 'Web',
      status: projectData.status || 'Live',
      featured: projectData.featured || false,
      coverImage: projectData.coverImage || '/images/projects/pharmacare.png',
      galleryImages: projectData.galleryImages || [],
      videoUrl: projectData.videoUrl,
      liveUrl: projectData.liveUrl,
      downloadUrl: projectData.downloadUrl,
      githubUrl: projectData.githubUrl,
      technologies: projectData.technologies || [],
      features: projectData.features || [],
      tags: projectData.tags || [],
      clientName: projectData.clientName,
      year: projectData.year || new Date().getFullYear(),
      createdAt: now,
      updatedAt: now,
      publishedAt: projectData.status === 'Live' ? now : '',
      displayOrder: projects.length + 1,
      accentColor: projectData.accentColor || '#6366F1',
      caseStudy: projectData.caseStudy,
      team: projectData.team,
      industry: projectData.industry
    };

    await saveProject(newProject);
    return newProject;
  },

  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    const projects = await getStoredProjects();
    const existing = projects.find(p => p.id === id);
    if (!existing) {
      throw new Error(`Project with ID ${id} not found`);
    }

    const updatedProject: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await saveProject(updatedProject);
    return updatedProject;
  },

  deleteProject: async (id: string): Promise<boolean> => {
    await deleteProjectDoc(id);
    return true;
  },

  duplicateProject: async (id: string): Promise<Project> => {
    const projects = await getStoredProjects();
    const existing = projects.find(p => p.id === id);
    if (!existing) throw new Error('Project not found');

    const copy: Project = {
      ...existing,
      id: 'proj-' + Date.now(),
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayOrder: projects.length + 1
    };

    await saveProject(copy);
    return copy;
  },

  toggleFeatured: async (id: string): Promise<Project> => {
    const projects = await getStoredProjects();
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    const updated = { ...project, featured: !project.featured };
    await saveProject(updated);
    return updated;
  },

  // Category APIs
  getCategories: async (): Promise<Category[]> => {
    return getStoredCategories();
  },

  addCategory: async (name: string, description?: string): Promise<Category> => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name,
      slug,
      description
    };
    await saveCategory(newCat);
    return newCat;
  },

  createCategory: async (categoryData: { name: string; description?: string }): Promise<Category> => {
    return projectService.addCategory(categoryData.name, categoryData.description);
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    await deleteCategoryDoc(id);
    return true;
  },

  resetDefaults: async (): Promise<void> => {
    await resetStorageToDefaults();
  }
};
