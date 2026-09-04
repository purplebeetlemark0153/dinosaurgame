import React from 'react';

// 1. Cute Walking Dinosaur for Main Entrance
export const CuteMainDino: React.FC<{ className?: string; isWalking?: boolean }> = ({ className = 'w-32 h-32', isWalking = true }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-lg overflow-visible">
        {/* Shadow */}
        <ellipse cx="80" cy="130" rx="45" ry="8" fill="rgba(0,0,0,0.25)" className={isWalking ? "animate-pulse" : ""} />
        
        {/* Tail */}
        <path
          d="M 35 85 Q 15 70 5 80 Q 20 100 45 98 Z"
          fill="#10B981"
          stroke="#065F46"
          strokeWidth="3"
          className={isWalking ? "origin-right transition-transform duration-300" : ""}
        />
        {/* Tail spikes */}
        <polygon points="12,74 20,70 18,78" fill="#F59E0B" />
        <polygon points="26,76 34,72 32,80" fill="#F59E0B" />
        
        {/* Back leg (left) */}
        <g className={isWalking ? "animate-bounce" : ""}>
          <rect x="48" y="95" width="16" height="28" rx="8" fill="#059669" stroke="#065F46" strokeWidth="2.5" />
          <ellipse cx="56" cy="124" rx="12" ry="6" fill="#047857" />
          <circle cx="50" cy="125" r="2" fill="#FEF3C7" />
          <circle cx="56" cy="126" r="2" fill="#FEF3C7" />
          <circle cx="62" cy="125" r="2" fill="#FEF3C7" />
        </g>

        {/* Body */}
        <ellipse cx="80" cy="85" rx="42" ry="32" fill="#10B981" stroke="#065F46" strokeWidth="3" />
        {/* Belly */}
        <path d="M 60 85 Q 75 112 105 105 Q 115 85 95 72 Q 70 70 60 85 Z" fill="#A7F3D0" />

        {/* Back spikes on body */}
        <polygon points="55,56 65,42 75,56" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <polygon points="75,54 85,38 95,54" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <polygon points="95,58 103,46 111,58" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

        {/* Front Leg (right) */}
        <g>
          <rect x="80" y="96" width="18" height="28" rx="9" fill="#10B981" stroke="#065F46" strokeWidth="3" />
          <ellipse cx="89" cy="125" rx="14" ry="7" fill="#059669" stroke="#065F46" strokeWidth="2" />
          <circle cx="82" cy="127" r="2.5" fill="#FEF3C7" />
          <circle cx="89" cy="128" r="2.5" fill="#FEF3C7" />
          <circle cx="96" cy="127" r="2.5" fill="#FEF3C7" />
        </g>

        {/* Head and Neck */}
        <path d="M 98 75 Q 120 70 128 48 Q 135 25 115 20 Q 95 20 95 40 Q 95 65 98 75 Z" fill="#10B981" stroke="#065F46" strokeWidth="3" />
        
        {/* Head bulb */}
        <circle cx="120" cy="38" r="24" fill="#10B981" stroke="#065F46" strokeWidth="3" />
        {/* Snout */}
        <path d="M 125 30 Q 150 35 145 52 Q 135 58 120 54 Z" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
        {/* Nostril */}
        <circle cx="140" cy="38" r="2" fill="#065F46" />

        {/* Big Cute Eye */}
        <circle cx="118" cy="32" r="9" fill="#FFFFFF" stroke="#065F46" strokeWidth="2" />
        <circle cx="120" cy="32" r="5.5" fill="#1E293B" />
        <circle cx="122" cy="30" r="2.5" fill="#FFFFFF" />
        {/* Cute blush */}
        <ellipse cx="120" cy="46" rx="6" ry="3.5" fill="#F472B6" opacity="0.75" />

        {/* Smile */}
        <path d="M 130 48 Q 137 54 142 46" fill="none" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" />

        {/* Tiny Arm with cute wave */}
        <path d="M 102 75 Q 118 78 122 70" fill="none" stroke="#065F46" strokeWidth="5" strokeLinecap="round" />
        <circle cx="122" cy="70" r="3.5" fill="#10B981" />
      </svg>
    </div>
  );
};

