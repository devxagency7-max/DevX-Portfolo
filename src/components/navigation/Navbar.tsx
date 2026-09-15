import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  isAdminLoggedIn,
  theme,
  onToggleTheme
}) => {
  const isLight = theme === 'light';

  // On mobile, the fixed corner controls can end up sitting right on top of
  // full-width scrolling content (cards, tags, text). Rather than leaving them
  // permanently overlapping, hide them while scrolling down and bring them back
  // on scroll-up or near the top — desktop is untouched (plenty of margin there).
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setHidden(false);
        return;
      }
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastY + 4;
      const scrolledUp = currentY < lastY - 4;

      if (currentY < 60) {
        setHidden(false);
      } else if (scrolledDown) {
        setHidden(true);
      } else if (scrolledUp) {
        setHidden(false);
      }
      lastY = currentY;
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) setHidden(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none p-6 md:p-8 transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-end">

        {/* Floating Top Right Controls (Light/Dark Toggle & CMS Lock) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-mono tracking-wider font-semibold rounded-full border backdrop-blur-md transition-all duration-300 active:scale-95 shadow-md ${
              isLight
                ? 'bg-white/80 text-slate-800 border-slate-300/80 hover:bg-white hover:border-slate-400'
                : 'bg-black/40 text-zinc-200 border-white/15 hover:bg-black/60 hover:border-indigo-500/50'
            }`}
          >
            {isLight ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                <span className="inline">LIGHT</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="inline">DARK</span>
              </>
            )}
          </button>

          {/* CMS Admin Link */}
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? "Admin Dashboard Active" : "Admin CMS Login"}
            className={`text-[11px] font-mono tracking-widest font-semibold px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 uppercase flex items-center gap-1.5 active:scale-95 shadow-md ${
              isLight
                ? 'bg-white/80 text-slate-700 hover:text-slate-900 border-slate-300/80 hover:bg-white'
                : 'bg-black/40 text-zinc-300 hover:text-white border-white/15 hover:bg-black/60 hover:border-white/30'
            }`}
          >
            {isAdminLoggedIn ? (
              <span className="text-[#10B981] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> CMS ACTIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Lock className={`w-3 h-3 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`} /> CMS
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};
