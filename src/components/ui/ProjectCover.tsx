import React, { useState } from 'react';
import { Project } from '../../types/project';
import { Code2, Cpu, Layers } from 'lucide-react';

interface ProjectCoverProps {
  project: Project;
  className?: string;
}

export const ProjectCover: React.FC<ProjectCoverProps> = ({ project, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  const hasImage = Boolean(
    project.coverImage &&
    !imgError &&
    project.coverImage.trim() !== '' &&
    !project.coverImage.includes('placeholder') &&
    !project.coverImage.startsWith('/images/projects/')
  );

  if (hasImage) {
    return (
      <img
        src={project.coverImage}
        alt={project.title}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }

  // Pure dark tech-card artwork generated via CSS & SVG
  const accent = project.accentColor || '#6366F1';

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-6 select-none overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 85% 15%, ${accent}30, transparent 65%), radial-gradient(circle at 15% 85%, #A855F725, transparent 55%), #0A0A0F`,
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${accent}30 1px, transparent 1px), linear-gradient(90deg, ${accent}30 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Glowing Orb */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: accent, opacity: 0.3 }}
      />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}40`,
            color: accent
          }}
        >
          <Cpu className="w-3.5 h-3.5" />
          {project.category}
        </span>
        <span className="font-mono text-xs text-zinc-500 font-bold">{project.year}</span>
      </div>

      {/* Center Title & Tech Badges */}
      <div className="relative z-10 flex flex-col gap-3 my-auto py-4">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span>{project.projectType.toUpperCase()} ARCHITECTURE</span>
        </div>
        <h3
          className="font-display font-black text-xl md:text-2xl tracking-tight text-white line-clamp-2"
          style={{ textShadow: `0 0 30px ${accent}60` }}
        >
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.technologies.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded"
              style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#D4D4D8' }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 text-zinc-500">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3 text-emerald-400" />
          {project.clientName || 'Dev Smart X'}
        </span>
        <span className="text-emerald-400 font-bold">● {project.status}</span>
      </div>
    </div>
  );
};
