import React from 'react';

export const HARWALKART_LOGO_IMAGE_URL = '/file_00000000ee7882118d23d3b83814b7a2.png';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'auto' | 'light' | 'dark' | 'image'; // light = white text for dark backgrounds, dark = dark text for light backgrounds, image = official raster asset
  useImage?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  useImage = false,
  className = '',
  onClick,
}) => {
  // Height presets maintaining exact ~3.33:1 aspect ratio
  const heightClasses = {
    xs: 'h-6 md:h-7',
    sm: 'h-7 md:h-8',
    md: 'h-9 md:h-10',
    lg: 'h-12 md:h-14',
    xl: 'h-16 md:h-20',
  }[size];

  // If user requested the direct uploaded image asset
  if (useImage || variant === 'image') {
    return (
      <div
        id="harwalkart-official-logo"
        onClick={onClick}
        className={`inline-flex items-center select-none cursor-pointer group transition-opacity hover:opacity-95 ${className}`}
        title="HARWALKART - Official Marketplace Logo"
      >
        <img
          src={HARWALKART_LOGO_IMAGE_URL}
          alt="HARWALKART"
          className={`${heightClasses} w-auto max-w-full object-contain shrink-0 rounded-sm`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback gracefully to vector if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Dynamic text color for 'arwal' part based on theme/variant
  // Light variant: for dark backgrounds (Footer, dark theme, Admin hub) -> text is white #FFFFFF
  // Dark variant: for white backgrounds -> text is slate-900 #0F172A
  const getFill = () => {
    if (variant === 'dark') return '#0F172A';
    if (variant === 'light') return '#FFFFFF';
    // 'auto' uses CSS classes via currentColor or semantic fill
    return 'currentColor';
  };

  const getStroke = () => {
    if (variant === 'dark') return '#0F172A';
    if (variant === 'light') return '#CBD5E1';
    return 'transparent';
  };

  return (
    <div
      id="harwalkart-official-logo"
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer group transition-opacity hover:opacity-95 ${className}`}
      title="HARWALKART - Official Marketplace Logo"
    >
      <svg
        viewBox="0 0 1000 300"
        className={`${heightClasses} w-auto max-w-full object-contain shrink-0 text-slate-900 dark:text-white transition-colors duration-200`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="HARWALKART Logo"
      >
        <defs>
          {/* Purple Gradient for H Crescent */}
          <linearGradient id="hkPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#26023B" />
            <stop offset="50%" stopColor="#3B075E" />
            <stop offset="100%" stopColor="#4F0A6B" />
          </linearGradient>

          {/* Golden Yellow Gradient for Kart & Cart matching official brand */}
          <linearGradient id="hkGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#FFAA00" />
          </linearGradient>

          {/* Wheel cutouts mask */}
          <mask id="hkWheelCutouts">
            <rect width="1000" height="300" fill="white" />
            <circle cx="892" cy="226" r="5.5" fill="black" />
            <circle cx="936" cy="226" r="5.5" fill="black" />
          </mask>
        </defs>

        <g id="harwalkart-exact-brand-logo">
          {/* ================= 1. THE 'H' INITIAL & SWOOSH ================= */}
          {/* Left Vertical Pill of 'H' (White Capsule with subtle edge) */}
          <rect
            x="36"
            y="70"
            width="46"
            height="140"
            rx="18"
            ry="18"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
          />

          {/* Right Vertical Pill of 'H' (Solid Golden Yellow) */}
          <rect
            x="122"
            y="70"
            width="46"
            height="140"
            rx="18"
            ry="18"
            fill="url(#hkGoldGrad)"
          />

          {/* Bottom Purple Arc / Crescent under the H arch */}
          <path
            d="M 16 168 C 44 140, 96 136, 172 196 C 138 160, 84 150, 36 172 Z"
            fill="url(#hkPurpleGrad)"
          />

          {/* Top Golden Yellow Dynamic Upward Arch */}
          <path
            d="M 16 168 C 40 116, 102 112, 196 164 C 176 148, 142 130, 116 126 C 68 122, 30 148, 16 168 Z"
            fill="url(#hkGoldGrad)"
          />

          {/* ================= 2. THE TEXT 'arwal' ================= */}
          <g
            id="logo-text-arwal"
            fill={getFill()}
            stroke={getStroke()}
            strokeWidth={variant === 'light' ? '1.5' : '0.5'}
            strokeLinejoin="round"
          >
            {/* 'a' */}
            <path d="M 226 126 C 202 126, 186 144, 186 171 C 186 198, 202 214, 226 214 C 240 214, 252 205, 258 196 L 258 212 L 282 212 L 282 130 L 258 130 L 258 144 C 252 135, 240 126, 226 126 Z M 234 148 C 248 148, 258 158, 258 171 C 258 184, 248 192, 234 192 C 220 192, 210 183, 210 171 C 210 158, 220 148, 234 148 Z" />
            {/* 'r' */}
            <path d="M 296 130 L 320 130 L 320 146 C 326 135, 338 127, 352 128 L 352 155 C 335 152, 320 163, 320 181 L 320 212 L 296 212 Z" />
            {/* 'w' */}
            <path d="M 360 130 L 382 212 L 404 146 L 426 212 L 448 130 L 424 130 L 414 184 L 394 130 L 374 130 Z" />
            {/* 'a' */}
            <path d="M 488 126 C 464 126, 448 144, 448 171 C 448 198, 464 214, 488 214 C 502 214, 514 205, 520 196 L 520 212 L 544 212 L 544 130 L 520 130 L 520 144 C 514 135, 502 126, 488 126 Z M 496 148 C 510 148, 520 158, 520 171 C 520 184, 510 192, 496 192 C 482 192, 472 183, 472 171 C 472 158, 482 148, 496 148 Z" />
            {/* 'l' */}
            <rect x="558" y="70" width="24" height="142" rx="12" ry="12" />
          </g>

          {/* ================= 3. THE TEXT 'kart' ================= */}
          <g id="logo-text-kart" fill="url(#hkGoldGrad)">
            {/* 'k' */}
            <path d="M 596 70 L 620 70 L 620 148 L 650 128 L 680 128 L 642 163 L 682 212 L 652 212 L 620 174 L 620 212 L 596 212 Z" />
            {/* 'a' */}
            <path d="M 718 126 C 694 126, 678 144, 678 171 C 678 198, 694 214, 718 214 C 732 214, 744 205, 750 196 L 750 212 L 774 212 L 774 130 L 750 130 L 750 144 C 744 135, 732 126, 718 126 Z M 726 148 C 740 148, 750 158, 750 171 C 750 184, 740 192, 726 192 C 712 192, 702 183, 702 171 C 702 158, 712 148, 726 148 Z" />
            {/* 'r' */}
            <path d="M 788 130 L 812 130 L 812 146 C 818 135, 830 127, 844 128 L 844 155 C 827 152, 812 163, 812 181 L 812 212 L 788 212 Z" />
            {/* 't' */}
            <path d="M 854 98 L 878 98 L 878 130 L 898 130 L 898 149 L 878 149 L 878 190 C 878 197, 882 201, 890 201 L 898 201 L 898 212 C 889 214, 878 214, 868 210 C 858 204, 854 195, 854 182 L 854 149 L 844 149 L 844 130 L 854 130 Z" />
          </g>

          {/* ================= 4. BIG BOTTOM SMILE SWOOSH ================= */}
          {/* Prominent sweeping golden arc beneath 'arwalkart' reaching up to the shopping cart */}
          <path
            d="M 216 206 C 360 258, 640 268, 868 198 C 640 286, 360 274, 216 206 Z"
            fill="url(#hkGoldGrad)"
          />

          {/* ================= 5. SHOPPING CART WITH SPEED LINES ================= */}
          <g id="logo-shopping-cart" fill="url(#hkGoldGrad)">
            {/* 3 Horizontal Speed / Motion Lines Behind Cart */}
            <line x1="810" y1="172" x2="856" y2="172" stroke="url(#hkGoldGrad)" strokeWidth="6.5" strokeLinecap="round" />
            <line x1="802" y1="186" x2="864" y2="186" stroke="url(#hkGoldGrad)" strokeWidth="6.5" strokeLinecap="round" />
            <line x1="816" y1="200" x2="854" y2="200" stroke="url(#hkGoldGrad)" strokeWidth="6.5" strokeLinecap="round" />

            {/* Cart Handle & Frame Outline */}
            <path
              d="M 814 114 C 822 114, 828 119, 832 127 L 846 156 L 970 156 C 980 156, 986 164, 982 172 L 962 208 C 958 214, 950 218, 942 218 L 866 218"
              fill="none"
              stroke="url(#hkGoldGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Inner Cart Slats */}
            <line x1="854" y1="176" x2="964" y2="176" stroke="url(#hkGoldGrad)" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="862" y1="196" x2="946" y2="196" stroke="url(#hkGoldGrad)" strokeWidth="5.5" strokeLinecap="round" />

            {/* Wheels (Hollow rings) */}
            <g mask="url(#hkWheelCutouts)">
              <circle cx="892" cy="226" r="13" />
              <circle cx="936" cy="226" r="13" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};