// 2. Microraptor (小盜龍 - Authentic 4-winged dromaeosaur theropod dinosaur with sharp teeth, sickle claws, raptor snout, and iridescent plumage)
export const MicroraptorAvatar: React.FC<{ isGliding?: boolean }> = ({ isGliding = false }) => {
  return (
    <svg viewBox="0 0 150 110" className="w-full h-full drop-shadow-lg overflow-visible">
      <defs>
        <linearGradient id="microraptorBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="40%" stopColor="#1E3A8A" />
          <stop offset="80%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="wingFeathers" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#091E42" />
        </linearGradient>
        <linearGradient id="tailFanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="70%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Long Theropod Stiff Tail with Distal Diamond Feather Fan */}
      <g id="dino-tail">
        {/* Tail bone spine */}
        <path
          d="M 50 62 Q 25 65 -15 68 Q -25 69 -32 70"
          fill="none"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Tail feather fronds (diamond fan at tip) */}
        <path
          d="M -5 66 Q -22 52 -45 56 Q -35 70 -48 80 Q -25 78 -5 70 Z"
          fill="url(#tailFanGrad)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Vanes on tail */}
        <line x1="-15" y1="67" x2="-35" y2="58" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-20" y1="68" x2="-40" y2="69" stroke="#E0F2FE" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="-15" y1="69" x2="-38" y2="76" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15" y1="64" x2="0" y2="60" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="63" x2="15" y2="61" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Hind Leg / Lower Wing (Signature Microraptor rear flight feathers!) */}
      <g id="dino-hind-leg">
        {/* Thigh & Shank */}
        <path d="M 58 64 L 52 82 L 42 94" fill="none" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
        {/* Hind-wing feather sheath */}
        <path
          d="M 52 72 Q 35 90 22 96 Q 38 88 48 80 Z"
          fill="url(#wingFeathers)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <path d="M 46 76 Q 32 94 20 98 Q 34 90 42 84 Z" fill="#38BDF8" opacity="0.7" />
        {/* Raptor Sickle Claw (馳龍鐮刀爪) */}
        <path d="M 42 94 L 36 92 Q 32 86 38 85" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 42 94 L 46 98 L 40 100" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Theropod Torso with Raptor Anatomy & Sheen */}
      <g id="dino-torso">
        <path
          d="M 50 62 Q 45 48 65 46 Q 88 44 94 56 Q 96 68 82 72 Q 62 74 50 62 Z"
          fill="url(#microraptorBody)"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Countershading / iridescent belly highlights */}
        <path
          d="M 58 64 Q 72 72 85 68 Q 80 60 70 58 Q 60 58 58 64 Z"
          fill="#38BDF8"
          opacity="0.35"
        />
      </g>

      {/* Forewing / Front Raptor Wings with 3 Wing Claws */}
      <g id="dino-forewing">
        <path
          d={
            isGliding
              ? "M 70 52 Q 55 12 105 18 Q 98 42 82 56 Z"
              : "M 70 52 Q 48 24 92 28 Q 90 48 78 58 Z"
          }
          fill="url(#wingFeathers)"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Primary and secondary feather layers */}
        <path
          d={
            isGliding
              ? "M 75 48 Q 65 20 100 24 Q 92 42 80 52 Z"
              : "M 72 48 Q 55 30 88 32 Q 82 46 76 52 Z"
          }
          fill="#38BDF8"
          opacity="0.6"
        />
        {/* Individual feather separation lines */}
        <line x1="68" y1="26" x2="88" y2="28" stroke="#E0F2FE" strokeWidth="1.5" />
        <line x1="75" y1="20" x2="98" y2="22" stroke="#E0F2FE" strokeWidth="1.5" />

        {/* Predatory Raptor Claws on Wing Bend (小盜龍翼指爪) */}
        <path d="M 94 22 L 102 18 L 98 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M 97 26 L 105 23 L 100 28" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M 92 30 L 100 28 L 96 33" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* S-shaped Raptor Neck & Fierce Theropod Head */}
      <g id="dino-head">
        {/* Muscular Curved Neck */}
        <path
          d="M 86 52 Q 102 48 106 38 Q 112 28 102 26 Q 90 26 84 42 Z"
          fill="url(#microraptorBody)"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Head Crest Feathers */}
        <path d="M 98 24 Q 90 10 82 12 Q 92 20 98 25 Z" fill="#38BDF8" />
        <path d="M 94 22 Q 86 6 78 8 Q 88 18 94 23 Z" fill="#60A5FA" />

        {/* Theropod Raptor Skull & Snout */}
        <path
          d="M 100 28 Q 112 24 128 30 Q 132 36 122 42 L 104 42 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Lower Jaw */}
        <path
          d="M 105 42 L 122 42 Q 120 47 114 47 L 104 46 Z"
          fill="#0F172A"
          stroke="#0F172A"
          strokeWidth="1.5"
        />

        {/* Sharp Carnivorous Serrated Teeth (尖銳利齒) */}
        <polygon points="108,42 110,45 112,42" fill="#FFFFFF" />
        <polygon points="113,42 115,46 117,42" fill="#FFFFFF" />
        <polygon points="118,42 120,45 122,42" fill="#FFFFFF" />
        <polygon points="123,41 125,44 126,41" fill="#FFFFFF" />

        {/* Nostril */}
        <ellipse cx="123" cy="32" rx="1.5" ry="1" fill="#0F172A" />

        {/* Predatory Raptor Eye (金黃色掠食者瞳孔) */}
        <circle cx="109" cy="32" r="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />
        <ellipse cx="110" cy="32" rx="1.6" ry="4" fill="#0F172A" />
        <circle cx="111" cy="30" r="1" fill="#FFFFFF" />
        {/* Brow Ridge (兇猛的眼眶眉脊) */}
        <path d="M 104 28 Q 110 26 116 29" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
};

