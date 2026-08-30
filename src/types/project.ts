export type ProjectType = 'product' | 'concept' | 'experimental';

export type ProjectStatus = 'Live' | 'Idea' | 'Concept' | 'Prototype' | 'In Development' | 'Coming Soon' | 'Archived';

export interface CaseStudy {
  challenge: string;
  solution: string;
  impact?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  projectType: ProjectType;
  category: string;
  status: ProjectStatus;
  featured: boolean;
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  liveUrl?: string;
  downloadUrl?: string;
  githubUrl?: string;
  technologies: string[];
  features: string[];
  tags: string[];
  clientName?: string;
  year: string | number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  displayOrder: number;
  
  // Optional fields
  mobileScreenshots?: string[];
  desktopScreenshots?: string[];
  logo?: string;
  accentColor?: string; // e.g. '#10B981', '#6366F1', '#F59E0B'
  projectIcon?: string;
  caseStudy?: CaseStudy;
  team?: string[];
  industry?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface FilterState {
  category: string;
  type: string;
  search: string;
  featuredOnly: boolean;
}
