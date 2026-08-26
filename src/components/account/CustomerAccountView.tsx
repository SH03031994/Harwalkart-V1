import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../product/ProductCard';
import { Logo } from '../common/Logo';
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
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    authSession,
    customerLogout,
    updateCustomerProfile,
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
  } = useApp();

  const customer = authSession.customer || {
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
    isVerified: true,
    joinedDate: '2025-01-10',
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'cart' | 'wishlist' | 'addresses' | 'reviews' | 'support'>('orders');

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(customer.name);
  const [profilePhone, setProfilePhone] = useState(customer.phone);
  const [profileEmail, setProfileEmail] = useState(customer.email);
  const [profilePincode, setProfilePincode] = useState(customer.pincode || '110001');
  const [profileAddress, setProfileAddress] = useState(customer.address || '');

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
    });
    setIsEditingProfile(false);
    showToast('Your customer profile has been updated!');
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
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 text-xl font-black flex items-center justify-center border-2 border-amber-400 shadow-sm shrink-0">
            {customer.name ? customer.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black text-slate-950">{customer.name || 'Harwalkart Shopper'}</h1>
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Customer
              </span>
              <div className="hidden md:block pl-2 border-l border-slate-200">
                <Logo size="sm" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              +91 {customer.phone} • {customer.email} • PIN: {customer.pincode || '110001'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Member since {customer.joinedDate || '2025'} • Primary Portal: <strong>Customer Dashboard</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-3.5 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={customerLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Customer Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (3 Cols) */}
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-3xl border border-slate-200 shadow-xs h-max">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Profile & Details</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'cart' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Cart & Bag</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{cartCount} items</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{customer.savedAddresses?.length || 1}</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'reviews' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{customerReviews.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'support' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Support Messages</span>
            </div>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded-full">{supportTickets.length}</span>
          </button>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <button
              onClick={customerLogout}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-950">Customer Profile & Settings</h3>
                  <p className="text-xs text-slate-500">Manage your contact number, email, and primary PIN code</p>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Edit Details
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={e => setProfileEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Default PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={profilePincode}
                        onChange={e => setProfilePincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Address</label>
                    <textarea
                      rows={2}
                      value={profileAddress}
                      onChange={e => setProfileAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Save Updated Profile
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Customer Name</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.name}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Mobile Number</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">+91 {customer.phone}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Email Address</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.email}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Default PIN Code</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{customer.pincode || '110001'}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 sm:col-span-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Primary Delivery Address</span>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{customer.address || customer.savedAddresses?.[0]?.addressLine || 'Address on record'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-950">Your Order History</h3>
                <span className="text-xs text-slate-500">{orders.length} orders found</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                  <p className="text-xs text-slate-500">Discover fresh spices and local store products now!</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900">Order #{order.id}</span>
                        <div className="text-[11px] text-slate-500">{order.date} • Paid via {order.paymentMethod.toUpperCase()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          order.status === 'out_for_delivery' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedTrackingOrderId(order.id);
                            navigate('/order-tracking');
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
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
                            <img src={item.image} alt={item.productName} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <div>
                              <p className="font-bold text-slate-900">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">Qty: {item.quantity} • Seller: {item.sellerName}</p>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                      <div className="text-slate-500">
                        Delivery to: <strong className="text-slate-800">{order.deliveryAddress.fullName}, {order.deliveryAddress.pincode}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500">Total Amount: </span>
                        <span className="text-sm font-black text-slate-950">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: CART */}
          {activeTab === 'cart' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-950">Shopping Bag ({cartCount} items)</h3>
                <span className="text-xs font-bold text-slate-600">Subtotal: ₹{cartTotal}</span>
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Your cart is currently empty.</p>
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
                    <div key={item.product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{item.product.name}</p>
                          <p className="text-[10px] text-slate-500">₹{item.product.price} × {item.quantity} unit(s)</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
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
                <h3 className="text-base font-black text-slate-950">Saved Wishlist ({wishlistProducts.length})</h3>
                <span className="text-xs text-slate-500">Items saved for later</span>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Your wishlist is empty</p>
                  <p className="text-xs text-slate-500">Tap the heart icon on any product to save items here.</p>
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
                <h3 className="text-base font-black text-slate-950">Saved Delivery Addresses</h3>
                <button
                  onClick={() => setNewAddrModal(true)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.savedAddresses?.map(addr => (
                  <div key={addr.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs relative space-y-2">
                    {addr.isDefault && (
                      <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        Default Address
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-slate-900">{addr.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{addr.addressLine}, {addr.area}, {addr.city}</p>
                    <p className="text-xs font-black text-slate-900">PIN: {addr.pincode}</p>
                    <p className="text-[11px] text-slate-500">Mobile: +91 {addr.mobile}</p>
                  </div>
                ))}
              </div>

              {/* Add Address Modal Inline */}
              {newAddrModal && (
                <div className="p-5 bg-slate-50 rounded-3xl border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Enter New Delivery Address</h4>
                  <form onSubmit={handleSaveNewAddress} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={newAddressLine}
                      onChange={e => setNewAddressLine(e.target.value)}
                      placeholder="House/Flat No, Building, Street"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newArea}
                        onChange={e => setNewArea(e.target.value)}
                        placeholder="Area / Locality"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                        placeholder="City"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newPin}
                        onChange={e => setNewPin(e.target.value)}
                        placeholder="PIN Code"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewAddrModal(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-950">My Product & Shop Reviews</h3>
                <span className="text-xs text-slate-500">{customerReviews.length} reviews posted</span>
              </div>

              <div className="space-y-3">
                {customerReviews.map(rev => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{rev.productName}</h4>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-700">"{rev.comment}"</p>
                    {rev.verified && (
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-950">Customer Support Messages & Tickets</h3>
                <button
                  onClick={() => navigate('/support')}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Contact Support Desk
                </button>
              </div>

              {supportTickets.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active support inquiries.</p>
              ) : (
                <div className="space-y-3">
                  {supportTickets.map(tkt => (
                    <div key={tkt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Ticket #{tkt.id} • {tkt.category}</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full uppercase">
                          {tkt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">Inquiry: "{tkt.message}"</p>
                      {tkt.response && (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
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
