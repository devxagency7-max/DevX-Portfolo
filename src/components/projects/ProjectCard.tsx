import React from 'react';
import { Project } from '../../types/project';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const getStatusBadge = (status: string, type: string) => {
    if (type === 'concept') {
      return <span className="status-badge status-concept">Concept</span>;
    }
    if (type === 'experimental') {
      return <span className="status-badge status-experimental">Playground</span>;
    }
    switch (status) {
      case 'Live':
        return <span className="status-badge status-live">Live Product</span>;
      case 'In Development':
        return <span className="status-badge status-in-dev">In Development</span>;
      default:
        return <span className="status-badge status-concept">{status}</span>;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer flex flex-col h-full rounded-2xl overflow-hidden glass-panel glass-panel-hover"
    >
      {/* Top Media Cover */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Subtle Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-sm">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-500/20">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Featured
              </span>
            )}
          </div>
          {getStatusBadge(project.status, project.projectType)}
        </div>

        {/* Action Icon on Hover */}
        <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{project.clientName || 'Dev Smart X R&D'}</span>
            <span>{project.year}</span>
          </div>

          <h3 className="font-display font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="pt-3 flex flex-wrap gap-1.5 border-t border-slate-100">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span key={idx} className="tech-badge">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="tech-badge text-indigo-600 font-bold bg-indigo-50 border-indigo-200">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
