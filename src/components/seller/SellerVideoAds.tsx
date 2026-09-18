import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Seller, Product, ProductVideoAd } from '../../types';
import { VideoAdTemplate } from '../../types/videoTemplate';
import { VIDEO_AD_TEMPLATES } from '../../data/videoTemplates';
import { VideoTemplateModal } from '../video/VideoTemplateModal';
import {
  Video,
  Plus,
  Play,
  Pause,
  Eye,
  Heart,
  Share2,
  Edit2,
  Trash2,
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Volume2,
  VolumeX,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface SellerVideoAdsProps {
  seller: Seller;
  onNavigateToAddProduct?: () => void;
}

export const SellerVideoAds: React.FC<SellerVideoAdsProps> = ({
  seller,
  onNavigateToAddProduct,
}) => {
  const {
    videoAds,
    products,
    addVideoAd,
    editVideoAd,
    deleteVideoAd,
    toggleVideoAdStatus,
    showToast,
    setSelectedProductId,
    setCurrentView,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedVideoAd, setSelectedVideoAd] = useState<ProductVideoAd | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Filter seller's own products and video ads
  const sellerProducts = products.filter(p => p.sellerId === seller.id);
  const availableProducts = sellerProducts.length > 0 ? sellerProducts : products;

  const sellerVideoAds = videoAds.filter(
    v =>
      v.shopId === seller.id ||
      v.sellerName === seller.shopName ||
      v.sellerName === seller.name ||
      v.sellerName === seller.ownerName
  );

  // Form state
  const [formData, setFormData] = useState({
    productId: availableProducts[0]?.id || '',
    productName: availableProducts[0]?.name || 'Local Store Product',
    price: availableProducts[0]?.price || 150,
    videoUrl: VIDEO_AD_TEMPLATES[0].videoUrl,
    thumbnail: VIDEO_AD_TEMPLATES[0].thumbnail,
    templateId: VIDEO_AD_TEMPLATES[0].id,
    templateBadge: VIDEO_AD_TEMPLATES[0].badge,
    targetRadiusKm: 10,
    campaignDurationDays: 30,
    budgetDaily: 200,
    targetPincodes: (seller.serviceablePincodes || ['110001', '110002']).join(', '),
  });

  // Calculate statistics
  const totalViews = sellerVideoAds.reduce((sum, v) => sum + v.views, 0);
  const totalClicks = sellerVideoAds.reduce((sum, v) => sum + v.clicks, 0);
  const totalShares = sellerVideoAds.reduce((sum, v) => sum + v.shares, 0);
  const activeCampaignsCount = sellerVideoAds.filter(v => v.status === 'active').length;

  const handleOpenCreateWithTemplate = (template?: VideoAdTemplate) => {
    const tpl = template || VIDEO_AD_TEMPLATES[0];
    const defaultProduct = availableProducts[0];

    setFormData({
      productId: defaultProduct?.id || '',
      productName: defaultProduct?.name || tpl.suggestedTitle,
      price: defaultProduct?.price || 150,
      videoUrl: tpl.videoUrl,
      thumbnail: tpl.thumbnail,
      templateId: tpl.id,
      templateBadge: tpl.badge,
      targetRadiusKm: tpl.suggestedRadiusKm || seller.serviceRadiusKm || 10,
      campaignDurationDays: tpl.suggestedDurationDays || 30,
      budgetDaily: tpl.suggestedDailyBudget || 200,
      targetPincodes: (seller.serviceablePincodes || ['110001', '110002']).join(', '),
    });

    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (ad: ProductVideoAd) => {
    setSelectedVideoAd(ad);
    setFormData({
      productId: ad.productId,
      productName: ad.productName,
      price: ad.price,
      videoUrl: ad.videoUrl,
      thumbnail: ad.thumbnail,
      templateId: ad.templateId || '',
      templateBadge: ad.templateBadge || 'SPECIAL OFFER',
      targetRadiusKm: ad.targetRadiusKm,
      campaignDurationDays: ad.campaignDurationDays,
      budgetDaily: ad.budgetDaily,
      targetPincodes: ad.targetPincodes?.join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleApplyTemplate = (tpl: VideoAdTemplate) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: tpl.videoUrl,
      thumbnail: tpl.thumbnail,
      templateId: tpl.id,
      templateBadge: tpl.badge,
      budgetDaily: tpl.suggestedDailyBudget,
      targetRadiusKm: tpl.suggestedRadiusKm,
      campaignDurationDays: tpl.suggestedDurationDays,
    }));
    showToast(`Video Template applied: "${tpl.title}"`);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const pinArray = formData.targetPincodes
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    addVideoAd({
      productId: formData.productId,
      productName: formData.productName,
      price: Number(formData.price),
      shopId: seller.id,
      shopName: seller.shopName,
      sellerName: seller.ownerName || seller.name || seller.shopName,
      locationArea: `${seller.address.area}, ${seller.address.city}`,
      city: seller.address.city,
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail,
      targetPincodes: pinArray.length > 0 ? pinArray : ['*'],
      targetRadiusKm: Number(formData.targetRadiusKm),
      campaignDurationDays: Number(formData.campaignDurationDays),
      budgetDaily: Number(formData.budgetDaily),
      status: 'active',
      templateId: formData.templateId,
      templateBadge: formData.templateBadge,
    });

    setIsCreateModalOpen(false);
    showToast('Video Advertisement campaign successfully published!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoAd) return;

    const pinArray = formData.targetPincodes
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    editVideoAd(selectedVideoAd.id, {
      productId: formData.productId,
      productName: formData.productName,
      price: Number(formData.price),
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail,
      targetPincodes: pinArray.length > 0 ? pinArray : ['*'],
      targetRadiusKm: Number(formData.targetRadiusKm),
      campaignDurationDays: Number(formData.campaignDurationDays),
      budgetDaily: Number(formData.budgetDaily),
      templateId: formData.templateId,
      templateBadge: formData.templateBadge,
    });

    setIsEditModalOpen(false);
    showToast('Video ad campaign updated successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SELLER VIDEO COMMERCE &amp; AD ENGINE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Promote {seller.shopName} with Video Ads
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              Turn nearby local shoppers into buyers! Use our library of pre-made, professionally recorded
              video templates or upload your own to showcase your groceries, spices, and fresh products.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Browse Video Templates</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreateWithTemplate()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Quick Template Showcase Carousel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Popular Pre-Made Templates For Your Shop
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold">
              1-Click Launch
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({VIDEO_AD_TEMPLATES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {VIDEO_AD_TEMPLATES.slice(0, 4).map(tpl => (
            <div
              key={tpl.id}
              className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400/80 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black mb-2">
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-black rounded uppercase">
                    {tpl.badge}
                  </span>
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded">
                    {tpl.duration}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                  {tpl.title}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {tpl.categoryLabel} • Rec. ₹{tpl.suggestedDailyBudget}/day
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenCreateWithTemplate(tpl);
                  }}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use This Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase">Video Impressions</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalViews.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500">Local shoppers viewed</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase">Product Clicks</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalClicks.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}% CTR` : '0% CTR'}
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase">Customer Shares</span>
            <Share2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalShares.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-500">Shared via WhatsApp</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase">Active Campaigns</span>
            <Video className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {activeCampaignsCount}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold">
            {sellerVideoAds.length} Total Campaigns
          </span>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Your Video Ad Campaigns
            </h3>
            <p className="text-xs text-slate-500">
              Manage your live promotional videos appearing in Harwalkart video shopping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-3.5 py-2 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Choose Template</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenCreateWithTemplate()}
              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Video Ad</span>
            </button>
          </div>
        </div>

        {sellerVideoAds.length === 0 ? (
          <div className="p-10 text-center space-y-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Video className="w-12 h-12 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Video Ad Campaigns Created Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Video ads get 4x more customer orders! Pick any pre-made video template from our library to start promoting your store in under 60 seconds.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse Ready-Made Video Templates</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellerVideoAds.map(ad => {
              const isPlaying = playingVideoId === ad.id;
              return (
                <div
                  key={ad.id}
                  className="bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Video Player Box */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden group">
                      {isPlaying ? (
                        <video
                          src={ad.videoUrl}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={ad.thumbnail}
                          alt={ad.productName}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Play / Pause overlay */}
                      <button
                        type="button"
                        onClick={() => setPlayingVideoId(isPlaying ? null : ad.id)}
                        className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            ad.status === 'active'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {ad.status}
                        </span>
                        {ad.templateBadge && (
                          <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-bold rounded">
                            {ad.templateBadge}
                          </span>
                        )}
                      </div>

                      {isPlaying && (
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">
                          Featured Product
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                          {ad.productName}
                        </h4>
                        <span className="font-black text-amber-600 text-sm">₹{ad.price}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200 dark:border-slate-800 text-center">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Views</span>
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            {ad.views}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Clicks</span>
                          <span className="font-bold text-xs text-rose-600">{ad.clicks}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Budget</span>
                          <span className="font-bold text-xs text-slate-900 dark:text-white">
                            ₹{ad.budgetDaily}/d
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Radius: {ad.targetRadiusKm}km around {seller.address.area}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Duration: {ad.campaignDurationDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        toggleVideoAdStatus(ad.id, ad.status === 'active' ? 'pending' : 'active')
                      }
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                        ad.status === 'active'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {ad.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause Ad</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Activate Ad</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ad)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 cursor-pointer"
                        title="Edit Campaign"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete campaign for "${ad.productName}"?`)) {
                            deleteVideoAd(ad.id);
                          }
                        }}
                        className="p-2 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-xl text-rose-600 cursor-pointer"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT VIDEO CAMPAIGN MODAL */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <form
            onSubmit={isCreateModalOpen ? handleSaveCreate : handleSaveEdit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[92vh] overflow-y-auto text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {isCreateModalOpen ? 'Create Video Shopping Campaign' : 'Edit Video Campaign'}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Promote products from {seller.shopName} to nearby shoppers
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Template Selector Banner inside Modal */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 rounded-2xl border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs">
                    Pre-Made Video Template Option
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Use high-definition grocery, spices &amp; food video reels
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs cursor-pointer transition shrink-0"
              >
                Choose Template
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Product Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Select Product to Feature in Video *
                </label>
                <select
                  value={formData.productId}
                  onChange={e => {
                    const prod = availableProducts.find(p => p.id === e.target.value);
                    if (prod) {
                      setFormData({
                        ...formData,
                        productId: prod.id,
                        productName: prod.name,
                        price: prod.price,
                      });
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
                >
                  {availableProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promotional Badge */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Promotional Video Badge *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLAT 30% OFF, 100% PURE &amp; NATURAL"
                  value={formData.templateBadge}
                  onChange={e => setFormData({ ...formData, templateBadge: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
              </div>

              {/* Video URL & Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Video Stream URL (.mp4) *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-[11px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Poster / Thumbnail URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-[11px]"
                  />
                </div>
              </div>

              {/* Targeting & Budget */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Target Radius
                  </label>
                  <select
                    value={formData.targetRadiusKm}
                    onChange={e =>
                      setFormData({ ...formData, targetRadiusKm: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value={5}>5 km (Immediate area)</option>
                    <option value={10}>10 km (Hyperlocal)</option>
                    <option value={15}>15 km (Wider city)</option>
                    <option value={25}>25 km (Metro wide)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Duration
                  </label>
                  <select
                    value={formData.campaignDurationDays}
                    onChange={e =>
                      setFormData({ ...formData, campaignDurationDays: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value={7}>7 Days</option>
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Daily Budget
                  </label>
                  <select
                    value={formData.budgetDaily}
                    onChange={e =>
                      setFormData({ ...formData, budgetDaily: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    <option value={100}>₹100 / day</option>
                    <option value={200}>₹200 / day</option>
                    <option value={300}>₹300 / day</option>
                    <option value={500}>₹500 / day</option>
                  </select>
                </div>
              </div>

              {/* Target PIN codes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Target Serviceable PIN Codes (Comma separated or * for all)
                </label>
                <input
                  type="text"
                  value={formData.targetPincodes}
                  onChange={e => setFormData({ ...formData, targetPincodes: e.target.value })}
                  placeholder="e.g. 110001, 110002 or *"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md cursor-pointer transition flex items-center gap-1.5"
              >
                <span>{isCreateModalOpen ? 'Publish Campaign' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REUSABLE VIDEO TEMPLATE MODAL */}
      <VideoTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleApplyTemplate}
        currentTemplateId={formData.templateId}
        title="Choose Ready-to-Use Promotional Video Template"
      />
    </div>
  );
};
