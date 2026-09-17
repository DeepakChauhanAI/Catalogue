import React from 'react';

export default function BrandLogo({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id="hubPrismTop" x1="7" y1="4" x2="29" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="hubPrismLeft" x1="7" y1="12" x2="18" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="hubPrismRight" x1="18" y1="12" x2="29" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <filter id="coreGlow" x="12" y="12" width="12" height="12" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Top Facet */}
      <polygon
        points="18,4.5 28.5,11 18,17.5 7.5,11"
        fill="url(#hubPrismTop)"
      />

      {/* Left Facet */}
      <polygon
        points="7.5,12.5 17.2,18.5 17.2,31.5 7.5,25.5"
        fill="url(#hubPrismLeft)"
      />

      {/* Right Facet */}
      <polygon
        points="18.8,18.5 28.5,12.5 28.5,25.5 18.8,31.5"
        fill="url(#hubPrismRight)"
      />

      {/* Center Nexus Core */}
      <circle cx="18" cy="18" r="2.2" fill="#ffffff" filter="url(#coreGlow)" />
    </svg>
  );
}
