import React from 'react';
import { Project } from '../types/project';
import { LogoScrollShowcase } from '../components/showcase/LogoScrollShowcase';

interface HomePageProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  onSelectProject,
  onNavigate
}) => {
  const featuredProject = projects.find(p => p.featured) || projects[0];
  const restProjects = projects.filter(p => p.id !== featuredProject?.id);
  const orderedProjects = featuredProject ? [featuredProject, ...restProjects] : projects;

  return (
    <div className="w-full bg-[#FBFBF9] text-[#0F0F11]">
      {/* Sticky 3D Logo + Alternating Project Showcase */}
      <LogoScrollShowcase
        projects={orderedProjects}
        onSelectProject={onSelectProject}
        onExploreWork={() => {
          const el = document.getElementById('work');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onEnterLab={() => onNavigate('lab')}
      />
    </div>
  );
};
