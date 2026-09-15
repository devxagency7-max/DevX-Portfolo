import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '../../types/project';
import { LogoPlate } from '../three/LogoPlate';
import { ProjectCover } from '../ui/ProjectCover';

interface LogoScrollShowcaseProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onExploreWork: () => void;
  onEnterLab: () => void;
}

/**
 * Home page centerpiece: a big centered 3D DEVX logo opens the page.
 * As the user scrolls past the hero it shrinks into a small tile that
 * stays pinned in the viewport (sticky, scoped to the project track
 * only) while the project list scrolls underneath it — swinging right
 * of project 1, left of project 2, right of project 3, and so on,
 * flipping in 3D at each handoff. The handoff points are measured from
 * the actual rendered row positions so the tile always lines up.
 */
export const LogoScrollShowcase: React.FC<LogoScrollShowcaseProps> = ({
  projects,
  onSelectProject,
  onExploreWork,
  onEnterLab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [breakpoints, setBreakpoints] = useState<number[]>([]);
  const [trackWidth, setTrackWidth] = useState(1200);

  const [reduceMotion, setReduceMotion] = useState(false);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseRotateX = useSpring(useTransform(rawY, [-1, 1], [14, -14]), { stiffness: 80, damping: 20 });
  const mouseRotateY = useSpring(useTransform(rawX, [-1, 1], [-16, 16]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);

    const handleMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / (window.innerWidth / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);
      rawX.set(Math.max(-1, Math.min(1, dx)));
      rawY.set(Math.max(-1, Math.min(1, dy)));
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rawX, rawY]);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const { scrollYProgress: trackProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center']
  });

  // Measure each row's vertical center as a fraction of the track's scrollable height
  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track || rowRefs.current.length === 0) return;
      const trackRect = track.getBoundingClientRect();
      const trackHeight = track.scrollHeight;
      setTrackWidth(trackRect.width);
      const centers = rowRefs.current.map(row => {
        if (!row) return 0;
        const rowRect = row.getBoundingClientRect();
        const rowCenterFromTrackTop = rowRect.top - trackRect.top + rowRect.height / 2;
        return Math.min(1, Math.max(0, rowCenterFromTrackTop / trackHeight));
      });
      setBreakpoints(centers);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [projects.length]);

  const n = Math.max(projects.length, 1);
  const safeBreakpoints = breakpoints.length === n ? breakpoints : projects.map((_, i) => (i + 0.5) / n);

  // Dynamically calculate logoWidth & cardWidth to guarantee wide centered cards & 100% visibility of 3D logo
  const availHalfWidth = Math.max(320, trackWidth / 2 - 24);
  const logoWidth = availHalfWidth < 520 ? 180 : 210;

  const cardWidth = Math.min(720, Math.max(320, trackWidth > 900 ? 640 : trackWidth - 40));
  const cardHalfWidth = cardWidth / 2;

  // Keep the small logo tile close beside the card, not out in empty space
  const restOffsetPx = cardHalfWidth + 24 + logoWidth / 2;

  // Build keyframes with symmetric pixel offsets for left & right sides
  const timePoints: number[] = [0];
  const xPxKeyframes: number[] = [0];
  const rotateKeyframes: number[] = [0];

  safeBreakpoints.forEach((center, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const targetX = side * restOffsetPx;
    const approachStart = Math.max(0, center - 0.06);
    timePoints.push(approachStart, center);
    rotateKeyframes.push(side * 15, 0);
    xPxKeyframes.push(0, targetX);
  });
  timePoints.push(1);
  xPxKeyframes.push(xPxKeyframes[xPxKeyframes.length - 1]);
  rotateKeyframes.push(0);

  const tileX = useTransform(trackProgress, timePoints, xPxKeyframes);
  const tileRotateY = useTransform(trackProgress, timePoints, rotateKeyframes);

  // Combine mouse & scroll transitions for the single continuous 3D logo:
  const tiltStrength = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const logoRotateX = useTransform([mouseRotateX, tiltStrength], ([rx, strength]: any[]) => reduceMotion ? 0 : rx * strength);
  const logoRotateY = useTransform([mouseRotateY, tiltStrength, tileRotateY], ([ry, strength, sRot]: any[]) => reduceMotion ? sRot : (ry * strength + sRot));
  const logoScale = useTransform(heroProgress, [0, 1], [logoWidth === 180 ? 1.6 : 1.8, 1]);
  const logoY = useTransform(heroProgress, [0, 1], [-140, 0]);

  return (
    <div ref={containerRef} className="relative w-full transition-colors duration-500 bg-[var(--bg-primary)]">

      {/* Ambient aurora backdrop spanning the whole showcase */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="hero-aurora-blob hero-aurora-1" />
        <div className="hero-aurora-blob hero-aurora-2" />
        <div className="hero-aurora-blob hero-aurora-3" />
        <div className="hero-grid" />
        <div className="hero-scanline" />
        <div className="hero-noise" />
      </div>

      {/* The single sticky, scroll-driven traveling logo tile (scoped to the entire showcase) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="sticky top-1/2 -translate-y-1/2 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              x: tileX,
              y: logoY,
              scale: logoScale,
              rotateX: logoRotateX,
              rotateY: logoRotateY,
              perspective: '1400px',
              transformStyle: 'preserve-3d',
              width: logoWidth,
            }}
            className="aspect-[1132/517] z-20 relative"
          >
            {/* Floating green dot */}
            <motion.span
              className="absolute top-6 right-8 w-3 h-3 rounded-full bg-[#059669] shadow-[0_0_20px_4px_rgba(5,150,105,0.6)]"
              animate={reduceMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Floating purple dot */}
            <motion.span
              className="absolute bottom-2 left-10 w-2.5 h-2.5 rounded-full bg-[#7C3AED] shadow-[0_0_20px_4px_rgba(124,58,237,0.6)]"
              animate={reduceMotion ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            />

            <div className="hero-logo-shadow" />
            <LogoPlate variant="wide" glow={true} className="w-full h-full" />
          </motion.div>
        </div>
      </div>

      {/* HERO: Big Centered 3D Logo + Headline */}
      <div ref={heroRef} className="min-h-screen flex flex-col items-center justify-center gap-10 py-24 px-6 text-center relative">

        {/* Placeholder for the sticky traveling logo to occupy while at the top (desktop only) */}
        <div className="hidden md:block w-full max-w-[520px] h-[238px] pointer-events-none" />

        {/* Static logo mark for mobile, where the traveling sticky logo is disabled */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden relative w-full max-w-[280px]"
        >
          <div className="hero-logo-shadow" />
          <LogoPlate variant="wide" glow={true} className="w-full h-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-3"
        >
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_12px_3px_rgba(16,185,129,0.7)]"></span>
          <span className="tech-label tracking-[0.18em]">DEV SMART X / DIGITAL PRODUCT STUDIO</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="giant-headline select-none"
        >
          WE BUILD{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366F1, #A855F7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.5))'
          }}>DIGITAL</span>{' '}
          EXPERIENCES.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[var(--text-muted)] text-base md:text-xl font-normal max-w-xl leading-relaxed"
        >
          Products, platforms, experiments and ideas engineered through technology, design and AI.
        </motion.p>

      </div>

      {/* Section Label */}
      <div id="work" className="w-full max-w-5xl mx-auto px-6 pb-16 text-center flex flex-col items-center justify-center">
        <span className="tech-label text-indigo-500 dark:text-indigo-400 tracking-[0.2em] font-bold block w-full text-center" style={{ textAlign: 'center' }}>SELECTED WORK</span>
        <h2 className="subheadline mt-3 block w-full text-center" style={{ textAlign: 'center', color: 'var(--text-main)' }}>BUILT. SHIPPED. EXPERIENCED.</h2>
      </div>

      {/* Project Track */}
      <div ref={trackRef} className="relative max-w-7xl mx-auto px-6 lg:px-12 pb-40">

        <div className="flex flex-col gap-32">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={el => { rowRefs.current[index] = el; }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ProjectRow
                project={project}
                index={index}
                logoOnRight={index % 2 === 0}
                onSelectProject={onSelectProject}
                trackWidth={trackWidth}
                cardWidth={cardWidth}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

interface ProjectRowProps {
  project: Project;
  index: number;
  logoOnRight: boolean;
  onSelectProject: (project: Project) => void;
  trackWidth: number;
  cardWidth: number;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, index, logoOnRight, onSelectProject, trackWidth, cardWidth }) => {
  const num = (index + 1).toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelectProject(project)}
      data-cursor="VIEW PROJECT"
      className="group cursor-pointer flex flex-col gap-6"
      style={{
        width: '100%',
        maxWidth: `${cardWidth}px`,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
        <span className="text-2xl font-bold font-display" style={{ color: 'var(--text-dim)' }}>{num}</span>
        <span className="text-[var(--text-muted)]">{project.category} • {project.year}</span>
      </div>

      <div
        className="relative w-full aspect-[16/10] overflow-hidden shadow-2xl rounded-lg"
        style={{
          border: '1px solid var(--border-hairline)',
          background: 'var(--bg-secondary)',
          boxShadow: '0 0 0 1px rgba(99,102,241,0), 0 24px 60px rgba(0,0,0,0.15)',
          transition: 'box-shadow 0.5s ease',
        }}
      >
        <ProjectCover
          project={project}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        {project.featured && (
          <div className="absolute top-4 left-4 font-mono text-xs font-bold px-3 py-1" style={{ background: 'linear-gradient(135deg,#6366F1,#A855F7)', color: '#fff', borderRadius: '2px' }}>
            FEATURED
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pb-6" style={{ borderBottom: '1px solid var(--border-hairline)' }}>
        <h3 className="font-display font-extrabold text-2xl md:text-4xl transition-colors flex items-center justify-between"
          style={{ color: 'var(--text-main)' }}
        >
          <span className="group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
            style={{ backgroundImage: 'linear-gradient(135deg,#6366F1,#A855F7)', WebkitBackgroundClip: 'text' } as React.CSSProperties}
          >
            {project.title}
          </span>
          <ArrowUpRight className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[#6366F1] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
        </h3>
        <p className="text-[var(--text-muted)] text-sm md:text-base font-normal line-clamp-2 leading-relaxed max-w-xl">
          {project.shortDescription}
        </p>
      </div>
    </motion.div>
  );
};
