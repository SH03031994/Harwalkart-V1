import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ProductVideoAd } from '../../../types';
import {
  Video,
  Search,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  Eye,
  Heart,
} from 'lucide-react';

export const AdminVideosTab: React.FC = () => {
  const { videoAds, products, sellers, addVideoAd, editVideoAd, deleteVideoAd, toggleVideoAdStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<ProductVideoAd | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    productId: products[0]?.id || '',
    productName: products[0]?.name || 'Kitchen Shakti Turmeric Powder',
    price: 120,
    shopId: 'seller-hk-direct',
    shopName: 'Harwalkart Official (Kitchen Shakti)',
    sellerName: 'Harwalkart Official',
    locationArea: 'Delhi NCR',
    city: 'New Delhi',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-spices-on-a-wooden-spoon-41221-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=60',
    targetPincodes: '110001, 110002',
    targetRadiusKm: 10,
    campaignDurationDays: 30,
    budgetDaily: 200,
  });

  const filteredVideos = videoAds.filter(
    v =>
      v.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    const defaultProduct = products[0];
    setFormData({
      productId: defaultProduct?.id || '',
      productName: defaultProduct?.name || 'Kitchen Shakti Turmeric Powder',
      price: defaultProduct?.price || 120,
      shopId: defaultProduct?.sellerId || 'seller-hk-direct',
      shopName: defaultProduct?.sellerName || 'Harwalkart Official',
      sellerName: defaultProduct?.sellerName || 'Harwalkart Official',
      locationArea: 'Central Delhi',
      city: 'New Delhi',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-spices-on-a-wooden-spoon-41221-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=60',
      targetPincodes: '110001, 110002, 400001',
      targetRadiusKm: 10,
      campaignDurationDays: 30,
      budgetDaily: 200,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (v: ProductVideoAd) => {
    setSelectedVideo(v);
    setFormData({
      productId: v.productId,
      productName: v.productName,
      price: v.price,
      shopId: v.shopId,
      shopName: v.shopName,
      sellerName: v.sellerName,
      locationArea: v.locationArea,
      city: v.city,
      videoUrl: v.videoUrl,
      thumbnail: v.thumbnail,
      targetPincodes: v.targetPincodes?.join(', ') || '',
      targetRadiusKm: v.targetRadiusKm,
      campaignDurationDays: v.campaignDurationDays,
      budgetDaily: v.budgetDaily,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pinArray = formData.targetPincodes.split(',').map(p => p.trim()).filter(Boolean);

    addVideoAd({
      productId: formData.productId,
      productName: formData.productName,
      price: Number(formData.price),
      shopId: formData.shopId,
      shopName: formData.shopName,
      sellerName: formData.sellerName,
      locationArea: formData.locationArea,
      city: formData.city,
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail,
      targetPincodes: pinArray,
      targetRadiusKm: Number(formData.targetRadiusKm),
      campaignDurationDays: Number(formData.campaignDurationDays),
      budgetDaily: Number(formData.budgetDaily),
      status: 'active',
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) return;
    const pinArray = formData.targetPincodes.split(',').map(p => p.trim()).filter(Boolean);

    editVideoAd(selectedVideo.id, {
      productName: formData.productName,
      price: Number(formData.price),
      videoUrl: formData.videoUrl,
      thumbnail: formData.thumbnail,
      targetPincodes: pinArray,
      targetRadiusKm: Number(formData.targetRadiusKm),
      campaignDurationDays: Number(formData.campaignDurationDays),
      budgetDaily: Number(formData.budgetDaily),
      city: formData.city,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Short Video Shopping Feed Management</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {videoAds.length} Videos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer interactive TikTok/Reels-style product videos that broadcast to local customers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Video Ad</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos by product, shop or city..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(v => (
          <div
            key={v.id}
            className="p-4 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
          >
            <div className="space-y-3">
              <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900">
                <img src={v.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 text-white">
                  <div className="flex justify-between items-center">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {v.city} • {v.targetRadiusKm} KM
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        v.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-xs line-clamp-1">{v.productName}</h4>
                    <p className="text-slate-300 text-[11px] font-medium">{v.shopName} • ₹{v.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> {v.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> {v.clicks} clicks
                </span>
                <span className="text-slate-500">₹{v.budgetDaily}/day</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <button
                onClick={() => toggleVideoAdStatus(v.id, v.status === 'active' ? 'pending' : 'active')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer ${
                  v.status === 'active'
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {v.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{v.status === 'active' ? 'Pause Video' : 'Make Active'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                  title="Edit Video"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete video campaign for "${v.productName}"?`)) {
                      deleteVideoAd(v.id);
                    }
                  }}
                  className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                  title="Delete Video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Create Video Shopping Ad' : 'Edit Video Ad'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Featured Product *</label>
                <select
                  value={formData.productId}
                  onChange={e => {
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setFormData({
                        ...formData,
                        productId: prod.id,
                        productName: prod.name,
                        price: prod.price,
                        shopName: prod.sellerName,
                        shopId: prod.sellerId,
                      });
                    }
                  }}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Video Stream URL (.mp4) *</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Poster / Thumbnail URL *</label>
                <input
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={e => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Broadcast Radius (KM)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.targetRadiusKm}
                    onChange={e => setFormData({ ...formData, targetRadiusKm: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Daily Budget (₹)</label>
                <input
                  type="number"
                  value={formData.budgetDaily}
                  onChange={e => setFormData({ ...formData, budgetDaily: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Publish Video Campaign' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
