import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LogoPlate } from './LogoPlate';

/**
 * The big centered DEVX 3D logo shown at the top of the homepage:
 * cursor-driven tilt, idle float, and a glass specular sweep.
 */
export const HeroLogo3D: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [14, -14]), { stiffness: 80, damping: 20 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-16, 16]), { stiffness: 80, damping: 20 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);

    const handleMove = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      rawX.set(Math.max(-1, Math.min(1, dx)));
      rawY.set(Math.max(-1, Math.min(1, dy)));
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [rawX, rawY]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none">
      <div
        ref={wrapperRef}
        className="relative w-full"
        style={{ perspective: '1400px', pointerEvents: 'auto' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            rotateX: reduceMotion ? 0 : rotateX,
            rotateY: reduceMotion ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative mx-auto w-full"
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="hero-logo-shadow" />
            <LogoPlate variant="wide" />
          </motion.div>
        </motion.div>

        <motion.span
          className="absolute top-6 right-8 w-3 h-3 rounded-full bg-[#059669] shadow-[0_0_20px_4px_rgba(5,150,105,0.6)]"
          animate={reduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="absolute bottom-2 left-10 w-2.5 h-2.5 rounded-full bg-[#7C3AED] shadow-[0_0_20px_4px_rgba(124,58,237,0.6)]"
          animate={reduceMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>
    </div>
  );
};
