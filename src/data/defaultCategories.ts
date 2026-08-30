import { Category } from '../types/project';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All Work', slug: 'all', description: 'Complete showcase of Dev Smart X innovations' },
  { id: 'cat-ai', name: 'AI & ML', slug: 'ai', description: 'Autonomous agents, neural platforms, and generative tools' },
  { id: 'cat-web', name: 'Web Engineering', slug: 'web', description: 'High-performance web applications and enterprise portals' },
  { id: 'cat-mobile', name: 'Mobile Apps', slug: 'mobile', description: 'Cross-platform native iOS & Android applications' },
  { id: 'cat-saas', name: 'SaaS Platforms', slug: 'saas', description: 'Cloud-native multi-tenant business platforms' },
  { id: 'cat-3d', name: '3D & WebGL', slug: '3d', description: 'Interactive visual experiences and real-time graphics' },
  { id: 'cat-concepts', name: 'Future Concepts', slug: 'concepts', description: 'R&D prototypes and next-gen product visions' },
  { id: 'cat-experimental', name: 'Playground', slug: 'experimental', description: 'Creative code, shaders, and experimental algorithms' },
];
