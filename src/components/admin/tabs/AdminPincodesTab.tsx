import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CityHub } from '../../../types';
import {
  MapPin,
  Search,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

export const AdminPincodesTab: React.FC = () => {
  const { cityHubs, sellers, addCityHub, editCityHub, deleteCityHub, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHub, setSelectedHub] = useState<CityHub | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    state: '',
    pincodes: '',
  });

  const filteredHubs = cityHubs.filter(
    h =>
      h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.areas?.some(a => a.pincode.includes(searchTerm) || a.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      city: '',
      state: 'Maharashtra',
      pincodes: '400001, 400002, 400050',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (hub: CityHub) => {
    setSelectedHub(hub);
    setFormData({
      city: hub.city,
      state: hub.state,
      pincodes: hub.areas?.map(a => a.pincode).join(', ') || '',
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pinArray = formData.pincodes
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length === 6);

    if (pinArray.length === 0) {
      showToast('Please enter at least one valid 6-digit PIN code');
      return;
    }

    addCityHub({
      city: formData.city,
      state: formData.state,
      areas: pinArray.map((pin, idx) => ({
        name: `Sector ${idx + 1}`,
        pincode: pin,
      })),
      isActive: true,
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHub) return;
    const pinArray = formData.pincodes
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length === 6);

    if (pinArray.length === 0) {
      showToast('Please enter at least one valid 6-digit PIN code');
      return;
    }

    editCityHub(selectedHub.id, {
      city: formData.city,
      state: formData.state,
      areas: pinArray.map((pin, idx) => ({
        name: selectedHub.areas?.[idx]?.name || `Sector ${idx + 1}`,
        pincode: pin,
      })),
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-950">Serviceable Delivery Hubs & PIN Codes</h3>
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
              {cityHubs.length} Active Hubs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Indian metro cities and hyper-local postal codes served by Harwalkart and merchant partners.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New City Hub</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by city, state or 6-digit PIN code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* City Hub Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHubs.map(hub => {
          const sellerCount = sellers.filter(
            s => s.address?.city.toLowerCase() === hub.city.toLowerCase()
          ).length;

          return (
            <div
              key={hub.id}
              className="p-5 bg-slate-50 hover:bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col justify-between gap-3 text-xs transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-black text-slate-950 text-base">{hub.city}</h4>
                    <span className="text-slate-500 font-medium text-xs">{hub.state}</span>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Live Hub
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Serviceable PINs:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {hub.areas?.map((area, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold text-slate-800"
                      >
                        {area.pincode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-slate-500">
                <span className="text-[11px]">
                  <strong>{sellerCount}</strong> Shops Operating
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(hub)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 cursor-pointer"
                    title="Edit Hub"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove city hub "${hub.city}"?`)) {
                        deleteCityHub(hub.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-600 cursor-pointer"
                    title="Delete Hub"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
            className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 animate-in zoom-in-95 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-950">
                {isAddModalOpen ? 'Add Delivery City Hub' : `Edit Hub: ${selectedHub?.city}`}
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
                <label className="font-bold text-slate-700">City Name *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">State *</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                  placeholder="e.g. Maharashtra"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Serviceable 6-Digit PIN Codes (Comma-separated) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.pincodes}
                  onChange={e => setFormData({ ...formData, pincodes: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-mono text-xs"
                  placeholder="e.g. 400001, 400002, 400050"
                />
                <p className="text-[10px] text-slate-400">Separate multiple PIN codes with commas.</p>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold rounded-xl cursor-pointer"
              >
                {isAddModalOpen ? 'Save & Activate Hub' : 'Save Hub Changes'}
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
