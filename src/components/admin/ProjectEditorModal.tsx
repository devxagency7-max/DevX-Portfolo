import React, { useState, useEffect } from 'react';
import { Project, Category, ProjectType, ProjectStatus } from '../../types/project';
import { ImageUploader } from './ImageUploader';
import { X, Plus, Trash2, Save, Sparkles, Check, Globe, Download, Video } from 'lucide-react';
import { GithubIcon } from '../ui/SocialIcons';
import confetti from 'canvas-confetti';

interface ProjectEditorModalProps {
  isOpen: boolean;
  project: Project | null;
  categories: Category[];
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  project,
  categories,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    projectType: 'product',
    category: 'Web Applications',
    status: 'Live',
    featured: false,
    coverImage: '',
    galleryImages: [],
    videoUrl: '',
    liveUrl: '',
    downloadUrl: '',
    githubUrl: '',
    technologies: [],
    features: [],
    tags: [],
    clientName: 'Dev Smart X Core',
    year: new Date().getFullYear().toString(),
    accentColor: '#6366F1',
    caseStudy: {
      challenge: '',
      solution: '',
      impact: ''
    }
  });

  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    } else {
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        projectType: 'product',
        category: categories[0]?.name || 'Web Applications',
        status: 'Live',
        featured: false,
        coverImage: '/images/projects/pharmacare_cover.png',
        galleryImages: [],
        videoUrl: '',
        liveUrl: '',
        downloadUrl: '',
        githubUrl: '',
        technologies: ['React', 'TypeScript', 'ASP.NET Core', 'PostgreSQL'],
        features: ['Real-time sync', 'AI Predictive Analytics'],
        tags: [],
        clientName: 'Dev Smart X Core',
        year: new Date().getFullYear().toString(),
        accentColor: '#6366F1',
        caseStudy: {
          challenge: '',
          solution: '',
          impact: ''
        }
      });
    }
  }, [project, isOpen, categories]);

  if (!isOpen) return null;

  const handleTitleChange = (title: string) => {
    const autoSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setFormData(prev => ({
      ...prev,
      title,
      slug: project ? prev.slug : autoSlug
    }));
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies?.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="modal-overlay animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col gap-8"
        style={{
          background: '#0C0C10',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 80px rgba(99, 102, 241, 0.2)',
          color: '#F0F0F5'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#6366F1'
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-white">
                {project ? 'Edit Project Entry' : 'Create New Showcase Entry'}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                {project ? `ID: ${project.id}` : 'Fill in project metadata & content'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Section 1: Basic Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
              1. Basic Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. PharmaCare Healthcare Suite"
                  className="form-input text-sm"
                />
              </div>

              <div>
                <label className="form-label">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="pharmacare-healthcare-suite"
                  className="form-input text-sm font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">Category *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="form-input text-sm"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Project Type *</label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                  className="form-input text-sm capitalize"
                >
                  <option value="product">Completed Product (Type A)</option>
                  <option value="concept">Idea / Concept (Type B)</option>
                  <option value="experimental">Playground Experiment (Type C)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Status *</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                  className="form-input text-sm"
                >
                  <option value="Live">Live / Production</option>
                  <option value="In Development">In Development</option>
                  <option value="Draft">Draft (Hidden)</option>
                  <option value="Concept">Concept Stage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Client Name / Origin</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Dev Smart X Core"
                  className="form-input text-sm"
                />
              </div>

              <div>
                <label className="form-label">Release Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2026"
                  className="form-input text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="featuredToggle" className="text-sm font-semibold text-zinc-200 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Highlight as Featured Spotlight Project on Hero Grid
              </label>
            </div>
          </div>

          {/* Section 2: Visual Media Assets */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
              2. Visual Cover & Gallery Assets
            </h3>

            <ImageUploader
              label="Primary Cover Image (Hero Preview) *"
              currentValue={formData.coverImage || ''}
              onChange={val => setFormData({ ...formData, coverImage: val })}
            />

            <div>
              <label className="form-label">Demo Video URL (Optional MP4 link)</label>
              <div className="relative">
                <Video className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://assets.mixkit.co/videos/preview/mixkit-software-dashboard-41550-large.mp4"
                  className="form-input pl-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Descriptions & Case Study */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
              3. Case Study & Copywriting
            </h3>

            <div>
              <label className="form-label">Short Tagline Description *</label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="A high-performance enterprise healthcare suite built with .NET microservices..."
                className="form-input text-sm"
              />
            </div>

            <div>
              <label className="form-label">Full Architecture Overview *</label>
              <textarea
                rows={4}
                required
                value={formData.fullDescription}
                onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed technical breakdown of the system architecture..."
                className="form-input text-sm"
              />
            </div>

            <div
              className="p-6 rounded-2xl flex flex-col gap-4"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <h4 className="font-display font-bold text-sm text-white">Case Study Breakdown (Optional)</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Engineering Challenge</label>
                  <textarea
                    rows={2}
                    value={formData.caseStudy?.challenge || ''}
                    onChange={e => setFormData({
                      ...formData,
                      caseStudy: { ...(formData.caseStudy || {}), challenge: e.target.value } as any
                    })}
                    placeholder="Legacy hospital data fragmentation..."
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Dev Smart X Solution</label>
                  <textarea
                    rows={2}
                    value={formData.caseStudy?.solution || ''}
                    onChange={e => setFormData({
                      ...formData,
                      caseStudy: { ...(formData.caseStudy || {}), solution: e.target.value } as any
                    })}
                    placeholder="Unified GraphQL gateway with AI engine..."
                    className="form-input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tech Stack & Features */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
              4. Tech Stack & Key Features
            </h3>

            {/* Technologies */}
            <div>
              <label className="form-label">Technologies Used</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTech(); } }}
                  placeholder="e.g. React, C#, TensorFlow..."
                  className="form-input text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="btn-secondary text-xs shrink-0 py-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.technologies?.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs flex items-center gap-1.5 px-3 py-1 rounded-md font-mono"
                    style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#A5B4FC' }}
                  >
                    {tech}
                    <button type="button" onClick={() => handleRemoveTech(tech)} className="text-zinc-400 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="form-label">Key Features</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  placeholder="e.g. Real-time patient analytics dashboard..."
                  className="form-input text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="btn-secondary text-xs shrink-0 py-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {formData.features?.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg text-xs"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#F0F0F5' }}
                  >
                    <span className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      {feat}
                    </span>
                    <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-zinc-400 hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Action Links */}
          <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono font-bold text-indigo-400 tracking-wider uppercase">
              5. Live Action Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label font-mono text-xs flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" /> Live Website URL
                </label>
                <input
                  type="text"
                  value={formData.liveUrl}
                  onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://pharmacare.devsmartx.com"
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="form-label font-mono text-xs flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-emerald-400" /> Download App Link
                </label>
                <input
                  type="text"
                  value={formData.downloadUrl}
                  onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="https://appstore.com/pharmacare"
                  className="form-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="form-label font-mono text-xs flex items-center gap-1">
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-400" /> GitHub Repository URL
                </label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/devsmartx/pharmacare"
                  className="form-input text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-sm py-3 px-6"
            >
              <Save className="w-4 h-4" />
              Save Project Entry
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
