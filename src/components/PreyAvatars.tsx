import React from 'react';

// ==========================================
// 🪰 Stage 2 Aerial Preys (Vector SVG)
// ==========================================

export const DragonflyAvatar: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={`${className} filter drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] overflow-visible`}>
    {/* Glowing background halo */}
    <circle cx="20" cy="20" r="16" fill="rgba(56,189,248,0.2)" />
    {/* Wings */}
    <ellipse cx="12" cy="14" rx="10" ry="3.5" fill="rgba(224,242,254,0.85)" stroke="#38BDF8" strokeWidth="1" transform="rotate(-20 12 14)" />
    <ellipse cx="28" cy="14" rx="10" ry="3.5" fill="rgba(224,242,254,0.85)" stroke="#38BDF8" strokeWidth="1" transform="rotate(20 28 14)" />
    <ellipse cx="13" cy="22" rx="8" ry="3" fill="rgba(186,230,253,0.75)" stroke="#0284C7" strokeWidth="0.8" transform="rotate(-15 13 22)" />
    <ellipse cx="27" cy="22" rx="8" ry="3" fill="rgba(186,230,253,0.75)" stroke="#0284C7" strokeWidth="0.8" transform="rotate(15 27 22)" />
    {/* Body */}
    <line x1="20" y1="8" x2="20" y2="34" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="20" cy="14" rx="3" ry="5" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
    {/* Head & Eyes */}
    <circle cx="18" cy="8" r="2.5" fill="#38BDF8" />
    <circle cx="22" cy="8" r="2.5" fill="#38BDF8" />
    <circle cx="18" cy="8" r="1" fill="#0369A1" />
    <circle cx="22" cy="8" r="1" fill="#0369A1" />
  </svg>
);

export const BeetleAvatar: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={`${className} filter drop-shadow-[0_0_8px_rgba(245,158,11,0.9)] overflow-visible`}>
    {/* Glowing background halo */}
    <circle cx="20" cy="20" r="16" fill="rgba(245,158,11,0.2)" />
    {/* Antennae */}
    <path d="M 17 12 Q 13 6 10 7" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 23 12 Q 27 6 30 7" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Legs */}
    <path d="M 12 18 L 6 15 M 12 22 L 5 22 M 12 26 L 6 30" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 28 18 L 34 15 M 28 22 L 35 22 M 28 26 L 34 30" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Elytra (Shell) */}
    <ellipse cx="20" cy="23" rx="8" ry="10" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
    <line x1="20" y1="14" x2="20" y2="33" stroke="#78350F" strokeWidth="1.2" />
    {/* Pronotum & Head */}
    <rect x="15" y="13" width="10" height="5" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.2" />
    <circle cx="20" cy="11" r="3.5" fill="#78350F" />
    {/* Golden Shell Sheen */}
    <ellipse cx="17" cy="21" rx="2" ry="5" fill="#FDE68A" opacity="0.6" />
  </svg>
);

export const LizardAvatar: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 40 40" className={`${className} filter drop-shadow-[0_0_8px_rgba(34,197,94,0.9)] overflow-visible`}>
    {/* Glowing background halo */}
    <circle cx="20" cy="20" r="16" fill="rgba(34,197,94,0.2)" />
    {/* Tail */}
    <path d="M 20 28 Q 22 36 29 34 Q 32 30 25 26" fill="#15803D" stroke="#166534" strokeWidth="1" />
    {/* Legs */}
    <path d="M 14 18 L 8 15 M 14 24 L 8 27" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M 26 18 L 32 15 M 26 24 L 32 27" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" />
    {/* Body */}
    <ellipse cx="20" cy="20" rx="6" ry="10" fill="#22C55E" stroke="#166534" strokeWidth="1.5" />
    {/* Back Stripe */}
    <path d="M 20 12 Q 21 20 20 28" fill="none" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
    {/* Head */}
    <polygon points="20,7 15,14 25,14" fill="#16A34A" stroke="#166534" strokeWidth="1.2" />
    <circle cx="17" cy="11" r="1.2" fill="#FEF08A" />
    <circle cx="23" cy="11" r="1.2" fill="#FEF08A" />
  </svg>
);

// ==========================================
// 🐟 Stage 3 Marine Preys (Vector SVG)
// ==========================================

export const CoelacanthAvatar: React.FC<{ className?: string }> = ({ className = 'w-8 h-7' }) => (
  <svg viewBox="0 0 44 32" className={`${className} filter drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] overflow-visible`}>
    <circle cx="22" cy="16" r="15" fill="rgba(6,182,212,0.25)" />
    {/* Tail & Lobed Fins */}
    <path d="M 10 16 L 3 9 L 6 16 L 3 23 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
    <path d="M 16 22 Q 13 28 10 26" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
    <path d="M 16 10 Q 13 4 10 6" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
    {/* Body */}
    <ellipse cx="23" cy="16" rx="14" ry="8.5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
    {/* Scales texture */}
    <path d="M 20 11 Q 23 16 20 21 M 25 11 Q 28 16 25 21" stroke="#38BDF8" strokeWidth="1.2" fill="none" />
    {/* Eye */}
    <circle cx="31" cy="14" r="2.5" fill="#FEF08A" stroke="#0369A1" strokeWidth="0.8" />
    <circle cx="32" cy="14" r="1.2" fill="#0F172A" />
  </svg>
);

export const AmmoniteAvatar: React.FC<{ className?: string }> = ({ className = 'w-8 h-7' }) => (
  <svg viewBox="0 0 40 36" className={`${className} filter drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] overflow-visible`}>
    <circle cx="20" cy="18" r="15" fill="rgba(245,158,11,0.25)" />
    {/* Tentacles protruding */}
    <path d="M 28 18 Q 36 15 37 12 M 28 20 Q 37 20 38 18 M 28 22 Q 36 24 37 26" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Spiral Shell */}
    <circle cx="18" cy="18" r="12" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    <circle cx="17" cy="18" r="8" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="16" cy="18" r="4.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1" />
    {/* Ribs on shell */}
    <path d="M 12 8 L 14 11 M 19 6 L 19 10 M 26 9 L 24 13 M 28 16 L 24 17 M 26 24 L 23 22" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="27" cy="16" r="1.8" fill="#000" />
  </svg>
);

export const SquidAvatar: React.FC<{ className?: string }> = ({ className = 'w-8 h-7' }) => (
  <svg viewBox="0 0 42 36" className={`${className} filter drop-shadow-[0_0_10px_rgba(244,63,94,0.9)] overflow-visible`}>
    <circle cx="21" cy="18" r="15" fill="rgba(244,63,94,0.25)" />
    {/* Mantle fins */}
    <polygon points="6,18 14,8 14,28" fill="#E11D48" stroke="#9F1239" strokeWidth="1" />
    {/* Mantle body */}
    <ellipse cx="18" cy="18" rx="10" ry="6" fill="#F43F5E" stroke="#9F1239" strokeWidth="1.5" />
    {/* Head & Eyes */}
    <ellipse cx="26" cy="18" rx="4" ry="5" fill="#FB7185" stroke="#9F1239" strokeWidth="1.2" />
    <circle cx="26" cy="16" r="1.8" fill="#FEF08A" stroke="#000" strokeWidth="0.8" />
    <circle cx="26" cy="16" r="0.9" fill="#000" />
    {/* Tentacles */}
    <path d="M 29 15 Q 36 12 40 10 M 29 17 Q 37 17 41 16 M 29 19 Q 37 20 41 22 M 29 21 Q 36 24 40 26" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);
