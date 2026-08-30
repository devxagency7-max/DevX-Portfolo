export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'editor';
  token: string;
  lastLogin: string;
}

export interface AdminStats {
  totalProjects: number;
  publishedCount: number;
  draftCount: number;
  featuredCount: number;
  totalCategories: number;
  totalViews: number;
}
