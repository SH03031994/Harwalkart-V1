import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBannerCarouselProps {
  onSearchSubmit?: (query: string) => void;
}

export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = () => {
  const {
    heroBanners,
    setCurrentView,
    setSelectedCategory,
    setSelectedBrandSlug,
  } = useApp();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter ONLY published (active) banners and sort by priority / display order
  const activeBanners: HeroBanner[] = (heroBanners || [])
    .filter((b) => b.isActive !== false && Boolean(b.imageUrl))
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const totalSlides = activeBanners.length;

  // Auto-advance slider
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    slideTimerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [isPaused, totalSlides]);

  // Reset active slide index if list changes
  useEffect(() => {
    if (activeSlide >= totalSlides && totalSlides > 0) {
      setActiveSlide(0);
    }
  }, [totalSlides, activeSlide]);

  if (totalSlides === 0) {
    return null;
  }

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleBannerClick = (banner: HeroBanner) => {
    const link = banner.linkUrl || banner.buttonLink;
    if (!link) return;

    if (link.startsWith('/brand/')) {
      const brandSlug = link.replace('/brand/', '');
      if (brandSlug === 'kitchen-shakti') {
        setCurrentView('kitchen-shakti');
      } else {
        setSelectedBrandSlug(brandSlug);
        setCurrentView('brands');
      }
    } else if (link.startsWith('/category/')) {
      const cat = link.replace('/category/', '');
      setSelectedCategory(decodeURIComponent(cat));
      setCurrentView('products');
    } else if (link === '/shops') {
      setCurrentView('shops');
    } else if (link === '/video-shopping') {
      setCurrentView('video-shopping');
    } else {
      setCurrentView('products');
    }
  };

  const currentBanner = activeBanners[activeSlide];

  return (
    <div
      className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ================= EXACT IMAGE ONLY DISPLAY CONTAINER ================= */}
      {/* Preserves natural aspect ratio without distortion or cropping */}
      <div
        className={`w-full relative cursor-pointer overflow-hidden transition-all duration-300 flex items-center justify-center`}
        onClick={() => handleBannerClick(currentBanner)}
      >
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title || 'Harwalkart Hero Banner'}
          className="w-full h-auto max-h-[580px] object-contain block mx-auto transition-opacity duration-300"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* ================= MINIMAL CAROUSEL NAVIGATION CONTROLS ================= */}
      {totalSlides > 1 && (
        <>
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all opacity-80 group-hover:opacity-100 shadow-md hover:scale-105 z-10"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center cursor-pointer transition-all opacity-80 group-hover:opacity-100 shadow-md hover:scale-105 z-10"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs z-10">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-6 h-2 bg-amber-400'
                    : 'w-2 h-2 bg-white/70 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
