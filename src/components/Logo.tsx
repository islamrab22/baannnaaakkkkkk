import React from 'react';
import { Language } from '../types';

interface LogoProps {
  lang: Language;
  className?: string;
  light?: boolean;
}

export default function Logo({ lang, className = '', light = false }: LogoProps) {
  const isRtl = lang === 'ar';
  
  // Colors matching the official Bank of Palestine corporate identity (#9B1A5C / #b01165)
  const brandColor = '#9B1A5C';
  const fillColor = light ? '#FFFFFF' : brandColor;
  const strokeColor = light ? brandColor : '#FFFFFF';
  const circleBgColor = light ? brandColor : '#FFFFFF';
  
  const textColorClass = light ? 'text-white' : 'text-[#9B1A5C]';
  const subColorClass = light ? 'text-white/90' : 'text-[#7B1046]';

  return (
    <div className={`flex items-center gap-4 select-none ${className} ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
      
      {/* =========================================================================
          HIGH-FIDELITY OFFICIAL EMBLEM: VERTICAL PALESTINIAN EMBROIDERY CARTOUCHE
          ========================================================================= */}
      <svg
        className="h-14 sm:h-18 md:h-20 shrink-0 aspect-[1/2.2] drop-shadow-sm"
        viewBox="0 0 100 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Intricate vertical embroidery (Tatreez) silhouette frame with geometric steps */}
        <path
          d="M 50 4 
             L 56 4 L 56 10 L 62 10 L 62 16 L 68 16 L 68 22 L 74 22 L 74 30 L 70 30 L 70 36 L 76 36 L 76 44 L 82 44 L 82 52 L 88 52 L 88 60 L 84 60 L 84 66 L 90 66 L 90 76 L 94 76 L 94 86 L 90 86 L 90 94 L 94 94 L 94 104 L 90 104 L 90 110 L 90 116 L 94 116 L 94 126 L 90 126 L 90 134 L 94 134 L 94 144 L 90 144 L 90 154 L 84 154 L 84 160 L 88 160 L 88 168 L 82 168 L 82 176 L 76 176 L 76 184 L 70 184 L 70 190 L 74 190 L 74 198 L 68 198 L 68 204 L 62 204 L 62 210 L 56 210 L 56 216 L 50 216
             L 44 216 L 44 210 L 38 210 L 38 204 L 32 204 L 32 198 L 26 198 L 26 190 L 30 190 L 30 184 L 24 184 L 24 176 L 18 176 L 18 168 L 12 168 L 12 160 L 16 160 L 16 154 L 10 154 L 10 144 L 6 144 L 6 134 L 10 134 L 10 126 L 6 126 L 6 116 L 10 116 L 10 110 L 10 104 L 6 104 L 6 94 L 10 94 L 10 86 L 6 86 L 6 76 L 10 76 L 10 66 L 16 66 L 16 60 L 12 60 L 12 52 L 18 52 L 18 44 L 24 44 L 24 36 L 30 36 L 30 30 L 26 30 L 26 22 L 32 22 L 32 16 L 38 16 L 38 10 L 44 10 L 44 4 Z"
          fill={fillColor}
        />

        {/* Traditional Tatreez cross-stitch geometric lace cutouts (inner patterns) */}
        {/* Top Diamond / Star motifs */}
        <polygon points="50,14 54,22 50,30 46,22" fill={strokeColor} opacity="0.9" />
        <polygon points="50,34 56,42 50,50 44,42" fill={strokeColor} opacity="0.9" />
        <rect x="48" y="56" width="4" height="4" fill={strokeColor} opacity="0.8" />
        <rect x="42" y="62" width="4" height="4" fill={strokeColor} opacity="0.8" />
        <rect x="54" y="62" width="4" height="4" fill={strokeColor} opacity="0.8" />
        
        {/* Bottom Diamond / Star motifs */}
        <polygon points="50,206 54,198 50,190 46,198" fill={strokeColor} opacity="0.9" />
        <polygon points="50,186 56,178 50,170 44,178" fill={strokeColor} opacity="0.9" />
        <rect x="48" y="160" width="4" height="4" fill={strokeColor} opacity="0.8" />
        <rect x="42" y="154" width="4" height="4" fill={strokeColor} opacity="0.8" />
        <rect x="54" y="154" width="4" height="4" fill={strokeColor} opacity="0.8" />

        {/* Side decorative triangles and points */}
        <polygon points="18,110 24,104 24,116" fill={strokeColor} opacity="0.9" />
        <polygon points="82,110 76,104 76,116" fill={strokeColor} opacity="0.9" />
        <polygon points="18,90 24,84 24,96" fill={strokeColor} opacity="0.7" />
        <polygon points="82,90 76,84 76,96" fill={strokeColor} opacity="0.7" />
        <polygon points="18,130 24,124 24,136" fill={strokeColor} opacity="0.7" />
        <polygon points="82,130 76,124 76,136" fill={strokeColor} opacity="0.7" />

        {/* ==================== CENTER CIRCULAR MEDALLION ==================== */}
        <circle
          cx="50"
          cy="110"
          r="33"
          fill={circleBgColor}
          stroke={fillColor}
          strokeWidth="3"
        />
        
        <circle
          cx="50"
          cy="110"
          r="30"
          fill="none"
          stroke={fillColor}
          strokeWidth="1"
          strokeDasharray="2 1.5"
        />

        {/* ==================== DOME OF THE ROCK ILLUSTRATION ==================== */}
        {/* Base Platform */}
        <path d="M 28 116 L 72 116" stroke={fillColor} strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Octagonal building base */}
        <path d="M 33 116 L 33 108 L 67 108 L 67 116 Z" fill={fillColor} />
        
        {/* Middle level structure */}
        <path d="M 35 108 L 35 101 L 65 101 L 65 108 Z" fill={fillColor} opacity="0.95" />
        
        {/* Vertical pillars/columns detail lines */}
        <line x1="39" y1="116" x2="39" y2="108" stroke={strokeColor} strokeWidth="0.8" />
        <line x1="45" y1="116" x2="45" y2="108" stroke={strokeColor} strokeWidth="0.8" />
        <line x1="50" y1="116" x2="50" y2="108" stroke={strokeColor} strokeWidth="0.8" />
        <line x1="55" y1="116" x2="55" y2="108" stroke={strokeColor} strokeWidth="0.8" />
        <line x1="61" y1="116" x2="61" y2="108" stroke={strokeColor} strokeWidth="0.8" />

        {/* Middle level arched window lines */}
        <line x1="41" y1="107" x2="41" y2="102" stroke={strokeColor} strokeWidth="0.6" />
        <line x1="47" y1="107" x2="47" y2="102" stroke={strokeColor} strokeWidth="0.6" />
        <line x1="53" y1="107" x2="53" y2="102" stroke={strokeColor} strokeWidth="0.6" />
        <line x1="59" y1="107" x2="59" y2="102" stroke={strokeColor} strokeWidth="0.6" />

        {/* Famous Dome of the Rock Golden/Official Dome curve */}
        <path
          d="M 38 101 C 38 88, 62 88, 62 101 Z"
          fill={light ? brandColor : '#E5C158'}
          stroke={fillColor}
          strokeWidth="1"
        />
        
        {/* Dome structural stripes */}
        <path d="M 44 100 C 45 94, 47 94, 48 100" stroke={strokeColor} strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M 50 101 V 91" stroke={strokeColor} strokeWidth="0.5" fill="none" opacity="0.6" />
        <path d="M 56 100 C 55 94, 53 94, 52 100" stroke={strokeColor} strokeWidth="0.5" fill="none" opacity="0.6" />

        {/* Top Crescent Spire */}
        <line x1="50" y1="91" x2="50" y2="84" stroke={fillColor} strokeWidth="1.2" />
        <circle cx="50" cy="83" r="1" fill={fillColor} />
        <path d="M 50 83 C 51.5 83, 51.5 81, 50 81 C 48.5 81, 48.5 83, 50 83 Z" fill={fillColor} />

        {/* Main arched entrance */}
        <path d="M 48 116 L 48 111 C 48 110, 52 110, 52 111 L 52 116 Z" fill={strokeColor} />

        {/* ==================== ARABIC CALLIGRAPHY BRUSH STROKES ==================== */}
        <path
          d="M 35 124 
             C 40 124, 42 120, 46 120
             C 50 120, 51 127, 54 127
             C 57 127, 60 121, 62 123
             C 64 125, 61 129, 58 129
             C 53 129, 51 124, 47 124
             C 43 124, 41 127, 35 124 Z"
          fill={fillColor}
        />
        <path
          d="M 39 131
             C 45 131, 48 134, 55 131
             C 59 129, 60 127, 62 129"
          stroke={fillColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* =========================================================================
          OFFICIAL LOGOTYPE TYPOGRAPHY: BILINGUAL ARABIC AND ENGLISH BRAND TEXTS
          ========================================================================= */}
      <div className="flex flex-col justify-center">
        {/* Arabic Brand Text with elegant custom styling */}
        <span 
          className={`text-2xl sm:text-3xl font-extrabold ${textColorClass} tracking-normal leading-none font-sans`}
          style={{ 
            fontFamily: '"Tajawal", sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          بنك فلسطين
        </span>
        
        {/* English Brand Text with sophisticated spaced layout */}
        <span 
          className={`text-[9px] sm:text-[10px] font-bold ${subColorClass} tracking-[0.14em] block mt-1.5`}
          style={{ 
            fontFamily: 'Georgia, serif, system-ui',
            wordSpacing: '0.05em'
          }}
        >
          BANK OF PALESTINE
        </span>
      </div>

    </div>
  );
}

