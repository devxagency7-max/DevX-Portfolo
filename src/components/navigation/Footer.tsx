import React from 'react';
import { Lock } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '../ui/SocialIcons';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer className="relative bg-[var(--bg-secondary)] text-[var(--text-main)] pt-20 pb-12 overflow-hidden border-t border-[var(--border-hairline)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[var(--border-hairline)]">
          
          {/* Brand Info */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-2xl tracking-widest text-[var(--text-main)] uppercase">
                DEV SMART <span className="text-[#6366F1]">X</span>
              </span>
              <span className="tech-label text-[var(--text-muted)] text-xs">
                DIGITAL PRODUCT STUDIO & EXHIBITION
              </span>
            </div>

            <p className="text-[var(--text-muted)] text-sm max-w-md leading-relaxed">
              We engineer digital products, enterprise platforms, autonomous AI systems, and experimental visual experiences through technology and design.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
              <button onClick={() => onNavigate('home')} className="text-left text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                WORK
              </button>
            </div>
          </div>

          {/* Socials & Admin */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
              CONNECT & ADMIN
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all rounded">
                <GithubIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all rounded">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all rounded">
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4 border-t border-[var(--border-hairline)]">
              <button
                onClick={onOpenAdmin}
                className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 uppercase"
              >
                <Lock className="w-3 h-3 text-[#6366F1]" />
                CMS RESTRICTED CONSOLE
              </button>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--text-muted)] gap-4">
          <p>© {new Date().getFullYear()} DEV SMART X. ALL RIGHTS RESERVED.</p>
          <p>ENGINEERED FOR CREATIVE EXCELLENCE.</p>
        </div>
      </div>
    </footer>
  );
};
