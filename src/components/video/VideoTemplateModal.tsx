import React, { useState } from 'react';
import { VideoAdTemplate } from '../../types/videoTemplate';
import { VIDEO_AD_TEMPLATES } from '../../data/videoTemplates';
import {
  X,
  Search,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  IndianRupee,
  Layers,
  Film,
  Tag,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface VideoTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: VideoAdTemplate) => void;
  currentTemplateId?: string;
  title?: string;
}

export const VideoTemplateModal: React.FC<VideoTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
  title = 'Select Ready-to-Use Video Ad Template',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingTemplateId, setPlayingTemplateId] = useState<string | null>(
    currentTemplateId || VIDEO_AD_TEMPLATES[0].id
  );
  const [isMuted, setIsMuted] = useState(true);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Templates', count: VIDEO_AD_TEMPLATES.length },
    {
      id: 'spices',
      label: 'Spices & Masala',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'spices').length,
    },
    {
      id: 'grocery',
      label: 'Kirana & Grocery',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'grocery').length,
    },
    {
      id: 'oils',
      label: 'Cold Pressed Oils',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'oils').length,
    },
    {
      id: 'farm_fresh',
      label: 'Farm Fresh Sabzi',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'farm_fresh').length,
    },
    {
      id: 'festive_sale',
      label: 'Festive Offers',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'festive_sale').length,
    },
    {
      id: 'dry_fruits',
      label: 'Dry Fruits & Nuts',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'dry_fruits').length,
    },
    {
      id: 'dairy',
      label: 'Dairy & Ghee',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'dairy').length,
    },
    {
      id: 'express_delivery',
      label: 'Fast Delivery',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'express_delivery').length,
    },
    {
      id: 'cooking',
      label: 'Cooking & Curry',
      count: VIDEO_AD_TEMPLATES.filter(t => t.category === 'cooking').length,
    },
  ];

  const filteredTemplates = VIDEO_AD_TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const cleanSearch = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !cleanSearch ||
      t.title.toLowerCase().includes(cleanSearch) ||
      t.description.toLowerCase().includes(cleanSearch) ||
      t.badge.toLowerCase().includes(cleanSearch) ||
      t.tags.some(tag => tag.toLowerCase().includes(cleanSearch));
    return matchesCategory && matchesSearch;
  });

  const activeTemplate =
    VIDEO_AD_TEMPLATES.find(t => t.id === playingTemplateId) || filteredTemplates[0] || VIDEO_AD_TEMPLATES[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {title}
                </h3>
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-black text-[10px] rounded-full uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Royalty-Free MP4
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from professionally recorded e-commerce promotional video reels. No video editing required!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search video templates by product type, haldi, oil, sabzi, diwali sale..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Grid: Template Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold px-1">
              <span>Showing {filteredTemplates.length} video templates</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5" /> Ready for Harwalkart Video Commerce
              </span>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                <Film className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No video templates match your search
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for &quot;spices&quot;, &quot;ration&quot;, &quot;oil&quot;, or click &quot;All Templates&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredTemplates.map(tpl => {
                  const isSelected = activeTemplate?.id === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setPlayingTemplateId(tpl.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 shadow-md dark:bg-amber-500/15'
                          : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-amber-400'
                      }`}
                    >
                      <div>
                        {/* Thumbnail Container */}
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black mb-2.5">
                          <img
                            src={tpl.thumbnail}
                            alt={tpl.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                          {/* Aspect ratio & duration tags */}
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                              {tpl.aspectRatio} Reel
                            </span>
                            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded">
                              {tpl.categoryLabel}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-semibold rounded flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {tpl.duration}
                          </div>

                          {/* Promotional Overlay Badge */}
                          <div className="absolute bottom-2 left-2 right-2">
                            <span className="inline-block px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase rounded shadow-sm">
                              {tpl.badge}
                            </span>
                          </div>
                        </div>

                        {/* Title & info */}
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                          {tpl.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          Rec: ₹{tpl.suggestedDailyBudget}/day
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onSelectTemplate(tpl);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-xs"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Active Template Live Player & Details (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-current" /> Live Video Stream Preview
                </span>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                </button>
              </div>

              {/* Player Container */}
              <div className="relative aspect-[9/14] max-h-[340px] w-full max-w-[260px] mx-auto rounded-2xl overflow-hidden bg-black shadow-xl border border-slate-800">
                <video
                  key={activeTemplate.videoUrl}
                  src={activeTemplate.videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Floating On-Screen Simulated Harwalkart Overlay */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black uppercase rounded shadow-md">
                    {activeTemplate.badge}
                  </span>
                  <span className="px-1.5 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded">
                    HD 1080p
                  </span>
                </div>

                {/* Bottom simulated product bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 bg-black/75 backdrop-blur-md rounded-xl border border-white/10 pointer-events-none flex items-center justify-between">
                  <div className="text-left overflow-hidden">
                    <span className="text-[10px] text-amber-400 font-bold truncate block">
                      {activeTemplate.suggestedTitle}
                    </span>
                    <span className="text-[9px] text-slate-300">
                      Tap to view product &amp; order
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-lg shrink-0">
                    {activeTemplate.callToAction}
                  </span>
                </div>
              </div>

              {/* Template Specs */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                <h4 className="font-black text-slate-900 dark:text-white text-sm">
                  {activeTemplate.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  {activeTemplate.description}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Recommended Budget
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      ₹{activeTemplate.suggestedDailyBudget} / day
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Delivery Target Radius
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-xs">
                      {activeTemplate.suggestedRadiusKm} km local area
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/20 text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-amber-700 dark:text-amber-400 block">Best suited for:</strong>
                  {activeTemplate.recommendedFor}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(activeTemplate);
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Use &quot;{activeTemplate.title}&quot; in Ad</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