// 3. Pteranodon (無齒翼龍 - Majestic large pterosaur with wide leathery wingspan, huge backward crest, long toothless beak)
export const PteranodonAvatar: React.FC = () => {
  return (
    <svg viewBox="0 0 160 110" className="w-full h-full drop-shadow-xl overflow-visible">
      <defs>
        <linearGradient id="pteraWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="pteraMembrane" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Far Upper Leathery Wing (Gigantic span) */}
      <g id="ptera-far-wing">
        {/* Main wing bone arm */}
        <path d="M 68 52 Q 50 -10 135 5 Q 115 42 85 54 Z" fill="url(#pteraWingGrad)" stroke="#78350F" strokeWidth="2" />
        {/* Wing membrane */}
        <path d="M 75 48 Q 62 8 125 12 Q 108 40 82 52 Z" fill="url(#pteraMembrane)" opacity="0.8" />
        {/* Wing membrane stretch striations */}
        <line x1="72" y1="25" x2="110" y2="20" stroke="#FEF3C7" strokeWidth="1.5" opacity="0.8" />
        <line x1="78" y1="36" x2="118" y2="28" stroke="#FEF3C7" strokeWidth="1.5" opacity="0.8" />
        {/* Wing tip finger claw */}
        <polygon points="135,5 142,2 138,8" fill="#78350F" />
      </g>

      {/* Muscular Pterosaur Torso */}
      <ellipse cx="75" cy="58" rx="22" ry="14" fill="#B45309" stroke="#78350F" strokeWidth="2.2" />
      {/* Furry pycnofibers countershade on chest */}
      <ellipse cx="78" cy="62" rx="16" ry="9" fill="#D97706" />

      {/* Pterosaur Legs & Tail */}
      <path d="M 60 66 Q 45 78 35 84 Q 48 72 62 68 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
      <path d="M 55 60 Q 38 64 28 66 Q 42 60 56 58 Z" fill="#78350F" />

      {/* Near Lower Wing (Sweeping giant wingspan) */}
      <g id="ptera-near-wing">
        <path d="M 65 60 Q 30 95 0 90 Q 30 72 58 64 Z" fill="url(#pteraWingGrad)" stroke="#78350F" strokeWidth="2" />
        <path d="M 58 62 Q 35 88 12 84 Q 35 70 54 65 Z" fill="url(#pteraMembrane)" opacity="0.85" />
        <line x1="42" y1="70" x2="20" y2="82" stroke="#FEF3C7" strokeWidth="1.5" opacity="0.8" />
        {/* Wing hand claws on bend */}
        <polygon points="62,56 58,48 68,52" fill="#451A03" />
        <polygon points="66,54 64,46 72,50" fill="#451A03" />
      </g>

      {/* Head with Giant Iconic Backward Crest */}
      <g id="ptera-head">
        {/* Large Backward Pointed Sagittal Crest */}
        <path
          d="M 90 52 Q 110 38 120 28 Q 80 0 45 10 Q 82 26 95 48 Z"
          fill="#EA580C"
          stroke="#7C2D12"
          strokeWidth="2.5"
        />
        {/* Crest color gradient accent */}
        <path d="M 110 32 Q 80 6 52 14 Q 78 28 98 42 Z" fill="#FBBF24" opacity="0.6" />

        {/* Head Skull */}
        <circle cx="108" cy="38" r="12" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />

        {/* Dramatic Toothless Long Beak */}
        <path
          d="M 116 35 L 160 44 L 116 50 Z"
          fill="#F59E0B"
          stroke="#92400E"
          strokeWidth="2.2"
        />
        <line x1="116" y1="42" x2="155" y2="44" stroke="#78350F" strokeWidth="1.5" />

        {/* Nostril */}
        <ellipse cx="125" cy="40" rx="2" ry="1" fill="#78350F" />

        {/* Keen Pterosaur Eye */}
        <circle cx="110" cy="36" r="4.5" fill="#FEF08A" stroke="#451A03" strokeWidth="1.5" />
        <circle cx="111" cy="36" r="2.2" fill="#0F172A" />
        <circle cx="112" cy="35" r="0.9" fill="#FFFFFF" />
      </g>
    </svg>
  );
};

