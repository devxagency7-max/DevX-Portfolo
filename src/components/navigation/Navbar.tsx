import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY > 200 && currentScrollY > lastScrollY) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-6 ${
        hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${
        scrolled
          ? 'bg-[#050507]/80 backdrop-blur-xl border-b border-white/5 py-4'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: DEV SMART X Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-col text-left group focus:outline-none"
        >
          <span className="font-display font-extrabold text-base tracking-widest text-white uppercase flex items-center gap-2">
            DEV SMART <span style={{ color: '#6366F1' }}>X</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]"></span>
          </span>
          <span className="tech-label text-[10px] tracking-widest" style={{ color: '#4A4A5A' }}>
            DIGITAL EXHIBITION
          </span>
        </button>

        {/* Center: Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors duration-200 ${
              activeTab === 'home'
                ? 'text-white font-bold underline underline-offset-8 decoration-2 decoration-[#6366F1]'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            WORK
          </button>
        </nav>

        {/* Right: Interaction & Admin trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? "Admin Dashboard Active" : "Admin CMS Login"}
            className="text-[11px] font-mono tracking-widest text-zinc-500 hover:text-white transition-colors uppercase flex items-center gap-1.5"
          >
            {isAdminLoggedIn ? (
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CMS ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-zinc-600" /> CMS
              </span>
            )}
          </button>

          <a
            href="#work"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-widest text-white border border-white/10 hover:bg-white/5 hover:border-[#6366F1]/50 transition-all uppercase rounded-sm"
          >
            EXPLORE →
          </a>
        </div>

      </div>
    </header>
  );
};
