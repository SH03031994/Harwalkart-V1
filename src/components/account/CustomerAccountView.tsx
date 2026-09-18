import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { Logo } from '../common/Logo';
import { LoyaltyPointsSection } from './LoyaltyPointsSection';
import {
  User,
  ShoppingBag,
  ShoppingCart,
  Heart,
  MapPin,
  Star,
  MessageSquare,
  LogOut,
  ExternalLink,
  Plus,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Package,
  Clock,
  Sparkles,
  Coins,
  Award,
  ArrowRight,
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    authSession,
    customerLogout,
    updateCustomerProfile,
    themeMode,
    isDarkMode,
    setThemeMode,
    toggleDarkMode,
    orders,
    products,
    cart,
    cartCount,
    cartTotal,
    wishlist,
    supportTickets,
    setSelectedTrackingOrderId,
    navigate,
    updateSavedAddress,
    showToast,
    customerUser,
    loyaltyBalance,
    loyaltyTier,
    loyaltyPointsHistory,
  } = useApp();

  const customer = authSession.customer || customerUser || {
    id: 'cust_default',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '9876543210',
    pincode: '110001',
    address: 'Flat 402, Royal Residency, Connaught Place, New Delhi',
    savedAddresses: [
      {
        id: 'addr_1',
        name: 'Rahul Verma (Home)',
        mobile: '9876543210',
        addressLine: 'Flat 402, Royal Residency, Near Metro Gate 3',
        area: 'Connaught Place',
        city: 'New Delhi',
        pincode: '110001',
        isDefault: true,
      },
    ],
    wishlist: [],
    loyaltyPoints: loyaltyBalance ?? 340,
    loyaltyTier: loyaltyTier ?? 'Gold',
    loyaltyPointsHistory: loyaltyPointsHistory,
    isVerified: true,
    joinedDate: '2025-01-10',
    themePreference: themeMode,
  };

  const pointsCount = loyaltyBalance ?? customer.loyaltyPoints ?? 340;
  const tierName = loyaltyTier ?? customer.loyaltyTier ?? 'Gold';
  const historyList = (loyaltyPointsHistory && loyaltyPointsHistory.length > 0)
    ? loyaltyPointsHistory
    : (customer.loyaltyPointsHistory || []);

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty' | 'cart' | 'wishlist' | 'addresses' | 'reviews' | 'support'>('orders');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(customer.name);
  const [profilePhone, setProfilePhone] = useState(customer.phone);
  const [profileEmail, setProfileEmail] = useState(customer.email);
  const [profilePincode, setProfilePincode] = useState(customer.pincode || '110001');
  const [profileAddress, setProfileAddress] = useState(customer.address || '');
  const [profileTheme, setProfileTheme] = useState<'light' | 'dark' | 'system'>(customer.themePreference || themeMode);

  // Address modal
  const [newAddrModal, setNewAddrModal] = useState(false);
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPin, setNewPin] = useState('');

  // Reviews demo state
  const [customerReviews, setCustomerReviews] = useState([
    {
      id: 'rev_1',
      productName: 'Kitchen Shakti Haldi Powder (500g)',
      rating: 5,
      comment: 'Extremely fresh aroma, pure organic color. Made my curries taste delicious!',
      date: '14 Feb 2025',
      verified: true,
    },
    {
      id: 'rev_2',
      productName: 'Fortune Super Basmati Rice (5kg)',
      sellerName: 'Sharma Kirana Store',
      rating: 5,
      comment: 'Super fast delivery in 35 minutes from Sharma Kirana near CP. Sealed packaging.',
      date: '18 Feb 2025',
      verified: true,
    },
  ]);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: profileName,
      phone: profilePhone,
      email: profileEmail,
      pincode: profilePincode,
      address: profileAddress,
      themePreference: profileTheme,
    });
    setThemeMode(profileTheme);
    setIsEditingProfile(false);
    showToast('Your customer profile and theme settings have been updated!');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || !newAddressLine) return;
    updateSavedAddress({
      id: `addr_${Date.now()}`,
      name: `${customer.name} (New Address)`,
      mobile: customer.phone || '9876543210',
      addressLine: newAddressLine,
      area: newArea || 'Local Area',
      city: newCity || 'City',
      pincode: newPin,
      isDefault: false,
    });
    setNewAddrModal(false);
    setNewAddressLine('');
    setNewArea('');
    setNewCity('');
    setNewPin('');
    showToast('New address saved to your address book!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in">
      {/* Account Profile Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 text-xl font-black flex items-center justify-center border-2 border-amber-400 shadow-sm shrink-0">
            {customer.name ? customer.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-950 dark:text-white">{customer.name || 'Harwalkart Shopper'}</h1>
              <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified Customer
              </span>
              <button
                onClick={() => setActiveTab('loyalty')}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 hover:from-amber-100 hover:to-amber-200 border border-amber-300 dark:border-amber-700/60 text-slate-950 dark:text-amber-200 font-black text-xs px-3 py-1 rounded-xl shadow-2xs transition-all cursor-pointer"
                title="View Harwalkart Loyalty Rewards & Balance"
              >
                <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{pointsCount} Points</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                  {tierName}
                </span>
              </button>
              <div className="hidden md:block pl-2 border-l border-slate-200 dark:border-slate-800">
                <Logo size="sm" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              +91 {customer.phone} • {customer.email} • PIN: {customer.pincode || '110001'}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Member since {customer.joinedDate || '2025'} • Theme: <strong className="text-slate-700 dark:text-slate-300 capitalize">{themeMode}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Quick theme switcher button in header */}
          <button
            id="account-header-theme-toggle"
            type="button"
            onClick={toggleDarkMode}
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={customerLogout}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border border-rose-200 dark:border-rose-900/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Customer Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1 bg-white dark:bg-slate-900 p-3 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs h-max transition-colors">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profile & Theme</span>
            </div>
            {themeMode === 'dark' && <Moon className="w-3.5 h-3.5 text-amber-400" />}
            {themeMode === 'light' && <Sun className="w-3.5 h-3.5 text-amber-600" />}
            {themeMode === 'system' && <Monitor className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'loyalty' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>My Loyalty Points</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              activeTab === 'loyalty' ? 'bg-slate-950 text-amber-400' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}>
              {pointsCount} pts
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'cart' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart & Bag</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{cartCount} items</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{customer.savedAddresses?.length || 1}</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{customerReviews.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'support' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Support Messages</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 dark:bg-slate-100/10 px-1.5 py-0.5 rounded-full">{supportTickets.length}</span>
          </button>

          {/* Sidebar Dark Mode Switcher & Logout */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-1">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle dark theme"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? (
                  <Moon className="w-4 h-4 text-amber-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>{isDarkMode ? 'Dark Theme' : 'Light Theme'}</span>
              </div>
              <div className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors duration-200 ${
                isDarkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}>
                <div className="w-3 h-3 rounded-full bg-white shadow-xs"></div>
              </div>
            </button>

            <button
              onClick={customerLogout}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Content Area (9 Cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">Customer Profile & Settings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage your contact number, email, theme preferences, and default PIN code</p>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Edit Details
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={e => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Default PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={profilePincode}
                        onChange={e => setProfilePincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Display & Theme Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setProfileTheme('light')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          profileTheme === 'light'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileTheme('dark')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          profileTheme === 'dark'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dark</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileTheme('system')}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          profileTheme === 'system'
                            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>System</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Address</label>
                    <textarea
                      rows={2}
                      value={profileAddress}
                      onChange={e => setProfileAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                  >
                    Save Updated Profile
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Customer Name</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{customer.name}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Mobile Number</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">+91 {customer.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Email Address</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{customer.email}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Default PIN Code</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{customer.pincode || '110001'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Current Theme Setting</span>
                    <div className="flex items-center gap-2 mt-1">
                      {isDarkMode ? (
                        <Moon className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
                        {themeMode === 'system' ? `System Auto (${isDarkMode ? 'Dark' : 'Light'})` : `${themeMode} Mode`}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Account Status</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Verified Mobile Account</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 sm:col-span-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Primary Delivery Address</span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{customer.address || customer.savedAddresses?.[0]?.addressLine || 'Address on record'}</p>
                  </div>
                </div>
              )}

              {/* ================= THEME & DISPLAY SETTINGS SECTION ================= */}
              <div id="theme-preferences-section" className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Palette className="w-4 h-4" />
                      </div>
                      <h4 className="text-base font-black text-slate-950 dark:text-white">
                        Theme & Display Preferences
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Customize Harwalkart for daytime shopping or late-night viewing. Your preference is persisted on this device.
                    </p>
                  </div>

                  {/* Quick 1-Click Dark Mode Toggle Switch */}
                  <button
                    id="profile-quick-dark-toggle"
                    type="button"
                    onClick={toggleDarkMode}
                    className={`px-3.5 py-2 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                      isDarkMode
                        ? 'bg-slate-950 hover:bg-slate-850 text-amber-400 border-amber-500/40'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                    title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                  >
                    {isDarkMode ? (
                      <>
                        <Moon className="w-4 h-4 text-amber-400" />
                        <span>Dark Mode: <strong className="text-amber-300">ON</strong></span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4 text-amber-600" />
                        <span>Dark Mode: <strong className="text-slate-600">OFF</strong></span>
                      </>
                    )}
                    {/* Animated Switch Pill */}
                    <div className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors duration-200 ${
                      isDarkMode ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
                    }`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                    </div>
                  </button>
                </div>

                {/* 3 Interactive Mode Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Option 1: Light */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('light');
                      setProfileTheme('light');
                      updateCustomerProfile({ themePreference: 'light' });
                      showToast('Switched to Light Theme');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                      themeMode === 'light'
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Sun className="w-5 h-5" />
                      </div>
                      {themeMode === 'light' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 stroke-[3]" /> Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white">Light Mode</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Crisp, high-contrast daytime layout with classic Indian marketplace warm amber accents.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Dark */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('dark');
                      setProfileTheme('dark');
                      updateCustomerProfile({ themePreference: 'dark' });
                      showToast('Switched to Dark Theme');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                      themeMode === 'dark'
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center">
                        <Moon className="w-5 h-5" />
                      </div>
                      {themeMode === 'dark' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 stroke-[3]" /> Active
                        </span>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white">Dark Mode</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Deep slate midnight tones. Reduces eye strain during late-night shopping and preserves OLED battery.
                      </p>
                    </div>
                  </button>

                  {/* Option 3: System Auto */}
                  <button
                    type="button"
                    onClick={() => {
                      setThemeMode('system');
                      setProfileTheme('system');
                      updateCustomerProfile({ themePreference: 'system' });
                      showToast('Set to follow System Theme');
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                      themeMode === 'system'
                        ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                        <Monitor className="w-5 h-5" />
                      </div>
                      {themeMode === 'system' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                          <Check className="w-3 h-3 stroke-[3]" /> Active (Auto)
                        </span>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white">System Auto</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        Automatically matches your device operating system preference (currently active: {isDarkMode ? 'Dark' : 'Light'}).
                      </p>
                    </div>
                  </button>
                </div>

                {/* Theme Status & Persistence Note */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Preference saved permanently in your browser & customer profile.
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 capitalize self-end sm:self-auto">
                    {themeMode === 'system' ? `System Auto (${isDarkMode ? 'Dark' : 'Light'})` : `${themeMode} Mode`}
                  </span>
                </div>
              </div>

              {/* My Loyalty Points Section inside Profile Tab */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-black text-slate-950 flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span>My Loyalty Points</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Earn 1 point per ₹10 spent on Harwalkart • 1 Point = ₹1 Instant Shopping Voucher
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('loyalty')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    <span>Full Points Hub & Vouchers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Point Balance Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-gradient-to-br from-amber-50 via-amber-100/60 to-amber-200/40 border border-amber-300 rounded-2xl">
                    <span className="text-[11px] font-bold text-amber-950 uppercase">Current Balance</span>
                    <p className="text-2xl font-black text-slate-950 mt-0.5">{pointsCount} pts</p>
                    <span className="text-[11px] font-black text-amber-800 bg-white/60 px-2 py-0.5 rounded-md inline-block mt-1">
                      = ₹{pointsCount} Value
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Membership Tier</span>
                    <p className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500" />
                      {tierName} Member
                    </p>
                    <span className="text-[11px] font-medium text-slate-500 block mt-1">
                      {tierName === 'Platinum'
                        ? '1.50x earning multiplier'
                        : tierName === 'Gold'
                        ? '1.25x earning multiplier'
                        : '1.00x standard rate'}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Lifetime Points Earned</span>
                    <p className="text-lg font-black text-emerald-700 mt-0.5">
                      +{historyList
                        .filter(t => t.points > 0)
                        .reduce((acc, curr) => acc + curr.points, 0) || pointsCount} pts
                    </p>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Across grocery & spice orders
                    </span>
                  </div>
                </div>

                {/* Brief History of Earning Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Recent Points History
                    </span>
                    <button
                      onClick={() => setActiveTab('loyalty')}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                    >
                      View All Ledger Entries →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                    {historyList.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs first:pt-1 last:pb-1">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              tx.points > 0
                                ? tx.type === 'bonus'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{tx.description}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500">
                              <span>{tx.date}</span>
                              <span>• Balance after: {tx.balanceAfter} pts</span>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`font-black text-xs shrink-0 ${
                            tx.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-950 dark:text-white">Your Order History</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{orders.length} orders found</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No orders placed yet</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Discover fresh spices and local store products now!</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Order #{order.id}</span>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{order.date} • Paid via {order.paymentMethod.toUpperCase()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300' :
                          order.status === 'out_for_delivery' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700' :
                          'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedTrackingOrderId(order.id);
                            navigate('/order-tracking');
                          }}
                          className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer border border-slate-800 dark:border-slate-700"
                        >
                          <span>Live Track</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{item.productName}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">Qty: {item.quantity} • Seller: {item.sellerName}</p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900 dark:text-white">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="text-slate-500 dark:text-slate-400">
                        Delivery to: <strong className="text-slate-800 dark:text-slate-200">{order.deliveryAddress.fullName}, {order.deliveryAddress.pincode}</strong>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-950 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                          <Coins className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          +{order.loyaltyPointsEarned || Math.max(1, Math.round(order.total / 10))} Points Earned
                        </span>
                        <div className="text-right">
                          <span className="text-slate-500 dark:text-slate-400">Total: </span>
                          <span className="text-sm font-black text-slate-950 dark:text-white">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: MY LOYALTY POINTS */}
          {activeTab === 'loyalty' && (
            <LoyaltyPointsSection
              onNavigateToShop={() => navigate('/products')}
              onNavigateToOrder={(ordId) => {
                setSelectedTrackingOrderId(ordId);
                navigate('/order-tracking');
              }}
            />
          )}

          {/* TAB 3: CART */}
          {activeTab === 'cart' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white">Shopping Bag ({cartCount} items)</h3>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Subtotal: ₹{cartTotal}</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Your cart is currently empty.</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">₹{item.product.price} × {item.quantity} unit(s)</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900 dark:text-white">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Proceed to Instant Checkout (₹{cartTotal})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-950 dark:text-white">Saved Wishlist ({wishlistProducts.length})</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Items saved for later</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Your wishlist is empty</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tap the heart icon on any product to save items here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-950 dark:text-white">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setNewAddrModal(true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.savedAddresses?.map(addr => (
                  <div key={addr.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs relative space-y-2">
                    {addr.isDefault && (
                      <span className="inline-block bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-amber-300 dark:border-amber-800">
                        Default Address
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{addr.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{addr.addressLine}, {addr.area}, {addr.city}</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">PIN: {addr.pincode}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Mobile: +91 {addr.mobile}</p>
                  </div>
                ))}
              </div>

              {/* Add Address Modal Inline */}
              {newAddrModal && (
                <div className="p-5 bg-slate-50 dark:bg-slate-850 rounded-3xl border border-amber-200 dark:border-amber-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Enter New Delivery Address</h4>
                  <form onSubmit={handleSaveNewAddress} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={newAddressLine}
                      onChange={e => setNewAddressLine(e.target.value)}
                      placeholder="House/Flat No, Building, Street"
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newArea}
                        onChange={e => setNewArea(e.target.value)}
                        placeholder="Area / Locality"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newPin}
                        onChange={e => setNewPin(e.target.value)}
                        placeholder="PIN Code"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAddrModal(false)}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white">My Product & Shop Reviews</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{customerReviews.length} reviews posted</span>
              </div>

              <div className="space-y-3">
                {customerReviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.productName}</h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">"{rev.comment}"</p>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SUPPORT MESSAGES */}
          {activeTab === 'support' && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-black text-slate-950 dark:text-white">Customer Support Messages & Tickets</h3>
                <button
                  onClick={() => navigate('/support')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Contact Support Desk
                </button>
              </div>

              {supportTickets.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">No active support inquiries.</p>
              ) : (
                <div className="space-y-3">
                  {supportTickets.map(tkt => (
                    <div key={tkt.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Ticket #{tkt.id} • {tkt.category}</span>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase border border-amber-300 dark:border-amber-800">
                          {tkt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">Inquiry: "{tkt.message}"</p>
                      {tkt.response && (
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300">
                          <strong>Harwalkart Support Desk Reply:</strong> {tkt.response}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
