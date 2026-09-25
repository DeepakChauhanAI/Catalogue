import React from 'react';

// Adaptive sizing dictionary mapping semantic roles to pixel values
const SIZE_MAP = {
  xs: 18,
  sm: 22,
  modal: 22,
  sidebar: 24,
  navbar: 28,
  md: 28,
  lg: 48,
  hero: 120,
  xl: 120,
  '2xl': 144
};

export default function BrandLogo({
  size = 'navbar',
  className = '',
  style = {},
  withGlow = undefined,
  alt = 'Enterprise Hub Logo'
}) {
  const pixelSize = typeof size === 'number' ? size : (SIZE_MAP[size] || 28);
  const showGlow = withGlow !== undefined ? withGlow : pixelSize >= 48;
  const isLarge = pixelSize >= 80;

  return (
    <div
      className={`brand-logo-frame ${className}`}
      style={{
        width: pixelSize,
        height: pixelSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style
      }}
      title="Enterprise Hub"
    >
      {showGlow && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: isLarge ? '-25%' : '-10%',
            background: isLarge
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.38) 0%, rgba(14, 165, 233, 0.22) 45%, rgba(16, 185, 129, 0.12) 65%, transparent 80%)'
              : 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)',
            filter: isLarge ? 'blur(24px)' : 'blur(12px)',
            borderRadius: '50%',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}
      <img
        src="/brand/logo.png"
        alt={alt}
        width={pixelSize}
        height={pixelSize}
        loading="eager"
        decoding="async"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          position: 'relative',
          zIndex: 1,
          filter: showGlow ? (isLarge ? 'drop-shadow(0 8px 24px rgba(99, 102, 241, 0.32))' : 'drop-shadow(0 4px 16px rgba(99, 102, 241, 0.28))') : 'none',
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