// 4. Archaeopteryx (始祖鳥 - Wing claws, feathered flight, colorful)
export const ArchaeopteryxAvatar: React.FC = () => {
  return (
    <svg viewBox="0 0 130 90" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Long feathered fan tail */}
      <path d="M 35 50 Q 5 62 -12 70 Q 12 50 35 44 Z" fill="#0D9488" stroke="#115E59" strokeWidth="2" />
      <path d="M 28 49 Q 0 58 -8 63 Q 12 48 28 45 Z" fill="#5EEAD4" />
      <circle cx="-5" cy="65" r="2" fill="#F59E0B" />
      <circle cx="5" cy="58" r="2" fill="#F59E0B" />

      {/* Body */}
      <ellipse cx="58" cy="48" rx="20" ry="13" fill="#0F766E" stroke="#134E4A" strokeWidth="2" />

      {/* Upper Wing */}
      <path d="M 50 44 Q 35 5 80 15 Q 70 38 60 46 Z" fill="#14B8A6" stroke="#115E59" strokeWidth="2" />
      <path d="M 55 38 Q 45 15 72 20 Q 65 35 58 42 Z" fill="#CCFBF1" />
      {/* Wing Claws (Distinctive Archaeopteryx feature!) */}
      <polygon points="56,12 52,6 59,10" fill="#F59E0B" />
      <polygon points="62,14 60,7 66,12" fill="#F59E0B" />
      <polygon points="68,16 68,9 72,15" fill="#F59E0B" />

      {/* Neck & Head */}
      <circle cx="82" cy="30" r="11" fill="#0F766E" stroke="#134E4A" strokeWidth="2" />
      {/* Beak with tiny teeth */}
      <path d="M 90 28 L 112 33 L 90 38 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

      {/* Eye */}
      <circle cx="82" cy="28" r="3.5" fill="#FEF08A" stroke="#134E4A" strokeWidth="1" />
      <circle cx="83" cy="28" r="1.8" fill="#000" />
      <circle cx="84" cy="27" r="0.7" fill="#FFF" />

      {/* Feathers on head */}
      <path d="M 76 22 Q 70 14 65 18 Q 72 24 76 25 Z" fill="#F59E0B" />
    </svg>
  );
};

