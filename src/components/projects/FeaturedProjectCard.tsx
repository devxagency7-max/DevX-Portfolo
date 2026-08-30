import React from 'react';
import { Project } from '../../types/project';
import { ArrowRight, Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  project,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onClick={() => onSelect(project)}
      className="group relative w-full cursor-pointer rounded-3xl overflow-hidden glass-panel border border-indigo-200/80 p-6 md:p-10 hover:border-indigo-400 transition-all duration-500 shadow-xl shadow-indigo-500/5 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20"
    >
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* Left Info Column */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-xs font-mono font-bold text-indigo-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Flagship Showcase 01
            </span>
            <span className="status-badge status-live">
              {project.status}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">
              {project.category} • {project.year}
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl text-slate-900 group-hover:text-indigo-600 transition-colors mt-2">
              {project.title}
            </h2>
          </div>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed">
            {project.shortDescription}
          </p>

          {/* Key Highlight Features */}
          {project.features.length > 0 && (
            <div className="flex flex-col gap-2 pt-2">
              {project.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="tech-badge text-xs px-3 py-1 bg-white border-slate-200 text-slate-700 shadow-sm">
                {tech}
              </span>
            ))}
          </div>

          {/* Action Link Button */}
          <div className="pt-4 flex items-center gap-4">
            <button className="btn-primary">
              Explore Project Blueprint
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Preview Column (Large Interactive Showcase Image) */}
        <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl group-hover:shadow-indigo-500/15 transition-all duration-500 bg-slate-100">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* Overlay Tag */}
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-between shadow-lg">
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-500">Interactive Preview</span>
              <span className="text-sm font-bold text-slate-900">{project.clientName || 'Dev Smart X Core Product'}</span>
            </div>
            {project.videoUrl && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-md">
                <Play className="w-3.5 h-3.5 fill-current" /> Video Demo
              </span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
