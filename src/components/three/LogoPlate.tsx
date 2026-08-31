import React from 'react';

const LOGO_SRC = '/images/brand/devx_logo_brand.png';

interface LogoPlateProps {
  /** Aspect ratio of the rendered plate: 'wide' = full logo lockup, 'square' = centered mark tile */
  variant?: 'wide' | 'square';
  glow?: boolean;
  className?: string;
}

/**
 * 3D Brand Logo Plate:
 * Tight Z-depth extrusion stack producing a solid 3D bevel and glass specular sheen.
 */
export const LogoPlate: React.FC<LogoPlateProps> = ({ variant = 'wide', glow = true, className = '' }) => {
  const isSquare = variant === 'square';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center ${isSquare ? 'aspect-square p-2' : 'aspect-[1132/517]'} ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Tight 3D Depth Layer Stack for solid edge bevel */}
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={LOGO_SRC}
          alt=""
          aria-hidden="true"
          className="devx-logo-img absolute inset-0 w-full h-full object-contain p-1"
          style={{
            transform: `translateZ(${-i * 1.5}px)`,
            opacity: i === 0 ? 1 : 0.5,
          }}
          draggable={false}
        />
      ))}

      {/* Front Face Specular Glass Layer */}
      <img
        src={LOGO_SRC}
        alt="Dev Smart X logo"
        className={`devx-logo-img absolute inset-0 w-full h-full object-contain p-1 ${
          glow ? 'devx-logo-glow' : ''
        }`}
        style={{
          transform: 'translateZ(8px)',
        }}
        draggable={false}
      />
    </div>
  );
};
