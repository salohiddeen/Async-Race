import React from 'react';

interface CarIconProps {
  color: string;
  size?: number;
}

const CarIcon: React.FC<CarIconProps> = ({ color, size = 60 }) => (
  <svg
    width={size}
    height={size * 0.5}
    viewBox="0 0 120 60"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    {/* Body */}
    <rect x="10" y="25" width="100" height="22" rx="5" fill={color} />
    {/* Cabin */}
    <path d="M30 25 L40 8 L80 8 L95 25 Z" fill={color} />
    {/* Windows */}
    <path d="M43 22 L50 10 L70 10 L77 22 Z" fill="#1a1a2e" opacity="0.6" />
    {/* Front bumper */}
    <rect x="100" y="28" width="12" height="12" rx="3" fill={color} />
    {/* Back bumper */}
    <rect x="8" y="28" width="10" height="12" rx="3" fill={color} />
    {/* Wheels */}
    <circle cx="30" cy="47" r="11" fill="#222" />
    <circle cx="30" cy="47" r="6" fill="#555" />
    <circle cx="88" cy="47" r="11" fill="#222" />
    <circle cx="88" cy="47" r="6" fill="#555" />
    {/* Headlight */}
    <circle cx="107" cy="32" r="4" fill="#fffde7" opacity="0.9" />
    {/* Tail light */}
    <rect x="9" y="30" width="5" height="6" rx="1" fill="#f44" opacity="0.8" />
  </svg>
);

export default CarIcon;