// 5. Elasmosaurus (薄板龍 - Gigantic body, extraordinarily long serpentine neck, 4 paddle flippers)
export const ElasmosaurusAvatar: React.FC = () => {
  return (
    <svg viewBox="0 0 190 110" className="w-full h-full drop-shadow-lg overflow-visible">
      {/* Rear Flippers */}
      <path d="M 40 70 Q 20 92 10 95 Q 26 80 40 75 Z" fill="#0284C7" stroke="#075985" strokeWidth="2.5" />
      <path d="M 36 50 Q 18 34 10 36 Q 25 46 38 52 Z" fill="#0369A1" stroke="#075985" strokeWidth="2.5" />

      {/* Tail */}
      <path d="M 28 60 Q 8 64 -2 72 Q 12 55 28 56 Z" fill="#0284C7" stroke="#075985" strokeWidth="2.5" />

      {/* Bulky Main Torso */}
      <ellipse cx="55" cy="62" rx="32" ry="20" fill="#0284C7" stroke="#075985" strokeWidth="2.5" />
      <ellipse cx="58" cy="65" rx="24" ry="12" fill="#7DD3FC" opacity="0.65" />

      {/* Front Giant Flippers */}
      <path d="M 72 75 Q 55 105 42 108 Q 62 92 78 78 Z" fill="#0284C7" stroke="#075985" strokeWidth="2.5" />
      <path d="M 68 48 Q 50 16 38 14 Q 58 30 74 44 Z" fill="#0369A1" stroke="#075985" strokeWidth="2.5" />

      {/* Extraordinarily Long Serpentine S-Neck (薄板龍標誌性超長頸部) */}
      <path
        d="M 80 58 C 105 56 120 40 135 25 C 150 10 168 12 178 18 C 172 26 156 38 138 48 C 118 60 98 68 82 66 Z"
        fill="#0284C7"
        stroke="#075985"
        strokeWidth="2.5"
      />
      {/* Light neck underside countershading */}
      <path
        d="M 86 64 C 104 64 122 56 140 45 C 158 35 170 24 175 20 C 170 24 156 34 136 44 C 116 54 98 62 86 64 Z"
        fill="#BAE6FD"
        opacity="0.8"
      />

      {/* Head with sharp predatory eyes & small sleek skull */}
      <g id="elasmo-head">
        <ellipse cx="178" cy="18" rx="10" ry="6.5" fill="#0284C7" stroke="#075985" strokeWidth="2" />
        {/* Needle-like teeth snout */}
        <path d="M 184 15 L 196 20 L 184 23 Z" fill="#38BDF8" stroke="#075985" strokeWidth="1.8" />
        <line x1="184" y1="19" x2="194" y2="19" stroke="#075985" strokeWidth="1" />

        {/* Eye */}
        <circle cx="176" cy="16" r="3" fill="#FEF08A" stroke="#075985" strokeWidth="1" />
        <circle cx="177" cy="16" r="1.5" fill="#0F172A" />
        <circle cx="178" cy="15" r="0.7" fill="#FFF" />
      </g>
    </svg>
  );
};

