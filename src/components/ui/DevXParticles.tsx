import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  alpha: number;
  pulseSpeed: number;
  phase: number;
}

interface DevXParticlesProps {
  className?: string;
}

const DEVX_BLUE_PALETTE = [
  { color: 'rgba(0, 240, 255, ', glow: '#00F0FF' },   // Electric Cyan
  { color: 'rgba(0, 102, 255, ', glow: '#0066FF' },   // DevX Electric Blue
  { color: 'rgba(99, 102, 241, ', glow: '#6366F1' },  // Vibrant Indigo
  { color: 'rgba(6, 182, 212, ', glow: '#06B6D4' },   // Cyan
  { color: 'rgba(59, 130, 246, ', glow: '#3B82F6' },  // Neon Sapphire
  { color: 'rgba(168, 85, 247, ', glow: '#A855F7' }   // DevX Purple-Blue Accent
];

export const DevXParticles: React.FC<DevXParticlesProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for subtle interactive drift
    let mouse = { x: -1000, y: -1000, radius: 160 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Generate Particles
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      // Calculate count based on viewport area
      const count = Math.min(75, Math.max(35, Math.floor((width * height) / 22000)));

      for (let i = 0; i < count; i++) {
        const palette = DEVX_BLUE_PALETTE[Math.floor(Math.random() * DEVX_BLUE_PALETTE.length)];
        const baseRadius = Math.random() * 2.5 + 1.2;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          color: palette.color,
          glowColor: palette.glow,
          alpha: Math.random() * 0.6 + 0.35,
          pulseSpeed: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint blue connecting vectors for nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach(p => {
        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Pulse size and alpha
        p.phase += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.25;
        const clampedAlpha = Math.max(0.15, Math.min(0.9, currentAlpha));
        const currentRadius = p.baseRadius + Math.sin(p.phase * 0.8) * 0.6;

        // Screen boundary rebound
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Mouse interaction (repel gently)
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouse.radius && mDist > 0) {
          const force = (mouse.radius - mDist) / mouse.radius;
          p.x += (mdx / mDist) * force * 1.8;
          p.y += (mdy / mDist) * force * 1.8;
        }

        // Draw particle dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.8, currentRadius), 0, Math.PI * 2);
        
        // Radial outer glow
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.glowColor;

        ctx.fillStyle = `${p.color}${clampedAlpha})`;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, currentRadius * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-10 w-full h-full ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
};
