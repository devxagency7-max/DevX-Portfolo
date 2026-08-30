import React, { useState } from 'react';
import { Project, Category } from '../../types/project';
import { projectService } from '../../services/projectService';
import { ProjectCover } from '../ui/ProjectCover';
import { 
  Plus, Edit, Trash2, Copy, Eye, Sparkles, LogOut, 
  FolderPlus, RotateCcw, Shield, Search, Globe
} from 'lucide-react';

interface AdminDashboardProps {
  projects: Project[];
  categories: Category[];
  onRefresh: () => void;
  onOpenCreate: () => void;
  onOpenEdit: (project: Project) => void;
  onOpenCategoryManager: () => void;
  onLogout: () => void;
  onPreviewProject: (slug: string) => void;
  onGoHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  categories,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
  onOpenCategoryManager,
  onLogout,
  onPreviewProject,
  onGoHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || p.projectType === typeFilter;
    return matchesSearch && matchesType;
  });

  const publishedCount = projects.filter(p => p.status === 'Live').length;
  const featuredCount = projects.filter(p => p.featured).length;

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await projectService.deleteProject(id);
      onRefresh();
    }
  };

  const handleDuplicate = async (id: string) => {
    await projectService.duplicateProject(id);
    onRefresh();
  };

  const handleTogglePublish = async (project: Project) => {
    const newStatus = project.status === 'Live' ? 'Draft' : 'Live';
    await projectService.updateProject(project.id, { status: newStatus as any });
    onRefresh();
  };

  const handleToggleFeatured = async (id: string) => {
    await projectService.toggleFeatured(id);
    onRefresh();
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all projects and categories to default sample data?')) {
      await projectService.resetDefaults();
      onRefresh();
    }
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-12 pt-10" style={{ background: '#050507' }}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Top Header Navigation Bar */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">Dev Smart X CMS</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                  AUTHENTICATED
                </span>
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: '#8B8BA0' }}>
                Dynamic project repository management console
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGoHome}
              className="text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg font-mono font-bold transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#F0F0F5' }}
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              View Site
            </button>

            <button
              onClick={onOpenCategoryManager}
              className="text-xs py-2 px-3 flex items-center gap-1.5 rounded-lg font-mono font-bold transition-all"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)', color: '#A855F7' }}
            >
              <FolderPlus className="w-4 h-4" />
              Categories ({categories.length})
            </button>

            <button
              onClick={onOpenCreate}
              className="text-xs py-2 px-4 flex items-center gap-1.5 rounded-lg font-mono font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl transition-colors hover:bg-red-500/20 hover:text-red-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8B8BA0' }}
              title="Logout CMS"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'TOTAL PROJECTS', value: projects.length, color: '#F0F0F5' },
            { label: 'PUBLISHED LIVE', value: publishedCount, color: '#10B981' },
            { label: 'SPOTLIGHT FEATURED', value: featuredCount, color: '#6366F1' },
            { label: 'TOTAL CATEGORIES', value: categories.length, color: '#A855F7' },
          ].map(stat => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl flex flex-col gap-1"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-xs font-mono font-bold" style={{ color: stat.color, opacity: 0.7 }}>{stat.label}</span>
              <span className="font-display text-3xl font-black" style={{ color: stat.color }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Table Filter Controls */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3" style={{ color: '#8B8BA0' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects by title or category..."
              className="w-full pl-9 pr-4 py-2 text-xs font-mono rounded-lg outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F0F5' }}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="text-xs font-mono rounded-lg px-3 py-2 outline-none"
              style={{ background: '#0C0C10', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F0F5' }}
            >
              <option value="all">All Types</option>
              <option value="product">Completed Products</option>
              <option value="concept">Concepts</option>
              <option value="experimental">Playground</option>
            </select>

            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 shrink-0 transition-all hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F0F5' }}
              title="Reset projects to sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Samples
            </button>
          </div>
        </div>

        {/* Projects CMS Table */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-mono uppercase font-bold tracking-wider" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)', color: '#8B8BA0' }}>
                  <th className="p-4 pl-6">Project</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map(project => (
                  <tr
                    key={project.id}
                    className="text-sm transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Project Column */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                          <ProjectCover project={project} className="w-full h-full" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{project.title}</span>
                          <span className="text-xs font-mono" style={{ color: '#8B8BA0' }}>/{project.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <span className="capitalize text-xs font-mono font-medium" style={{ color: '#8B8BA0' }}>
                        {project.projectType}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#A5B4FC' }}>
                        {project.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className="cursor-pointer px-3 py-1 rounded-full text-xs font-bold font-mono border transition-all"
                        style={project.status === 'Live'
                          ? { background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
                          : { background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }
                        }
                      >
                        {project.status === 'Live' ? '● Live' : `○ ${project.status}`}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id)}
                        className="p-2 rounded-lg transition-all"
                        style={project.featured
                          ? { background: 'rgba(99,102,241,0.2)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.35)' }
                          : { color: '#4A4A5A' }
                        }
                        title="Toggle Featured"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onPreviewProject(project.slug)} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#F0F0F5' }} title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => onOpenEdit(project)} className="p-2 rounded-lg transition-colors hover:bg-indigo-500/20" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366F1' }} title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDuplicate(project.id)} className="p-2 rounded-lg transition-colors hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: '#F0F0F5' }} title="Duplicate">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(project.id, project.title)} className="p-2 rounded-lg transition-colors hover:bg-red-500/20" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