// 6. Mosasaurus (滄龍 - Hydrodynamic, razor-sharp teeth, powerful fin)
export const MosasaurusAvatar: React.FC = () => {
  return (
    <svg viewBox="0 0 140 85" className="w-full h-full drop-shadow-lg overflow-visible">
      {/* Powerful Tail and Tail Fin */}
      <path d="M 40 45 Q 15 48 -5 35 Q 5 50 -10 65 Q 15 52 40 48 Z" fill="#334155" stroke="#0F172A" strokeWidth="2" />
      <path d="M 2 40 Q 15 48 5 58 Z" fill="#06B6D4" opacity="0.6" />

      {/* Hydrodynamic Torso */}
      <ellipse cx="65" cy="45" rx="35" ry="16" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
      {/* Pale Underside */}
      <path d="M 45 48 Q 65 60 90 55 Q 70 48 45 48 Z" fill="#94A3B8" />

      {/* Flippers */}
      <path d="M 50 56 Q 38 78 28 80 Q 42 68 55 58 Z" fill="#334155" stroke="#0F172A" strokeWidth="2" />
      <path d="M 80 54 Q 70 78 58 82 Q 74 68 85 56 Z" fill="#334155" stroke="#0F172A" strokeWidth="2" />

      {/* Ferocious Head & Jaws */}
      <path d="M 88 35 Q 120 36 135 44 L 115 56 Q 90 58 85 45 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
      {/* Open Teeth line */}
      <path d="M 100 45 L 132 45" stroke="#EF4444" strokeWidth="2" />
      <polygon points="105,45 108,41 111,45" fill="#FFF" />
      <polygon points="113,45 116,41 119,45" fill="#FFF" />
      <polygon points="121,45 124,41 127,45" fill="#FFF" />
      <polygon points="108,45 111,49 114,45" fill="#FFF" />
      <polygon points="116,45 119,49 122,45" fill="#FFF" />
      <polygon points="124,45 127,49 130,45" fill="#FFF" />

      {/* Sharp Fierce Eye */}
      <circle cx="102" cy="38" r="3" fill="#FACC15" stroke="#713F12" strokeWidth="1" />
      <circle cx="103" cy="38" r="1.5" fill="#000" />
    </svg>
  );
};

// 7. T-Rex (霸王龍 - Massive predator, giant jaw, sharp teeth, strong legs)
export const TRexAvatar: React.FC<{ isBiting?: boolean }> = ({ isBiting = false }) => {
  return (
    <svg viewBox="0 0 150 120" className="w-full h-full drop-shadow-xl overflow-visible">
      {/* Muscular Heavy Tail */}
      <path d="M 50 65 Q 15 50 -5 55 Q 18 80 50 78 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />

      {/* Back Powerful Leg */}
      <g>
        <ellipse cx="60" cy="80" rx="14" ry="18" fill="#92400E" stroke="#78350F" strokeWidth="2" />
        <rect x="54" y="85" width="10" height="22" rx="4" fill="#78350F" />
        <ellipse cx="58" cy="110" rx="10" ry="5" fill="#451A03" />
      </g>

      {/* Muscular Body */}
      <ellipse cx="75" cy="65" rx="32" ry="24" fill="#D97706" stroke="#78350F" strokeWidth="3" />
      <path d="M 58 68 Q 75 88 98 80 Q 95 65 75 58 Z" fill="#FDE68A" opacity="0.6" />

      {/* Front Leg */}
      <g>
        <ellipse cx="78" cy="80" rx="15" ry="18" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
        <rect x="74" y="86" width="11" height="22" rx="5" fill="#B45309" stroke="#78350F" strokeWidth="2" />
        <ellipse cx="80" cy="110" rx="12" ry="6" fill="#78350F" />
        <circle cx="74" cy="112" r="2" fill="#FEF3C7" />
        <circle cx="80" cy="113" r="2" fill="#FEF3C7" />
        <circle cx="86" cy="112" r="2" fill="#FEF3C7" />
      </g>

      {/* Tiny T-Rex Arms */}
      <path d="M 92 68 Q 102 75 106 70" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="106" cy="70" r="2" fill="#FEF3C7" />

      {/* Massive Fierce Head & Jaw */}
      <g className={isBiting ? "origin-center rotate-3 transition-transform" : ""}>
        <path d="M 90 55 Q 110 30 135 30 Q 148 40 148 55 L 125 58 L 98 68 Z" fill="#D97706" stroke="#78350F" strokeWidth="3" />
        {/* Lower Jaw */}
        <path
          d={isBiting ? "M 100 68 L 140 70 L 145 60 L 120 58 Z" : "M 100 68 L 145 64 L 148 56 L 120 58 Z"}
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="2.5"
        />
        {/* Sharp Teeth */}
        <polygon points="122,58 125,52 128,58" fill="#FFF" />
        <polygon points="130,58 133,52 136,58" fill="#FFF" />
        <polygon points="138,58 141,51 144,58" fill="#FFF" />
        <polygon points="124,58 127,64 130,58" fill="#FFF" />
        <polygon points="132,58 135,64 138,58" fill="#FFF" />
        <polygon points="140,58 143,63 146,58" fill="#FFF" />

        {/* Terrifying Brow & Eye */}
        <path d="M 112 36 Q 120 34 125 40" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <circle cx="118" cy="40" r="3.5" fill="#EF4444" stroke="#450A0A" strokeWidth="1" />
        <circle cx="119" cy="40" r="1.8" fill="#000" />
      </g>
    </svg>
  );
};

