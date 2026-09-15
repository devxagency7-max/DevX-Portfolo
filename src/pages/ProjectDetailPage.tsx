import React, { useState } from 'react';
import { Project } from '../types/project';
import { ImageLightbox } from '../components/projects/ImageLightbox';
import { ProjectCover } from '../components/ui/ProjectCover';
import { 
  ArrowLeft, Globe, Download, ExternalLink, 
  CheckCircle2, Target, Maximize2 
} from 'lucide-react';
import { GithubIcon } from '../components/ui/SocialIcons';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  allProjects: Project[];
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onSelectProject,
  allProjects
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const relatedProjects = allProjects
    .filter(p => p.id !== project.id && (p.category === project.category || p.projectType === project.projectType))
    .slice(0, 3);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12 transition-colors duration-500" style={{ background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      
      {/* Lightbox for gallery */}
      <ImageLightbox
        images={project.galleryImages && project.galleryImages.length > 0 ? project.galleryImages : [project.coverImage]}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="self-start inline-flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] font-bold uppercase hover:text-indigo-400 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          RETURN TO EXHIBITION ARCHIVE
        </button>

        {/* HERO SECTION */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
            <span className="text-indigo-400 font-bold">{project.category}</span>
            <span>•</span>
            <span>{project.projectType}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">STATUS: {project.status}</span>
          </div>

          <h1 className="font-display font-extrabold text-[var(--text-main)] text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-[var(--text-muted)] text-lg md:text-2xl font-normal leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Action Links Bar (Only rendered if links exist!) */}
          {(project.liveUrl || project.downloadUrl || project.githubUrl) && (
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-btn"
                >
                  <Globe className="w-4 h-4 text-white" />
                  VISIT LIVE WEBSITE
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {project.downloadUrl && (
                <a
                  href={project.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-btn-secondary text-emerald-400 border-emerald-500/30"
                >
                  <Download className="w-4 h-4" />
                  DOWNLOAD APP
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="editorial-btn-secondary"
                >
                  <GithubIcon className="w-4 h-4" />
                  GITHUB REPOSITORY
                </a>
              )}
            </div>
          )}
        </div>

        {/* LARGE COVER IMAGE PREVIEW */}
        <div className="relative aspect-[16/8.5] w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <ProjectCover project={project} className="w-full h-full" />
          
          {project.coverImage && (
            <button
              onClick={() => handleOpenLightbox(0)}
              className="absolute bottom-6 right-6 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-lg text-xs font-mono font-bold flex items-center gap-2 rounded-lg"
            >
              <Maximize2 className="w-4 h-4 text-indigo-400" />
              EXPAND VISUAL
            </button>
          )}
        </div>

        {/* METADATA SUMMARY BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <span className="tech-label text-zinc-400">CLIENT / ORIGIN</span>
            <div className="text-sm font-bold text-white mt-1">{project.clientName || 'Dev Smart X Core'}</div>
          </div>
          <div>
            <span className="tech-label text-zinc-400">RELEASE YEAR</span>
            <div className="text-sm font-bold text-white mt-1">{project.year}</div>
          </div>
          <div>
            <span className="tech-label text-zinc-400">TECH STACK</span>
            <div className="text-sm font-bold text-white mt-1">{project.technologies.length} Technologies</div>
          </div>
          <div>
            <span className="tech-label text-zinc-400">INDUSTRY</span>
            <div className="text-sm font-bold text-white mt-1">{project.industry || project.category}</div>
          </div>
        </div>

        {/* OVERVIEW & CASE STUDY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-white/10">
          
          {/* Main Description */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <span className="tech-label text-indigo-400">ARCHITECTURAL BREAKDOWN</span>
              <h2 className="font-display font-extrabold text-3xl text-white mt-2 mb-4">
                System Overview
              </h2>
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>

            {/* Case Study Block */}
            {project.caseStudy && (
              <div className="flex flex-col gap-6 p-8 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-display font-bold text-xl text-white">Case Study Breakdown</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="tech-label text-amber-400 mb-1">THE ENGINEERING CHALLENGE</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{project.caseStudy.challenge}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <h4 className="tech-label text-emerald-400 mb-1">DEV SMART X SOLUTION</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{project.caseStudy.solution}</p>
                  </div>

                  {project.caseStudy.impact && (
                    <div className="pt-3 border-t border-white/10">
                      <h4 className="tech-label text-purple-400 mb-1">MEASURED IMPACT</h4>
                      <p className="text-white text-sm font-bold">{project.caseStudy.impact}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Tech Stack & Features */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Features */}
            {project.features.length > 0 && (
              <div className="p-8 rounded-2xl flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-display font-bold text-xl text-white">Key Capabilities</h3>
                <div className="flex flex-col gap-3">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="p-8 rounded-2xl flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="font-display font-bold text-xl text-white">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="font-mono text-xs px-3 py-1.5 rounded-lg text-indigo-300" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <div className="flex flex-col gap-8 pt-16 border-t border-white/10">
            <h2 className="font-display font-extrabold text-3xl text-white">Explore More Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="cursor-pointer p-5 rounded-2xl transition-all hover:border-indigo-500/50 flex flex-col gap-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden">
                    <ProjectCover project={p} className="w-full h-full" />
                  </div>
                  <span className="font-mono text-xs text-indigo-400 font-bold">{p.category}</span>
                  <h3 className="font-display font-bold text-lg text-white">{p.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
