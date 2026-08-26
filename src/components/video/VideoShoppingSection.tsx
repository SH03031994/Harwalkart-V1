import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVideoAd } from '../../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  MapPin,
  Sparkles,
  Radio,
  PlusCircle,
  Eye,
} from 'lucide-react';

export const VideoShoppingSection: React.FC = () => {
  const {
    videoAds,
    currentLocation,
    setSelectedProductId,
    setCurrentView,
    openShareModal,
    setCurrentRole,
  } = useApp();

  const [playingId, setPlayingId] = useState<string | null>(videoAds[0]?.id || null);
  const [isMuted, setIsMuted] = useState(true);

  // Filter video ads based on user location PIN code or Pan-India
  const visibleAds = videoAds.filter(ad => {
    if (ad.status !== 'active') return false;
    if (ad.targetPincodes.includes('*')) return true;
    return ad.targetPincodes.includes(currentLocation.pincode);
  });

  const displayAds = visibleAds.length > 0 ? visibleAds : videoAds;

  const handleTogglePlay = (adId: string) => {
    setPlayingId(prev => (prev === adId ? null : adId));
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareVideo = (ad: ProductVideoAd) => {
    openShareModal({
      title: `${ad.productName} - Video on HARWALKART`,
      text: `Watch live product showcase of ${ad.productName} from ${ad.shopName} on HARWALKART! Price: ₹${ad.price}`,
      url: `https://harwalkart.com/video/${ad.id}`,
      type: 'video',
      item: ad,
    });
  };

  return (
    <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-8 my-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>GEO-TARGETED VIDEO COMMERCE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Discover Products in Video
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Watch real product demonstrations uploaded by local shops in{' '}
            <span className="text-amber-400 font-semibold">{currentLocation.area}</span> & Harwalkart direct kitchen testing.
          </p>
        </div>

        {/* Action: For Sellers to Create Ads */}
        <button
          onClick={() => {
            setCurrentRole('seller');
            setCurrentView('seller-panel');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Video Ad (Seller Hub)</span>
        </button>
      </div>

      {/* Video Cards Reel Horizontal Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayAds.map(ad => {
          const isPlaying = playingId === ad.id;
          return (
            <div
              key={ad.id}
              className="bg-slate-850 rounded-2xl border border-slate-800 hover:border-amber-400/60 overflow-hidden shadow-lg transition-all flex flex-col relative group"
            >
              {/* Video Player Box */}
              <div className="relative aspect-[9/12] w-full bg-black overflow-hidden">
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 flex flex-col justify-between p-3.5 pointer-events-none">
                  {/* Top Bar inside video */}
                  <div className="flex items-center justify-between pointer-events-auto">
                    <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 flex items-center gap-1 border border-slate-700">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{ad.locationArea}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md hover:bg-slate-800"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleShareVideo(ad)}
                        className="w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md hover:bg-slate-800"
                        title="Share Video"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Center Play Button if paused */}
                  <div className="flex justify-center items-center pointer-events-auto">
                    <button
                      onClick={() => handleTogglePlay(ad.id)}
                      className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
                    </button>
                  </div>

                  {/* Bottom Campaign Stats Overlay */}
                  <div className="text-[10px] text-slate-300 flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {ad.views.toLocaleString()} views
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-sm">
                      Radius: {ad.targetRadiusKm === 5000 ? 'All India' : `${ad.targetRadiusKm} km`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info Bar & View Product CTA */}
              <div className="p-3.5 bg-slate-850 border-t border-slate-800 space-y-2">
                <div>
                  <p className="text-[11px] font-semibold text-amber-400 truncate">{ad.shopName}</p>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{ad.productName}</h4>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Offer Price</span>
                    <span className="text-base font-black text-amber-400">₹{ad.price}</span>
                  </div>

                  <button
                    onClick={() => handleViewProduct(ad.productId)}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Product</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