// 8. Compsognathus (美頜龍 - Nimble, agile, small green swift dinosaur)
export const CompsognathusAvatar: React.FC = () => {
  return (
    <svg viewBox="0 0 100 70" className="w-full h-full drop-shadow-md overflow-visible">
      {/* Long whiplike tail */}
      <path d="M 30 38 Q 10 32 -5 45 Q 12 38 30 42 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
      {/* Slim Body */}
      <ellipse cx="45" cy="38" rx="16" ry="10" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
      {/* Long runner legs */}
      <path d="M 40 44 L 38 58 L 44 60" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      <path d="M 48 44 L 52 58 L 58 60" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
      {/* Slim neck & head */}
      <path d="M 56 34 Q 68 25 76 22 L 90 24 L 78 30 Q 64 36 56 38 Z" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="74" cy="24" r="2.5" fill="#FEF08A" stroke="#15803D" strokeWidth="0.8" />
      <circle cx="75" cy="24" r="1.2" fill="#000" />
      {/* Feather tuft on head/neck */}
      <path d="M 64 26 Q 60 20 56 22" fill="none" stroke="#16A34A" strokeWidth="1.5" />
    </svg>
  );
};

// 9. Modern Bird Silhouette (演化之鳥)
export const ModernBirdAvatar: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <svg viewBox="0 0 140 120" className="w-full h-full filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] overflow-visible">
        {/* Glowing Aura */}
        <circle cx="70" cy="60" r="50" fill="url(#birdGlow)" />
        <defs>
          <radialGradient id="birdGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soaring Bird Wings */}
        <path
          d="M 70 60 Q 30 10 5 25 Q 35 45 60 62 Z"
          fill="#F59E0B"
          stroke="#FEF3C7"
          strokeWidth="2"
          className="animate-pulse"
        />
        <path
          d="M 70 60 Q 110 10 135 25 Q 105 45 80 62 Z"
          fill="#F59E0B"
          stroke="#FEF3C7"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Sleek Bird Body */}
        <ellipse cx="70" cy="65" rx="14" ry="24" fill="#FBBF24" stroke="#FFF" strokeWidth="2" />

        {/* Fan Tail */}
        <path d="M 62 85 Q 70 115 55 118 Q 70 100 70 88 Q 70 100 85 118 Q 70 115 78 85 Z" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />

        {/* Bird Head & Beak */}
        <circle cx="70" cy="45" r="9" fill="#FDE047" stroke="#FFF" strokeWidth="2" />
        <polygon points="67,37 70,28 73,37" fill="#FEF08A" stroke="#D97706" strokeWidth="1" />

        {/* Eye */}
        <circle cx="68" cy="44" r="1.5" fill="#1E293B" />
        <circle cx="72" cy="44" r="1.5" fill="#1E293B" />
      </svg>
    </div>
  );
};
