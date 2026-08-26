import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'auto' | 'light' | 'dark'; // light text for dark backgrounds, dark text for light backgrounds, auto adapts
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  className = '',
  onClick,
}) => {
  // Height presets maintaining exact 1000:300 (3.33:1) aspect ratio
  const heightClasses = {
    sm: 'h-7 md:h-8',
    md: 'h-9 md:h-10',
    lg: 'h-12 md:h-14',
    xl: 'h-16 md:h-20',
  }[size];

  // Dynamic text color for 'arwal' part based on theme
  const getFill = () => {
    if (variant === 'dark') return '#0F172A';
    if (variant === 'light') return '#FFFFFF';
    return '#0F172A';
  };

  const getStroke = () => {
    if (variant === 'dark') return '#0F172A';
    if (variant === 'light') return '#CBD5E1';
    return '#0F172A';
  };

  const isLight = variant === 'light';

  return (
    <div
      id="harwalkart-official-logo"
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer group transition-opacity hover:opacity-95 ${className}`}
      title="HARWALKART - Official Marketplace Logo"
    >
      <svg
        viewBox="0 0 1000 300"
        className={`${heightClasses} w-auto max-w-full object-contain shrink-0`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HARWALKART Logo"
      >
        <defs>
          {/* Purple Gradient for H Crescent */}
          <linearGradient id="harwalPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2A0845" />
            <stop offset="100%" stopColor="#4A0E4E" />
          </linearGradient>

          {/* Golden Yellow Gradient for Kart & Cart */}
          <linearGradient id="harwalGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#FAB800" />
          </linearGradient>
        </defs>

        <g id="harwalkart-exact-brand-logo">
          {/* ================= 1. THE 'H' INITIAL & SWOOSH ================= */}
          {/* Left Vertical Pill of 'H' */}
          <rect
            x="32"
            y="75"
            width="46"
            height="138"
            rx="18"
            ry="18"
            fill={isLight ? '#FFFFFF' : '#FFFFFF'}
            stroke={isLight ? '#E2E8F0' : '#CBD5E1'}
            strokeWidth="3"
          />

          {/* Right Vertical Pill of 'H' (Solid Golden Yellow) */}
          <rect
            x="110"
            y="75"
            width="46"
            height="138"
            rx="18"
            ry="18"
            fill="url(#harwalGoldGradient)"
          />

          {/* Bottom Purple Arc / Crescent */}
          <path
            d="M 12 172 C 40 144, 90 140, 155 198 C 122 162, 70 152, 28 175 Z"
            fill="url(#harwalPurpleGradient)"
          />

          {/* Top Golden Yellow Dynamic Upward Arch */}
          <path
            d="M 12 172 C 36 122, 92 118, 178 166 C 160 152, 130 134, 105 130 C 58 126, 24 152, 12 172 Z"
            fill="url(#harwalGoldGradient)"
          />

          {/* ================= 2. THE TEXT 'arwal' ================= */}
          <g
            id="logo-text-arwal"
            fill={getFill()}
            stroke={getStroke()}
            strokeWidth={isLight ? '1.5' : '0.5'}
            strokeLinejoin="round"
          >
            {/* 'a' */}
            <path d="M 196 132 C 174 132, 158 148, 158 174 C 158 198, 174 213, 196 213 C 210 213, 220 205, 224 197 L 224 210 L 246 210 L 246 135 L 224 135 L 224 148 C 220 140, 210 132, 196 132 Z M 204 153 C 216 153, 224 163, 224 174 C 224 186, 216 193, 204 193 C 191 193, 182 185, 182 174 C 182 162, 191 153, 204 153 Z" />
            {/* 'r' */}
            <path d="M 258 135 L 280 135 L 280 150 C 286 140, 297 132, 310 133 L 310 159 C 294 156, 280 167, 280 184 L 280 210 L 258 210 Z" />
            {/* 'w' */}
            <path d="M 320 135 L 340 210 L 361 150 L 382 210 L 402 135 L 380 135 L 370 184 L 351 135 L 331 135 Z" />
            {/* 'a' */}
            <path d="M 436 132 C 414 132, 398 148, 398 174 C 398 198, 414 213, 436 213 C 450 213, 460 205, 464 197 L 464 210 L 486 210 L 486 135 L 464 135 L 464 148 C 460 140, 450 132, 436 132 Z M 444 153 C 456 153, 464 163, 464 174 C 464 186, 456 193, 444 193 C 431 193, 422 185, 422 174 C 422 162, 431 153, 444 153 Z" />
            {/* 'l' */}
            <rect x="498" y="75" width="22" height="135" rx="11" ry="11" />
          </g>

          {/* ================= 3. THE TEXT 'kart' ================= */}
          <g id="logo-text-kart" fill="url(#harwalGoldGradient)">
            {/* 'k' */}
            <path d="M 530 75 L 553 75 L 553 152 L 582 135 L 610 135 L 574 168 L 612 210 L 583 210 L 553 177 L 553 210 L 530 210 Z" />
            {/* 'a' */}
            <path d="M 648 132 C 626 132, 610 148, 610 174 C 610 198, 626 213, 648 213 C 662 213, 672 205, 676 197 L 676 210 L 698 210 L 698 135 L 676 135 L 676 148 C 672 140, 662 132, 648 132 Z M 656 153 C 668 153, 676 163, 676 174 C 676 186, 668 193, 656 193 C 643 193, 634 185, 634 174 C 634 162, 643 153, 656 153 Z" />
            {/* 'r' */}
            <path d="M 710 135 L 732 135 L 732 150 C 738 140, 749 132, 762 133 L 762 159 C 746 156, 732 167, 732 184 L 732 210 L 710 210 Z" />
            {/* 't' */}
            <path d="M 772 105 L 795 105 L 795 135 L 816 135 L 816 154 L 795 154 L 795 192 C 795 198, 799 202, 806 202 L 816 202 L 816 211 C 807 213, 796 213, 788 210 C 777 205, 772 196, 772 185 L 772 154 L 762 154 L 762 135 L 772 135 Z" />
          </g>

          {/* ================= 4. SHOPPING CART WITH SPEED LINES ================= */}
          <g id="logo-shopping-cart" fill="url(#harwalGoldGradient)">
            {/* Speed Lines Behind Cart */}
            <line x1="828" y1="168" x2="862" y2="168" stroke="url(#harwalGoldGradient)" strokeWidth="7" strokeLinecap="round" />
            <line x1="822" y1="182" x2="870" y2="182" stroke="url(#harwalGoldGradient)" strokeWidth="7" strokeLinecap="round" />
            <line x1="832" y1="196" x2="860" y2="196" stroke="url(#harwalGoldGradient)" strokeWidth="7" strokeLinecap="round" />

            {/* Cart Frame & Handle */}
            <path
              d="M 804 88 C 810 88, 815 93, 818 100 L 832 132 L 976 132 C 986 132, 992 140, 988 148 L 966 190 C 962 196, 954 200, 946 200 L 866 200"
              fill="none"
              stroke="url(#harwalGoldGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Cart Slats */}
            <line x1="852" y1="154" x2="966" y2="154" stroke="url(#harwalGoldGradient)" strokeWidth="6" strokeLinecap="round" />
            <line x1="860" y1="176" x2="948" y2="176" stroke="url(#harwalGoldGradient)" strokeWidth="6" strokeLinecap="round" />

            {/* Wheel 1 (Left) */}
            <circle cx="896" cy="226" r="14" />
            <circle cx="896" cy="226" r="5" fill="#0F172A" />

            {/* Wheel 2 (Right) */}
            <circle cx="940" cy="226" r="14" />
            <circle cx="940" cy="226" r="5" fill="#0F172A" />
          </g>
        </g>
      </svg>
    </div>
  );
};
