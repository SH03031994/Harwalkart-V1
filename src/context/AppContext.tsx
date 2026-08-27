import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LocationState,
  Seller,
  SellerType,
  KycStatus,
  SellerKycDoc,
  Product,
  ProductVideoAd,
  CartItem,
  Order,
  CustomerUser,
  SupportTicket,
  Role,
  AdminUser,
  AuthSession,
  WithdrawalRequest,
  SellerCustomerMessage,
  SellerStatus,
  CategoryItem,
  Advertisement,
  CityHub,
  WebsiteSettings,
  CompanyBankAccount,
  PaymentSettings,
  DeliveryPartner,
  PayoutStatus,
  Brand,
  HeroBanner,
} from '../types';
import {
  CITIES_AND_PINCODES,
  INITIAL_SELLERS,
  INITIAL_PRODUCTS,
  INITIAL_VIDEO_ADS,
  INITIAL_CUSTOMERS,
  INITIAL_DELIVERY_PARTNERS,
  INITIAL_WITHDRAWAL_REQUESTS,
  INITIAL_SELLER_MESSAGES,
  INITIAL_CATEGORIES,
  INITIAL_ADVERTISEMENTS,
  INITIAL_CITY_HUBS,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_BRANDS,
  INITIAL_HERO_BANNERS,
} from '../data/mockData';
import {
  calculateDistanceKm,
  checkSellerServiceability,
  checkProductServiceability,
  INDIAN_CITY_COORDINATES,
} from '../utils/location';

interface ShareData {
  title: string;
  url: string;
  text: string;
  type: 'product' | 'shop' | 'video';
  item?: Product | Seller | ProductVideoAd;
}

export interface CustomerRegistrationPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
  pincode: string;
  address: string;
}

export interface SellerRegistrationPayload {
  sellerType: SellerType;
  ownerName: string;
  shopName: string;
  phone: string;
  email: string;
  password: string;
  street: string;
  city: string;
  pincode: string;
  businessInfo: string;
  isGstRegistered: boolean;
  gstin?: string;
  gstDocFileName?: string;
  panNumber: string;
  panDocFileName?: string;
  kycDocType: 'GST Certificate' | 'PAN Card' | 'Aadhaar Card' | 'Shop Act License' | 'FSSAI Registration' | 'Bank Passbook' | 'Electricity Bill';
  kycDocNumber: string;
  kycFileName?: string;
  kycDocuments?: SellerKycDoc[];
}

interface AppContextType {
  // Path-based Navigation & View System
  currentPath: string;
  navigate: (path: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedShopId: string | null;
  setSelectedShopId: (id: string | null) => void;
  selectedCmsPage: string | null;
  setSelectedCmsPage: (page: string | null) => void;
  selectedBrandSlug: string | null;
  setSelectedBrandSlug: (slug: string | null) => void;
  navigateToBrand: (slug: string) => void;

  // Brand Management
  brands: Brand[];
  addBrand: (brand: Omit<Brand, 'id'>) => Brand;
  updateBrand: (id: string, updates: Partial<Brand>) => boolean;
  deleteBrand: (id: string) => boolean;
  toggleBrandStatus: (id: string) => void;

  // Hero Banner Management
  heroBanners: HeroBanner[];
  addHeroBanner: (banner: Omit<HeroBanner, 'id'>) => HeroBanner;
  updateHeroBanner: (id: string, updates: Partial<HeroBanner>) => boolean;
  deleteHeroBanner: (id: string) => boolean;
  toggleHeroBannerStatus: (id: string) => void;

  // Authentication & Session
  authSession: AuthSession;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  
  // Customer Auth
  customerLogin: (identifier: string, password: string) => { success: boolean; error?: string };
  initiateCustomerRegister: (data: CustomerRegistrationPayload) => { success: boolean; otp?: string; error?: string };
  verifyCustomerRegistrationOtp: (otp: string) => { success: boolean; error?: string };
  initiateCustomerForgotPassword: (identifier: string) => { success: boolean; otp?: string; error?: string };
  resetCustomerPassword: (identifier: string, otp: string, newPass: string) => { success: boolean; error?: string };
  customerLogout: () => void;
  updateCustomerProfile: (updates: Partial<CustomerUser>) => void;
  registeredCustomers: CustomerUser[];

  // Customer Management (Admin)
  addCustomer: (cust: Omit<CustomerUser, 'id'>) => CustomerUser;
  editCustomer: (id: string, updates: Partial<CustomerUser>) => boolean;
  toggleCustomerBlock: (id: string) => void;
  deleteCustomer: (id: string) => boolean;

  // Seller Auth
  sellerLogin: (identifier: string, password: string) => { success: boolean; error?: string; isPending?: boolean; seller?: Seller };
  initiateSellerRegister: (data: SellerRegistrationPayload) => { success: boolean; otp?: string; error?: string };
  verifySellerRegistrationOtp: (otp: string) => { success: boolean; error?: string; seller?: Seller };
  initiateSellerForgotPassword: (identifier: string) => { success: boolean; otp?: string; error?: string };
  resetSellerPassword: (identifier: string, otp: string, newPass: string) => { success: boolean; error?: string };
  sellerLogout: () => void;

  // Seller Management (Admin)
  addSeller: (seller: Omit<Seller, 'id'>) => Seller;
  editSeller: (sellerId: string, updates: Partial<Seller>) => boolean;
  suspendSeller: (sellerId: string, suspended: boolean) => void;
  deleteSeller: (sellerId: string) => boolean;
  
  // Admin Auth
  adminLogin: (email: string, password: string) => { success: boolean; error?: string };
  initiateAdminForgotPassword: (email: string) => { success: boolean; otp?: string; error?: string };
  resetAdminPassword: (email: string, otp: string, newPass: string) => { success: boolean; error?: string };
  adminLogout: () => void;

  // Active Pending OTP for registration/reset simulation
  activeOtpNotice: { code: string; recipient: string; purpose: string } | null;
  clearActiveOtpNotice: () => void;

  // Location / PIN Code System
  currentLocation: LocationState;
  setLocation: (loc: LocationState) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  availableCities: typeof CITIES_AND_PINCODES;

  // City Hubs (Admin Managed)
  cityHubs: CityHub[];
  addCityHub: (hub: Omit<CityHub, 'id'>) => CityHub;
  editCityHub: (id: string, updates: Partial<CityHub>) => boolean;
  deleteCityHub: (id: string) => boolean;

  // Categories (Admin Managed)
  categories: CategoryItem[];
  addCategory: (cat: Omit<CategoryItem, 'id'>) => CategoryItem;
  editCategory: (id: string, updates: Partial<CategoryItem>) => boolean;
  deleteCategory: (id: string) => boolean;

  // Advertisements (Admin Managed)
  advertisements: Advertisement[];
  addAdvertisement: (ad: Omit<Advertisement, 'id' | 'clicks' | 'impressions' | 'createdAt'>) => Advertisement;
  editAdvertisement: (id: string, updates: Partial<Advertisement>) => boolean;
  deleteAdvertisement: (id: string) => boolean;
  toggleAdvertisementStatus: (id: string, status: Advertisement['status']) => void;

  // Website Settings (Admin Managed)
  websiteSettings: WebsiteSettings;
  updateWebsiteSettings: (updates: Partial<WebsiteSettings>) => void;
  resetWebsiteSettings: () => void;

  // Company Bank Account & Payment Settings (Admin Managed)
  companyBankAccount: CompanyBankAccount | null;
  saveCompanyBankAccount: (account: CompanyBankAccount) => void;
  removeCompanyBankAccount: () => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (updates: Partial<PaymentSettings>) => void;

  // Core Data Lists
  sellers: Seller[];
  products: Product[];
  videoAds: ProductVideoAd[];
  orders: Order[];
  supportTickets: SupportTicket[];
  deliveryPartners: DeliveryPartner[];
  withdrawalRequests: WithdrawalRequest[];
  sellerMessages: SellerCustomerMessage[];

  // Filtered lists based on current PIN / service area
  eligibleProducts: Product[];
  eligibleSellers: Seller[];
  harwalkartProducts: Product[];
  localShopProducts: Product[];

  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartDiscount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Legacy compatibility for Customer User
  customerUser: CustomerUser;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginUser: (user: Partial<CustomerUser>) => void;
  logoutUser: () => void;
  updateSavedAddress: (address: CustomerUser['savedAddresses'][0]) => void;

  // Orders
  placeOrder: (orderDetails: Omit<Order, 'id' | 'date' | 'status' | 'trackingSteps'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => boolean;
  selectedTrackingOrderId: string | null;
  setSelectedTrackingOrderId: (id: string | null) => void;

  // Share Modal
  shareModalData: ShareData | null;
  openShareModal: (data: ShareData) => void;
  closeShareModal: () => void;

  // Seller Dashboard Actions
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'approved'> & { approved?: boolean }) => void;
  updateProduct: (id: string, updates: Partial<Product>, requestingSellerId?: string) => boolean;
  deleteProduct: (productId: string, requestingSellerId?: string) => boolean;
  updateSellerStock: (productId: string, stockQuantity: number, inStock: boolean) => void;
  createVideoCampaign: (campaign: Omit<ProductVideoAd, 'id' | 'views' | 'clicks' | 'shares' | 'status' | 'createdAt'>) => void;
  updateSellerProfile: (sellerId: string, updates: Partial<Seller>) => void;
  requestWithdrawal: (sellerId: string, amount: number, payoutMethod: 'upi' | 'bank_transfer', upiOrAccount: string) => { success: boolean; message: string };
  replyToSellerMessage: (messageId: string, reply: string) => void;
  sendSellerCustomerMessage: (data: { sellerId: string; customerName: string; customerPhone: string; customerEmail: string; productName?: string; message: string }) => void;
  updateServiceablePincodes: (sellerId: string, pincodes: string[], radiusKm: number) => void;

  // Delivery Partner Actions
  addDeliveryPartner: (partner: Omit<DeliveryPartner, 'id'>) => DeliveryPartner;
  editDeliveryPartner: (id: string, updates: Partial<DeliveryPartner>) => boolean;
  deleteDeliveryPartner: (id: string) => boolean;
  requestPartnerWithdrawal: (partnerId: string, amount: number, payoutMethod: 'upi' | 'bank_transfer', upiOrAccount: string) => { success: boolean; message: string };

  // Admin Dashboard Actions
  approveSeller: (sellerId: string) => void;
  rejectSeller: (sellerId: string, reason?: string) => void;
  requestSellerCorrection: (sellerId: string, notes: string) => void;
  submitSellerKycCorrection: (sellerId: string, updates: Partial<Seller>) => void;
  toggleProductApproval: (productId: string) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string) => void;
  toggleSellerVerification: (sellerId: string) => void;
  addVideoAd: (videoData: Omit<ProductVideoAd, 'id' | 'views' | 'clicks' | 'shares' | 'createdAt'>) => ProductVideoAd;
  editVideoAd: (adId: string, updates: Partial<ProductVideoAd>) => boolean;
  deleteVideoAd: (adId: string) => boolean;
  toggleVideoAdStatus: (adId: string, status: ProductVideoAd['status']) => void;
  approveWithdrawal: (withdrawalId: string, adminNotes?: string) => boolean;
  rejectWithdrawal: (withdrawalId: string, reason: string, adminNotes?: string) => boolean;
  markWithdrawalPaid: (withdrawalId: string, paymentDetails: { transactionRef: string; paymentMode?: string; paidDate?: string; adminNotes?: string }) => boolean;
  processWithdrawal: (withdrawalId: string, status: PayoutStatus, transactionRef?: string, rejectionReason?: string, adminNotes?: string) => void;
  addManualPayout: (
    beneficiaryTypeOrSellerId: 'seller' | 'delivery_partner' | string,
    targetIdOrAmount: string | number,
    amountOrNote?: number | string,
    method?: 'upi' | 'bank_transfer',
    destination?: string,
    transactionRef?: string,
    note?: string
  ) => boolean;
  deleteWithdrawalRequest: (withdrawalId: string) => boolean;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => void;
  replyToSupportTicket: (ticketId: string, reply: string) => void;
  updateSupportTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  deleteSupportTicket: (ticketId: string) => boolean;

  // Toast / Notification banner
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine initial path from window.location.pathname
  const getInitialPath = () => {
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return window.location.pathname;
    }
    return '/';
  };

  const getInitialView = () => {
    const path = getInitialPath();
    if (path === '/' || path === '/home') return 'home';
    if (path === '/customer/dashboard') return 'customer-dashboard';
    if (path === '/customer/login') return 'customer-login';
    if (path === '/customer/register') return 'customer-register';
    if (path === '/customer/forgot-password') return 'customer-forgot-password';
    if (path === '/seller/dashboard') return 'seller-dashboard';
    if (path === '/seller/login') return 'seller-login';
    if (path === '/seller/register') return 'seller-register';
    if (path === '/seller/forgot-password') return 'seller-forgot-password';
    if (path === '/admin/dashboard' || path === '/admin/panel') return 'admin-dashboard';
    if (path === '/admin/login') return 'admin-login';
    if (path === '/admin/forgot-password') return 'admin-forgot-password';
    if (path === '/products') return 'products';
    if (path === '/shops') return 'shops';
    if (path === '/kitchen-shakti') return 'kitchen-shakti';
    if (path.startsWith('/brand/')) return 'brand-detail';
    if (path === '/video-shopping' || path === '/video-ads') return 'video-ads';
    if (path === '/cart') return 'cart';
    if (path === '/checkout') return 'checkout';
    if (path === '/order-tracking') return 'order-tracking';
    if (path === '/support') return 'support';
    if (['/about-us', '/privacy-policy', '/terms-conditions', '/refund-policy', '/shipping-policy', '/cancellation-policy', '/gst-compliance'].includes(path)) {
      return 'cms-page';
    }
    return 'home';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [currentView, setCurrentViewState] = useState<string>(getInitialView);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
  const [selectedCmsPage, setSelectedCmsPage] = useState<string | null>(null);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(null);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(() => {
    const p = getInitialPath();
    if (p.startsWith('/brand/')) return p.replace('/brand/', '');
    return null;
  });

  // Authentication State
  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    const saved = localStorage.getItem('hk_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial state: Customer (Rahul Verma)
    const initialCustomer = INITIAL_CUSTOMERS[0];
    return {
      role: 'customer',
      isAuthenticated: true,
      customer: initialCustomer,
      seller: null,
      admin: null,
    };
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => authSession.role || 'customer');

  // Admin Credentials Storage
  const [adminCredentials, setAdminCredentials] = useState<{ email: string; password: string }>(() => {
    const saved = localStorage.getItem('hk_admin_credentials');
    return saved ? JSON.parse(saved) : { email: 'jaishreeramenterprises24@gmail.com', password: 'Harwal@Admin2026' };
  });

  // Customer Records
  const [registeredCustomers, setRegisteredCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('hk_registered_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Sellers Records
  const [sellers, setSellers] = useState<Seller[]>(() => {
    const saved = localStorage.getItem('hk_sellers');
    if (saved) {
      try {
        const parsed: Seller[] = JSON.parse(saved);
        return parsed.map(s => {
          const init = INITIAL_SELLERS.find(i => i.id === s.id);
          return {
            ...s,
            latitude: s.latitude !== undefined ? s.latitude : init?.latitude,
            longitude: s.longitude !== undefined ? s.longitude : init?.longitude,
          };
        });
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SELLERS;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('hk_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Video Ads
  const [videoAds, setVideoAds] = useState<ProductVideoAd[]>(() => {
    const saved = localStorage.getItem('hk_video_ads');
    return saved ? JSON.parse(saved) : INITIAL_VIDEO_ADS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hk_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((ord: Order) => ({
          ...ord,
          items: ord.items.map(it => {
            const itemTotal = it.price * it.quantity;
            const commissionAmount = it.commissionAmount !== undefined ? it.commissionAmount : Math.round(itemTotal * 0.02 * 100) / 100;
            const netSellerAmount = it.netSellerAmount !== undefined ? it.netSellerAmount : Math.round((itemTotal - commissionAmount) * 100) / 100;
            return {
              ...it,
              commissionRate: 0.02,
              commissionAmount,
              netSellerAmount,
            };
          }),
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'HK-ORD-89421',
        date: '2026-08-23 14:30',
        items: [
          {
            productId: 'hk_ks_lal_mirch',
            productName: 'Kitchen Shakti Lal Mirch Powder (200g)',
            brand: 'KITCHEN SHAKTI',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
            price: 85,
            quantity: 2,
            sellerName: 'Harwalkart Official Store',
            sellerId: 'seller_harwalkart_direct',
            commissionRate: 0.02,
            commissionAmount: 3.4,
            netSellerAmount: 166.6,
          },
          {
            productId: 'prod_basmati_rice',
            productName: 'Fortune Super Basmati Rice (5kg)',
            brand: 'Fortune',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
            price: 499,
            quantity: 1,
            sellerName: 'Sharma Kirana & General Store',
            sellerId: 'seller_sharma_kirana',
            commissionRate: 0.02,
            commissionAmount: 9.98,
            netSellerAmount: 489.02,
          },
        ],
        subtotal: 669,
        deliveryCharge: 0,
        discount: 100,
        taxAmount: 32,
        total: 601,
        sellerCommissionTotal: 13.38,
        sellerNetSettlementTotal: 655.62,
        status: 'out_for_delivery',
        deliveryAddress: {
          fullName: 'Rahul Verma',
          mobile: '9876543210',
          addressLine: 'Flat 402, Royal Residency, Near Metro Gate 3',
          area: 'Connaught Place',
          city: 'New Delhi',
          pincode: '110001',
          state: 'Delhi',
          landmark: 'Gate 3',
        },
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        estimatedDelivery: 'Today by 6:00 PM',
        trackingSteps: [
          { title: 'Order Placed', description: 'Order received at Harwalkart', timestamp: '23 Aug, 2:30 PM', completed: true, current: false },
          { title: 'Order Confirmed', description: 'Verified by local hub and seller', timestamp: '23 Aug, 2:35 PM', completed: true, current: false },
          { title: 'Preparing / Packed', description: 'Items safely packed & sealed', timestamp: '23 Aug, 3:15 PM', completed: true, current: false },
          { title: 'Out for Delivery', description: 'Rider Ramesh is on the way (Mob: 9811224455)', timestamp: '23 Aug, 4:00 PM', completed: true, current: true },
          { title: 'Delivered', description: 'Handed over with OTP verification', timestamp: 'Pending', completed: false, current: false },
        ],
      },
      {
        id: 'HK-ORD-92014',
        date: '2026-08-24 11:15',
        items: [
          {
            productId: 'prod_sharma_ghee',
            productName: 'Amul Pure Ghee Pouch (1 Litre)',
            brand: 'Amul',
            image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=400&auto=format&fit=crop&q=80',
            price: 650,
            quantity: 2,
            sellerName: 'Sharma Kirana & General Store',
            sellerId: 'seller_sharma_kirana',
            commissionRate: 0.02,
            commissionAmount: 26.0,
            netSellerAmount: 1274.0,
          },
        ],
        subtotal: 1300,
        deliveryCharge: 0,
        discount: 0,
        taxAmount: 0,
        total: 1300,
        sellerCommissionTotal: 26.0,
        sellerNetSettlementTotal: 1274.0,
        status: 'confirmed',
        deliveryAddress: {
          fullName: 'Ananya Gupta',
          mobile: '9810112233',
          addressLine: 'House 14, Barakhamba Road',
          area: 'Connaught Place',
          city: 'New Delhi',
          pincode: '110001',
          state: 'Delhi',
          landmark: 'Opp British Council',
        },
        paymentMethod: 'upi',
        paymentStatus: 'paid',
        estimatedDelivery: 'Today by 3:00 PM',
        trackingSteps: [
          { title: 'Order Placed', description: 'Order received at Harwalkart', timestamp: '24 Aug, 11:15 AM', completed: true, current: false },
          { title: 'Order Confirmed', description: 'Confirmed by Sharma Kirana', timestamp: '24 Aug, 11:20 AM', completed: true, current: true },
          { title: 'Preparing / Packed', description: 'Packing in progress', timestamp: 'Pending', completed: false, current: false },
          { title: 'Out for Delivery', description: 'Awaiting rider pickup', timestamp: 'Pending', completed: false, current: false },
          { title: 'Delivered', description: 'Contactless delivery', timestamp: 'Pending', completed: false, current: false },
        ],
      },
      {
        id: 'HK-ORD-77189',
        date: '2026-08-22 09:40',
        items: [
          {
            productId: 'prod_sharma_atta',
            productName: 'Aashirvaad Superior MP Shudh Chakki Atta (10kg)',
            brand: 'Aashirvaad',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
            price: 460,
            quantity: 2,
            sellerName: 'Sharma Kirana & General Store',
            sellerId: 'seller_sharma_kirana',
            commissionRate: 0.02,
            commissionAmount: 18.4,
            netSellerAmount: 901.6,
          },
          {
            productId: 'prod_tata_salt',
            productName: 'Tata Salt Vacuum Evaporated (1kg)',
            brand: 'Tata',
            image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&auto=format&fit=crop&q=80',
            price: 28,
            quantity: 3,
            sellerName: 'Sharma Kirana & General Store',
            sellerId: 'seller_sharma_kirana',
            commissionRate: 0.02,
            commissionAmount: 1.68,
            netSellerAmount: 82.32,
          },
        ],
        subtotal: 1004,
        deliveryCharge: 0,
        discount: 0,
        taxAmount: 0,
        total: 1004,
        sellerCommissionTotal: 20.08,
        sellerNetSettlementTotal: 983.92,
        status: 'delivered',
        deliveryAddress: {
          fullName: 'Vikram Malhotra',
          mobile: '9988776655',
          addressLine: 'Block C-44, Hanuman Road',
          area: 'Connaught Place',
          city: 'New Delhi',
          pincode: '110001',
          state: 'Delhi',
        },
        paymentMethod: 'card',
        paymentStatus: 'paid',
        estimatedDelivery: 'Delivered on 22 Aug',
        trackingSteps: [
          { title: 'Order Placed', description: 'Order placed', timestamp: '22 Aug, 9:40 AM', completed: true, current: false },
          { title: 'Order Confirmed', description: 'Verified', timestamp: '22 Aug, 9:45 AM', completed: true, current: false },
          { title: 'Preparing / Packed', description: 'Packed', timestamp: '22 Aug, 10:10 AM', completed: true, current: false },
          { title: 'Out for Delivery', description: 'Dispatched', timestamp: '22 Aug, 10:45 AM', completed: true, current: false },
          { title: 'Delivered', description: 'Delivered successfully', timestamp: '22 Aug, 11:30 AM', completed: true, current: false },
        ],
      },
    ];
  });

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('hk_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TKT-1002',
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        phone: '9876543210',
        orderId: 'HK-ORD-89421',
        category: 'Delivery query',
        message: 'Namaste Harwalkart, please ensure delivery before 7 PM today.',
        status: 'in_progress',
        createdAt: '2025-02-18 15:00',
        response: 'Our delivery partner is already en route and will reach by 5:30 PM. Thank you!',
      },
    ];
  });

  // Delivery Partners
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(() => {
    const saved = localStorage.getItem('hk_delivery_partners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_DELIVERY_PARTNERS;
  });

  // Withdrawal Requests
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('hk_withdrawals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_WITHDRAWAL_REQUESTS;
  });

  // Seller Customer Messages
  const [sellerMessages, setSellerMessages] = useState<SellerCustomerMessage[]>(() => {
    const saved = localStorage.getItem('hk_seller_messages');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_MESSAGES;
  });

  // Temporary Pending Registrations & OTPs
  const [pendingCustomerRegistration, setPendingCustomerRegistration] = useState<CustomerRegistrationPayload | null>(null);
  const [pendingSellerRegistration, setPendingSellerRegistration] = useState<SellerRegistrationPayload | null>(null);
  const [activeOtpNotice, setActiveOtpNotice] = useState<{ code: string; recipient: string; purpose: string } | null>(null);
  const clearActiveOtpNotice = () => setActiveOtpNotice(null);

  // Location
  const [currentLocation, setLocationState] = useState<LocationState>(() => {
    const saved = localStorage.getItem('hk_location');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return {
      city: 'New Delhi',
      pincode: '110001',
      area: 'Connaught Place',
    };
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [shareModalData, setShareModalData] = useState<ShareData | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setLocation = (loc: LocationState) => {
    setLocationState(loc);
    localStorage.setItem('hk_location', JSON.stringify(loc));
    showToast(`Location updated: ${loc.area}, ${loc.city} (${loc.pincode})`);
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('hk_cart');
    return saved ? JSON.parse(saved) : [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
      },
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
      },
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('HARWAL100');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('hk_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Brands State (4 Independent Flagship Brands under Harwalkart Marketplace)
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('hk_brands');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_BRANDS;
  });

  // Hero Banners State (Dynamic Homepage Transparent Packaging & Brand Hero Banners)
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>(() => {
    const saved = localStorage.getItem('hk_hero_banners');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_HERO_BANNERS;
  });

  // Advertisements State
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('hk_advertisements');
    return saved ? JSON.parse(saved) : INITIAL_ADVERTISEMENTS;
  });

  // City Hubs State
  const [cityHubs, setCityHubs] = useState<CityHub[]>(() => {
    const saved = localStorage.getItem('hk_city_hubs');
    return saved ? JSON.parse(saved) : INITIAL_CITY_HUBS;
  });

  // Website Settings State
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('hk_website_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure official Head Office address is always updated to official Pune MIDC address
        if (
          !parsed.officialAddress ||
          parsed.officialAddress.includes('Delhi') ||
          parsed.officialAddress.includes('Connaught') ||
          parsed.officialAddress.includes('413216')
        ) {
          parsed.officialAddress = INITIAL_WEBSITE_SETTINGS.officialAddress;
          parsed.registeredAddress = INITIAL_WEBSITE_SETTINGS.registeredAddress;
        }
        return { ...INITIAL_WEBSITE_SETTINGS, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_WEBSITE_SETTINGS;
  });

  // Company Bank Account State (Admin Private)
  const [companyBankAccount, setCompanyBankAccount] = useState<CompanyBankAccount | null>(() => {
    const saved = localStorage.getItem('hk_company_bank_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    const saved = localStorage.getItem('hk_payment_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      companyBankAccount: null,
      enableCod: true,
      enableUpi: true,
      enableCards: true,
      enableNetbanking: true,
      merchantName: 'HARWALKART ENTERPRISES',
      gatewayMode: 'sandbox',
    };
  });

  useEffect(() => {
    if (companyBankAccount) {
      localStorage.setItem('hk_company_bank_account', JSON.stringify(companyBankAccount));
    } else {
      localStorage.removeItem('hk_company_bank_account');
    }
  }, [companyBankAccount]);

  useEffect(() => {
    localStorage.setItem('hk_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hk_auth_session', JSON.stringify(authSession));
  }, [authSession]);

  useEffect(() => {
    localStorage.setItem('hk_registered_customers', JSON.stringify(registeredCustomers));
  }, [registeredCustomers]);

  useEffect(() => {
    localStorage.setItem('hk_sellers', JSON.stringify(sellers));
  }, [sellers]);

  useEffect(() => {
    localStorage.setItem('hk_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('hk_video_ads', JSON.stringify(videoAds));
  }, [videoAds]);

  useEffect(() => {
    localStorage.setItem('hk_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('hk_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('hk_delivery_partners', JSON.stringify(deliveryPartners));
  }, [deliveryPartners]);

  useEffect(() => {
    localStorage.setItem('hk_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('hk_seller_messages', JSON.stringify(sellerMessages));
  }, [sellerMessages]);

  useEffect(() => {
    localStorage.setItem('hk_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('hk_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('hk_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('hk_hero_banners', JSON.stringify(heroBanners));
  }, [heroBanners]);

  useEffect(() => {
    localStorage.setItem('hk_advertisements', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('hk_city_hubs', JSON.stringify(cityHubs));
  }, [cityHubs]);

  useEffect(() => {
    localStorage.setItem('hk_website_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  // Robust URL & View Router
  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', path);
      }
    } catch (e) {
      // ignore iframe domain restrictions
    }
    
    // Explicit view mapping
    if (path === '/' || path === '/home') setCurrentViewState('home');
    else if (path === '/customer/dashboard') setCurrentViewState('customer-dashboard');
    else if (path === '/customer/login') setCurrentViewState('customer-login');
    else if (path === '/customer/register') setCurrentViewState('customer-register');
    else if (path === '/customer/forgot-password') setCurrentViewState('customer-forgot-password');
    else if (path === '/seller/dashboard') setCurrentViewState('seller-dashboard');
    else if (path === '/seller/login') setCurrentViewState('seller-login');
    else if (path === '/seller/register') setCurrentViewState('seller-register');
    else if (path === '/seller/forgot-password') setCurrentViewState('seller-forgot-password');
    else if (path === '/admin/dashboard') setCurrentViewState('admin-dashboard');
    else if (path === '/admin/login') setCurrentViewState('admin-login');
    else if (path === '/admin/forgot-password') setCurrentViewState('admin-forgot-password');
    else if (path === '/products') setCurrentViewState('products');
    else if (path === '/shops') setCurrentViewState('shops');
    else if (path === '/kitchen-shakti') {
      setSelectedBrandSlug('kitchen-shakti');
      setCurrentViewState('brand-detail');
    }
    else if (path.startsWith('/brand/')) {
      const slug = path.replace('/brand/', '');
      setSelectedBrandSlug(slug);
      setCurrentViewState('brand-detail');
    }
    else if (path === '/video-shopping' || path === '/video-ads') setCurrentViewState('video-ads');
    else if (path === '/cart') setCurrentViewState('cart');
    else if (path === '/checkout') setCurrentViewState('checkout');
    else if (path === '/order-tracking') setCurrentViewState('order-tracking');
    else if (path === '/support') setCurrentViewState('support');
    else if (['/about-us', '/privacy-policy', '/terms-conditions', '/refund-policy', '/shipping-policy', '/cancellation-policy', '/gst-compliance'].includes(path)) {
      setSelectedCmsPage(path.replace('/', ''));
      setCurrentViewState('cms-page');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToBrand = (slug: string) => {
    setSelectedBrandSlug(slug);
    setCurrentViewState('brand-detail');
    navigate(`/brand/${slug}`);
  };

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    // Sync view with path
    if (view === 'home') navigate('/');
    else if (view === 'account') navigate('/customer/dashboard');
    else if (view === 'seller-panel') navigate('/seller/dashboard');
    else if (view === 'admin-panel') navigate('/admin/dashboard');
    else if (view === 'products') navigate('/products');
    else if (view === 'shops') navigate('/shops');
    else if (view === 'kitchen-shakti') navigateToBrand('kitchen-shakti');
    else if (view === 'brand-detail' && selectedBrandSlug) navigate(`/brand/${selectedBrandSlug}`);
    else if (view === 'video-ads') navigate('/video-shopping');
    else if (view === 'cart') navigate('/cart');
    else if (view === 'checkout') navigate('/checkout');
    else if (view === 'order-tracking') navigate('/order-tracking');
    else if (view === 'support') navigate('/support');
    else if (['about-us', 'privacy-policy', 'terms-conditions', 'refund-policy', 'shipping-policy', 'cancellation-policy', 'gst-compliance'].includes(view)) {
      setSelectedCmsPage(view);
      navigate(`/${view}`);
    }
  };

  // Handle browser back / forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname || '/';
        setCurrentPath(path);
        if (path === '/' || path === '/home') setCurrentViewState('home');
        else if (path === '/customer/dashboard') setCurrentViewState('customer-dashboard');
        else if (path === '/customer/login') setCurrentViewState('customer-login');
        else if (path === '/customer/register') setCurrentViewState('customer-register');
        else if (path === '/customer/forgot-password') setCurrentViewState('customer-forgot-password');
        else if (path === '/seller/dashboard') setCurrentViewState('seller-dashboard');
        else if (path === '/seller/login') setCurrentViewState('seller-login');
        else if (path === '/seller/register') setCurrentViewState('seller-register');
        else if (path === '/seller/forgot-password') setCurrentViewState('seller-forgot-password');
        else if (path === '/admin/dashboard' || path === '/admin/panel') setCurrentViewState('admin-dashboard');
        else if (path === '/admin/login') setCurrentViewState('admin-login');
        else if (path === '/admin/forgot-password') setCurrentViewState('admin-forgot-password');
        else if (path === '/products') setCurrentViewState('products');
        else if (path === '/shops') setCurrentViewState('shops');
        else if (path === '/kitchen-shakti') setCurrentViewState('kitchen-shakti');
        else if (path === '/video-shopping' || path === '/video-ads') setCurrentViewState('video-ads');
        else if (path === '/cart') setCurrentViewState('cart');
        else if (path === '/checkout') setCurrentViewState('checkout');
        else if (path === '/order-tracking') setCurrentViewState('order-tracking');
        else if (path === '/support') setCurrentViewState('support');
        else if (['/about-us', '/privacy-policy', '/terms-conditions', '/refund-policy', '/shipping-policy', '/cancellation-policy', '/gst-compliance'].includes(path)) {
          setSelectedCmsPage(path.replace('/', ''));
          setCurrentViewState('cms-page');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- CUSTOMER AUTHENTICATION METHODS ---
  const customerLogin = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const customer = registeredCustomers.find(
      c => (c.email.toLowerCase() === cleanId || c.phone.trim() === cleanId) && (c.password === cleanPass || cleanPass === 'customer123')
    );

    if (!customer) {
      return { success: false, error: 'Invalid mobile/email or password. For demo, you can use "customer123".' };
    }

    const newSession: AuthSession = {
      role: 'customer',
      isAuthenticated: true,
      customer: customer,
      seller: null,
      admin: null,
    };
    setAuthSession(newSession);
    setCurrentRole('customer');
    showToast(`Welcome back, ${customer.name}! Signed in to Harwalkart Customer Portal.`);
    navigate('/customer/dashboard');
    return { success: true };
  };

  const initiateCustomerRegister = (data: CustomerRegistrationPayload) => {
    // Validation
    if (!data.name.trim()) return { success: false, error: 'Please enter your full name.' };
    if (!data.phone.trim() || data.phone.trim().length < 10) return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, error: 'Please enter a valid email address.' };
    if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    if (!data.pincode.trim() || data.pincode.trim().length !== 6) return { success: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
    if (!data.address.trim()) return { success: false, error: 'Please enter your delivery address.' };

    // Check if phone or email already registered
    const existing = registeredCustomers.find(
      c => c.phone.trim() === data.phone.trim() || c.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (existing) {
      return { success: false, error: 'An account with this mobile number or email already exists. Please login instead.' };
    }

    // Generate 6-digit OTP
    const generatedOtp = '123456';
    setPendingCustomerRegistration(data);
    setActiveOtpNotice({
      code: generatedOtp,
      recipient: data.phone,
      purpose: 'Customer Mobile Verification',
    });
    showToast(`OTP 123456 sent to +91 ${data.phone} for verification!`);
    return { success: true, otp: generatedOtp };
  };

  const verifyCustomerRegistrationOtp = (otp: string) => {
    if (!pendingCustomerRegistration) {
      return { success: false, error: 'No pending registration found. Please try again.' };
    }
    if (otp.trim() !== '123456' && otp.trim() !== activeOtpNotice?.code) {
      return { success: false, error: 'Incorrect OTP. Please enter 123456.' };
    }

    const newCust: CustomerUser = {
      id: `cust_${Date.now()}`,
      name: pendingCustomerRegistration.name.trim(),
      phone: pendingCustomerRegistration.phone.trim(),
      email: pendingCustomerRegistration.email.trim(),
      password: pendingCustomerRegistration.password,
      pincode: pendingCustomerRegistration.pincode.trim(),
      address: pendingCustomerRegistration.address.trim(),
      isVerified: true,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      savedAddresses: [
        {
          id: `addr_${Date.now()}`,
          name: `${pendingCustomerRegistration.name} (Primary)`,
          mobile: pendingCustomerRegistration.phone.trim(),
          addressLine: pendingCustomerRegistration.address.trim(),
          area: 'Local Area',
          city: 'City',
          pincode: pendingCustomerRegistration.pincode.trim(),
          isDefault: true,
        },
      ],
      wishlist: [],
    };

    setRegisteredCustomers(prev => [newCust, ...prev]);
    const newSession: AuthSession = {
      role: 'customer',
      isAuthenticated: true,
      customer: newCust,
      seller: null,
      admin: null,
    };
    setAuthSession(newSession);
    setCurrentRole('customer');
    setPendingCustomerRegistration(null);
    clearActiveOtpNotice();
    showToast(`Congratulations ${newCust.name}! Your Harwalkart customer account is verified.`);
    navigate('/customer/dashboard');
    return { success: true };
  };

  const initiateCustomerForgotPassword = (identifier: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const customer = registeredCustomers.find(
      c => c.email.toLowerCase() === cleanId || c.phone.trim() === cleanId
    );
    if (!customer) {
      return { success: false, error: 'No account registered with this email or mobile number.' };
    }
    const otp = '123456';
    setActiveOtpNotice({
      code: otp,
      recipient: customer.phone,
      purpose: 'Customer Password Reset',
    });
    showToast(`Password reset OTP 123456 sent to ${customer.phone}`);
    return { success: true, otp };
  };

  const resetCustomerPassword = (identifier: string, otp: string, newPass: string) => {
    if (otp.trim() !== '123456' && otp.trim() !== activeOtpNotice?.code) {
      return { success: false, error: 'Incorrect OTP. Please enter 123456.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    setRegisteredCustomers(prev =>
      prev.map(c =>
        c.email.toLowerCase() === cleanId || c.phone.trim() === cleanId
          ? { ...c, password: newPass }
          : c
      )
    );
    clearActiveOtpNotice();
    showToast('Your password has been reset successfully! Please login with your new password.');
    navigate('/customer/login');
    return { success: true };
  };

  const customerLogout = () => {
    setAuthSession({
      role: null,
      isAuthenticated: false,
      customer: null,
      seller: null,
      admin: null,
    });
    showToast('Logged out of Customer Portal successfully.');
    navigate('/customer/login');
  };

  const updateCustomerProfile = (updates: Partial<CustomerUser>) => {
    if (!authSession.customer) return;
    const updatedCust = { ...authSession.customer, ...updates };
    setAuthSession(prev => ({ ...prev, customer: updatedCust }));
    setRegisteredCustomers(prev => prev.map(c => (c.id === updatedCust.id ? updatedCust : c)));
    showToast('Customer profile updated successfully.');
  };

  // --- SELLER AUTHENTICATION METHODS ---
  const sellerLogin = (identifier: string, password: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    const seller = sellers.find(
      s => (s.email.toLowerCase() === cleanId || s.phone.trim() === cleanId) && (s.password === cleanPass || cleanPass === 'seller123')
    );

    if (!seller) {
      return { success: false, error: 'Invalid seller shop email/mobile or password. For demo, use "seller123".' };
    }

    const newSession: AuthSession = {
      role: 'seller',
      isAuthenticated: true,
      customer: null,
      seller: seller,
      admin: null,
    };
    setAuthSession(newSession);
    setCurrentRole('seller');

    if (seller.status === 'pending') {
      showToast(`Welcome ${seller.shopName}! Your shop application is pending Admin verification.`);
      navigate('/seller/dashboard');
      return { success: true, isPending: true, seller };
    }

    showToast(`Welcome back to Seller Portal, ${seller.shopName}! 🏪`);
    navigate('/seller/dashboard');
    return { success: true, isPending: false, seller };
  };

  const initiateSellerRegister = (data: SellerRegistrationPayload) => {
    if (!data.ownerName.trim()) return { success: false, error: 'Please enter owner full name.' };
    if (!data.shopName.trim()) return { success: false, error: 'Please enter shop / business name.' };
    if (!data.phone.trim() || data.phone.trim().length < 10) return { success: false, error: 'Please enter valid 10-digit mobile number.' };
    if (!data.email.trim() || !data.email.includes('@')) return { success: false, error: 'Please enter valid email address.' };
    if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    if (!data.street.trim() || !data.city.trim()) return { success: false, error: 'Please enter complete shop street address and city.' };
    if (!data.pincode.trim() || data.pincode.trim().length !== 6) return { success: false, error: 'Please enter valid 6-digit Indian PIN code.' };
    
    // PAN is mandatory for all legal commercial entities
    if (!data.panNumber || data.panNumber.trim().length < 10) {
      return { success: false, error: 'Valid 10-character Business Owner PAN is mandatory for onboarding.' };
    }

    // Option 1: GST Registered Seller
    if (data.sellerType === 'gst') {
      if (!data.gstin || data.gstin.trim().length !== 15) {
        return { success: false, error: 'Option 1 (GST Registered) requires a valid 15-character GSTIN number.' };
      }
    }

    // Option 2 / KYC Doc verification
    if (!data.kycDocNumber || !data.kycDocNumber.trim()) {
      return { success: false, error: `Please provide your ${data.kycDocType || 'KYC Document'} registration/ID number.` };
    }

    // Check if seller already exists
    const existing = sellers.find(
      s => s.phone.trim() === data.phone.trim() || s.email.toLowerCase() === data.email.toLowerCase().trim()
    );
    if (existing) {
      return { success: false, error: 'A seller account with this mobile or email already exists. Please login to your existing account.' };
    }

    const otp = '123456';
    setPendingSellerRegistration(data);
    setActiveOtpNotice({
      code: otp,
      recipient: data.phone,
      purpose: 'Seller Mobile Verification',
    });
    showToast(`OTP 123456 sent to +91 ${data.phone} for seller registration!`);
    return { success: true, otp };
  };

  const verifySellerRegistrationOtp = (otp: string) => {
    if (!pendingSellerRegistration) {
      return { success: false, error: 'No pending seller registration found. Please try again.' };
    }
    if (otp.trim() !== '123456' && otp.trim() !== activeOtpNotice?.code) {
      return { success: false, error: 'Incorrect OTP. Please enter 123456.' };
    }

    const data = pendingSellerRegistration;
    const isGst = data.sellerType === 'gst';
    const cityCoords = INDIAN_CITY_COORDINATES[data.city.trim()] || { lat: 28.6139, lng: 77.209 };
    
    // Construct multi-document KYC package
    const uploadedDocs: SellerKycDoc[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Document 1: PAN Card
    if (data.panNumber) {
      uploadedDocs.push({
        docType: 'PAN Card',
        docNumber: data.panNumber.trim().toUpperCase(),
        fileName: data.panDocFileName || `${data.shopName.replace(/\s+/g, '_')}_PAN_Card.pdf`,
        fileSize: '1.2 MB',
        verified: false,
        uploadedAt: today,
        notes: 'Proprietor / Entity Permanent Account Number',
      });
    }

    // Document 2: GST Certificate if GST Registered
    if (isGst && data.gstin) {
      uploadedDocs.push({
        docType: 'GST Certificate',
        docNumber: data.gstin.trim().toUpperCase(),
        fileName: data.gstDocFileName || `${data.shopName.replace(/\s+/g, '_')}_GST_Reg_Certificate.pdf`,
        fileSize: '2.4 MB',
        verified: false,
        uploadedAt: today,
        notes: 'Form GST REG-06 Certificate of Registration',
      });
    }

    // Document 3: Primary KYC Document selected
    if (data.kycDocType && data.kycDocNumber && data.kycDocType !== 'GST Certificate' && data.kycDocType !== 'PAN Card') {
      uploadedDocs.push({
        docType: data.kycDocType,
        docNumber: data.kycDocNumber.trim(),
        fileName: data.kycFileName || `${data.shopName.replace(/\s+/g, '_')}_${data.kycDocType.replace(/\s+/g, '_')}.pdf`,
        fileSize: '1.8 MB',
        verified: false,
        uploadedAt: today,
        notes: `${data.kycDocType} verified by merchant on submission`,
      });
    } else if (uploadedDocs.length === 0 || (data.kycDocType && data.kycDocNumber)) {
      uploadedDocs.push({
        docType: data.kycDocType || (isGst ? 'GST Certificate' : 'PAN Card'),
        docNumber: data.kycDocNumber.trim() || data.gstin || data.panNumber,
        fileName: data.kycFileName || `${data.shopName.replace(/\s+/g, '_')}_KYC_Document.pdf`,
        fileSize: '1.5 MB',
        verified: false,
        uploadedAt: today,
      });
    }

    const newSeller: Seller = {
      id: `seller_${Date.now()}`,
      name: data.ownerName.trim(),
      ownerName: data.ownerName.trim(),
      shopName: data.shopName.trim(),
      slug: data.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=150&auto=format&fit=crop&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=1200&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewCount: 0,
      isOpen: true,
      openingHours: '8:00 AM - 9:00 PM',
      distanceKm: 1.5,
      sellerType: data.sellerType,
      kycStatus: 'under_review',
      isRadiusLocked: !isGst,
      serviceablePincodes: isGst ? ['*'] : [data.pincode.trim()],
      serviceRadiusKm: isGst ? 5000 : 10,
      isHarwalkartDirect: false,
      isGstRegistered: isGst,
      gstin: isGst ? data.gstin?.trim().toUpperCase() : undefined,
      gstDocFileName: isGst ? (data.gstDocFileName || `${data.shopName.replace(/\s+/g, '_')}_GST_Certificate.pdf`) : undefined,
      panNumber: data.panNumber?.trim().toUpperCase(),
      panDocFileName: data.panDocFileName || `${data.shopName.replace(/\s+/g, '_')}_PAN_Card.pdf`,
      businessInfo: data.businessInfo.trim() || (isGst ? 'GST Registered Pan-India Merchant' : 'Local Neighborhood Store (10 KM Service Area)'),
      status: 'pending', // REQUIRED: Seller account remains PENDING until Admin approves it
      walletBalance: 0,
      totalEarnings: 0,
      password: data.password,
      latitude: cityCoords.lat,
      longitude: cityCoords.lng,
      kycDoc: uploadedDocs[0],
      kycDocuments: uploadedDocs,
      address: {
        street: data.street.trim(),
        area: `${data.city.trim()} Market`,
        city: data.city.trim(),
        pincode: data.pincode.trim(),
        state: 'India',
      },
      phone: data.phone.trim(),
      email: data.email.trim(),
      verified: false,
      productCount: 0,
      joinedDate: today,
      categories: ['Grocery', 'Local Essentials'],
    };

    setSellers(prev => [newSeller, ...prev]);
    const newSession: AuthSession = {
      role: 'seller',
      isAuthenticated: true,
      customer: null,
      seller: newSeller,
      admin: null,
    };
    setAuthSession(newSession);
    setCurrentRole('seller');
    setPendingSellerRegistration(null);
    clearActiveOtpNotice();
    
    if (isGst) {
      showToast(`GST Seller Registration submitted! "${newSeller.shopName}" sent for Pan-India Admin Approval. ✅`);
    } else {
      showToast(`Local Seller Registration submitted! "${newSeller.shopName}" (Fixed 10 KM Radius) sent for Admin Approval. ✅`);
    }
    
    navigate('/seller/dashboard');
    return { success: true, seller: newSeller };
  };

  const initiateSellerForgotPassword = (identifier: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const seller = sellers.find(
      s => s.email.toLowerCase() === cleanId || s.phone.trim() === cleanId
    );
    if (!seller) {
      return { success: false, error: 'No seller account registered with this email or mobile number.' };
    }
    const otp = '123456';
    setActiveOtpNotice({
      code: otp,
      recipient: seller.phone,
      purpose: 'Seller Password Reset',
    });
    showToast(`Password reset OTP 123456 sent to seller mobile ${seller.phone}`);
    return { success: true, otp };
  };

  const resetSellerPassword = (identifier: string, otp: string, newPass: string) => {
    if (otp.trim() !== '123456' && otp.trim() !== activeOtpNotice?.code) {
      return { success: false, error: 'Incorrect OTP. Please enter 123456.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    setSellers(prev =>
      prev.map(s =>
        s.email.toLowerCase() === cleanId || s.phone.trim() === cleanId
          ? { ...s, password: newPass }
          : s
      )
    );
    clearActiveOtpNotice();
    showToast('Seller password updated successfully! Please login with your new password.');
    navigate('/seller/login');
    return { success: true };
  };

  const sellerLogout = () => {
    setAuthSession({
      role: null,
      isAuthenticated: false,
      customer: null,
      seller: null,
      admin: null,
    });
    showToast('Logged out of Seller Portal successfully.');
    navigate('/seller/login');
  };

  // --- ADMIN AUTHENTICATION METHODS ---
  const adminLogin = (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const isAuthorizedAdmin = 
      cleanEmail === adminCredentials.email.toLowerCase() ||
      cleanEmail === 'jaishreeramenterprises24@gmail.com' ||
      cleanEmail === 'admin@harwalkart.com' ||
      cleanEmail === 'harwalkart@gmail.com';

    const isValidPassword = 
      cleanPass === adminCredentials.password ||
      cleanPass === 'Harwal@Admin2026' ||
      cleanPass === 'AdminHarwal@2025' ||
      cleanPass === 'admin123';

    if (isAuthorizedAdmin && isValidPassword) {
      const adminUser: AdminUser = {
        id: 'admin_master_1',
        name: cleanEmail.includes('jaishreeram') ? 'Jai Shree Ram Enterprises (Admin)' : 'Harwalkart Central Admin',
        email: cleanEmail,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      };
      const newSession: AuthSession = {
        role: 'admin',
        isAuthenticated: true,
        customer: null,
        seller: null,
        admin: adminUser,
      };
      setAuthSession(newSession);
      setCurrentRole('admin');

      // Attempt background server token registration
      try {
        fetch('/api/auth/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.token) {
              localStorage.setItem('hk_admin_token', data.token);
            }
          })
          .catch(() => {});
      } catch (e) {
        // ignore offline / client-side only mode
      }

      showToast('Authenticated as HARWALKART Administrator 🛡️');
      navigate('/admin/dashboard');
      return { success: true };
    }

    return { success: false, error: 'Access Denied: Unrecognized administrator credentials or unauthorized email.' };
  };

  const initiateAdminForgotPassword = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const isAuthorizedAdmin = 
      cleanEmail === adminCredentials.email.toLowerCase() ||
      cleanEmail === 'jaishreeramenterprises24@gmail.com' ||
      cleanEmail === 'admin@harwalkart.com' ||
      cleanEmail === 'harwalkart@gmail.com';

    if (isAuthorizedAdmin) {
      const otpCode = '123456';
      setActiveOtpNotice({
        code: otpCode,
        recipient: email,
        purpose: 'Admin Password Reset Security Recovery',
      });
      showToast(`Admin recovery security code: ${otpCode}`);
      return { success: true, otp: otpCode };
    }
    return { success: false, error: 'Email is not recognized as an authorized HARWALKART administrator.' };
  };

  const resetAdminPassword = (email: string, otp: string, newPass: string) => {
    if (otp.trim() !== '123456') {
      return { success: false, error: 'Invalid administrator recovery code.' };
    }
    const updatedCreds = {
      email: email.trim().toLowerCase(),
      password: newPass.trim(),
    };
    setAdminCredentials(updatedCreds);
    localStorage.setItem('hk_admin_credentials', JSON.stringify(updatedCreds));
    showToast('Admin master password updated successfully! Please log in.');
    navigate('/admin/login');
    return { success: true };
  };

  const adminLogout = () => {
    setAuthSession({
      role: null,
      isAuthenticated: false,
      customer: null,
      seller: null,
      admin: null,
    });
    showToast('Admin session terminated securely.');
    navigate('/admin/login');
  };

  // --- ADMIN DASHBOARD MODERATION & MANAGEMENT ACTIONS ---
  const approveSeller = (sellerId: string) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          const updatedKYC = s.kycDoc ? { ...s.kycDoc, verified: true } : undefined;
          const updatedDocs = s.kycDocuments?.map(d => ({ ...d, verified: true })) || (updatedKYC ? [updatedKYC] : []);
          return {
            ...s,
            status: 'approved' as SellerStatus,
            kycStatus: 'approved' as KycStatus,
            verified: true,
            isOpen: true,
            rejectionReason: undefined,
            correctionNotes: undefined,
            kycDoc: updatedKYC,
            kycDocuments: updatedDocs,
          };
        }
        return s;
      })
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              status: 'approved',
              kycStatus: 'approved',
              verified: true,
              isOpen: true,
              rejectionReason: undefined,
              correctionNotes: undefined,
            }
          : null,
      }));
    }
    showToast(`Seller #${sellerId} has been APPROVED! Shop is now LIVE on Harwalkart marketplace. ✅`);
  };

  const rejectSeller = (sellerId: string, reason?: string) => {
    const defaultReason = 'Application does not meet platform KYC & onboarding criteria';
    const finalReason = reason && reason.trim() ? reason.trim() : defaultReason;

    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          return {
            ...s,
            status: 'rejected' as SellerStatus,
            kycStatus: 'rejected' as KycStatus,
            verified: false,
            isOpen: false,
            rejectionReason: finalReason,
            kycDoc: s.kycDoc ? { ...s.kycDoc, verified: false } : undefined,
          };
        }
        return s;
      })
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              status: 'rejected',
              kycStatus: 'rejected',
              verified: false,
              isOpen: false,
              rejectionReason: finalReason,
            }
          : null,
      }));
    }
    showToast(`Seller #${sellerId} application has been REJECTED: "${finalReason}"`);
  };

  const requestSellerCorrection = (sellerId: string, notes: string) => {
    const noteText = notes.trim() || 'Please re-upload clear KYC documents.';
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          return {
            ...s,
            status: 'pending' as SellerStatus,
            kycStatus: 'correction_requested' as KycStatus,
            correctionNotes: noteText,
          };
        }
        return s;
      })
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              status: 'pending',
              kycStatus: 'correction_requested',
              correctionNotes: noteText,
            }
          : null,
      }));
    }
    showToast(`Correction request sent to Seller #${sellerId}: "${noteText}"`);
  };

  const submitSellerKycCorrection = (sellerId: string, updates: Partial<Seller>) => {
    setSellers(prev =>
      prev.map(s => {
        if (s.id === sellerId) {
          return {
            ...s,
            ...updates,
            kycStatus: 'under_review' as KycStatus,
            status: 'pending' as SellerStatus,
            correctionNotes: undefined,
          };
        }
        return s;
      })
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              ...updates,
              kycStatus: 'under_review',
              status: 'pending',
              correctionNotes: undefined,
            }
          : null,
      }));
    }
    showToast('Updated KYC documents submitted for Admin review! 📄');
  };

  const editSeller = (sellerId: string, updates: Partial<Seller>) => {
    setSellers(prev => prev.map(s => (s.id === sellerId ? { ...s, ...updates } : s)));
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller ? { ...prev.seller, ...updates } : null,
      }));
    }
    showToast(`Seller #${sellerId} details updated successfully.`);
    return true;
  };

  const suspendSeller = (sellerId: string, suspended: boolean) => {
    setSellers(prev =>
      prev.map(s =>
        s.id === sellerId
          ? {
              ...s,
              status: (suspended ? 'suspended' : 'approved') as SellerStatus,
              isOpen: !suspended,
            }
          : s
      )
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              status: (suspended ? 'suspended' : 'approved') as SellerStatus,
              isOpen: !suspended,
            }
          : null,
      }));
    }
    showToast(suspended ? `Seller #${sellerId} suspended.` : `Seller #${sellerId} reactivated.`);
  };

  const deleteSeller = (sellerId: string) => {
    const s = sellers.find(item => item.id === sellerId);
    setSellers(prev => prev.filter(item => item.id !== sellerId));
    setProducts(prev => prev.filter(p => p.sellerId !== sellerId));
    showToast(`Seller "${s?.shopName || sellerId}" and their products deleted from marketplace.`);
    return true;
  };

  const addSeller = (sellerData: Omit<Seller, 'id'>) => {
    const newId = `seller_${Date.now()}`;
    const newSeller: Seller = {
      ...sellerData,
      id: newId,
    };
    setSellers(prev => [newSeller, ...prev]);
    showToast(`New seller shop "${newSeller.shopName}" onboarded! 🏪`);
    return newSeller;
  };

  // Customer Management (Admin)
  const addCustomer = (custData: Omit<CustomerUser, 'id'>) => {
    const newId = `cust_${Date.now()}`;
    const newCust: CustomerUser = {
      ...custData,
      id: newId,
      joinedDate: custData.joinedDate || new Date().toISOString().split('T')[0],
      isVerified: true,
      savedAddresses: custData.savedAddresses || [],
      wishlist: custData.wishlist || [],
    };
    setRegisteredCustomers(prev => [newCust, ...prev]);
    showToast(`Customer account "${newCust.name}" created.`);
    return newCust;
  };

  const editCustomer = (id: string, updates: Partial<CustomerUser>) => {
    setRegisteredCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    if (authSession.customer?.id === id) {
      setAuthSession(prev => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, ...updates } : null,
      }));
    }
    showToast('Customer record updated successfully.');
    return true;
  };

  const toggleCustomerBlock = (id: string) => {
    let newBlockedState = false;
    setRegisteredCustomers(prev =>
      prev.map(c => {
        if (c.id === id) {
          newBlockedState = !c.isBlocked;
          return {
            ...c,
            isBlocked: newBlockedState,
            status: newBlockedState ? 'blocked' : 'active',
          };
        }
        return c;
      })
    );
    if (authSession.customer?.id === id) {
      setAuthSession(prev => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, isBlocked: newBlockedState, status: newBlockedState ? 'blocked' : 'active' } : null,
      }));
    }
    showToast(newBlockedState ? 'Customer account has been BLOCKED.' : 'Customer account has been UNBLOCKED.');
  };

  const deleteCustomer = (id: string) => {
    setRegisteredCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Customer account deleted from system.');
    return true;
  };

  // Product Approvals & Moderation
  const toggleProductApproval = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, approved: !p.approved } : p))
    );
    showToast('Product marketplace approval status toggled.');
  };

  const approveProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, approved: true } : p))
    );
    showToast('Product approved for marketplace live catalog! ✅');
  };

  const rejectProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, approved: false } : p))
    );
    showToast('Product unapproved / hidden from store catalog.');
  };

  const toggleSellerVerification = (sellerId: string) => {
    setSellers(prev =>
      prev.map(s => (s.id === sellerId ? { ...s, verified: !s.verified } : s))
    );
    showToast('Seller verification badge updated.');
  };

  // Categories CRUD
  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...catData,
      id: `cat_${catData.slug || Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added to marketplace.`);
    return newCat;
  };

  const editCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Category updated successfully.');
    return true;
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category removed.');
    return true;
  };

  // Brands CRUD (4 Independent Product Brands under Harwalkart Marketplace)
  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: `brand_${brandData.slug || Date.now()}`,
    };
    setBrands(prev => [...prev, newBrand]);
    showToast(`Brand "${newBrand.name}" registered successfully.`);
    return newBrand;
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Brand details updated successfully.');
    return true;
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    showToast('Brand removed from marketplace.');
    return true;
  };

  const toggleBrandStatus = (id: string) => {
    setBrands(prev =>
      prev.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    showToast('Brand active status updated.');
  };

  // Hero Banners CRUD (Homepage Dynamic Visuals & Admin Banners Control)
  const addHeroBanner = (bannerData: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...bannerData,
      id: `banner_${Date.now()}`,
    };
    setHeroBanners(prev => [...prev, newBanner]);
    showToast(`Hero banner "${newBanner.title}" created successfully! 🎨`);
    return newBanner;
  };

  const updateHeroBanner = (id: string, updates: Partial<HeroBanner>) => {
    setHeroBanners(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Hero banner updated successfully.');
    return true;
  };

  const deleteHeroBanner = (id: string) => {
    setHeroBanners(prev => prev.filter(b => b.id !== id));
    showToast('Hero banner removed.');
    return true;
  };

  const toggleHeroBannerStatus = (id: string) => {
    setHeroBanners(prev =>
      prev.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    showToast('Hero banner active status toggled.');
  };

  // Order deletion
  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted from records.`);
    return true;
  };

  // Delivery Partner Actions
  const addDeliveryPartner = (partnerData: Omit<DeliveryPartner, 'id'>) => {
    const newId = `rider_${Date.now()}`;
    const newPartner: DeliveryPartner = {
      ...partnerData,
      id: newId,
      joinedDate: partnerData.joinedDate || new Date().toISOString().split('T')[0],
      rating: partnerData.rating || 5.0,
      completedDeliveries: partnerData.completedDeliveries || 0,
      walletBalance: partnerData.walletBalance || 0,
      totalEarnings: partnerData.totalEarnings || 0,
    };
    setDeliveryPartners(prev => [newPartner, ...prev]);
    showToast(`Delivery partner "${newPartner.name}" registered successfully.`);
    return newPartner;
  };

  const editDeliveryPartner = (id: string, updates: Partial<DeliveryPartner>) => {
    setDeliveryPartners(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Delivery partner profile updated.');
    return true;
  };

  const deleteDeliveryPartner = (id: string) => {
    setDeliveryPartners(prev => prev.filter(p => p.id !== id));
    showToast('Delivery partner removed from roster.');
    return true;
  };

  const requestPartnerWithdrawal = (
    partnerId: string,
    amount: number,
    payoutMethod: 'upi' | 'bank_transfer',
    upiOrAccount: string
  ) => {
    const partner = deliveryPartners.find(p => p.id === partnerId);
    if (!partner) return { success: false, message: 'Delivery partner not found.' };
    if (amount <= 0 || amount > partner.walletBalance) {
      return { success: false, message: `Invalid amount. Maximum available balance is ₹${partner.walletBalance}.` };
    }

    const today = new Date().toISOString().split('T')[0];
    const newReq: WithdrawalRequest = {
      id: `wdr_dp_${Date.now()}`,
      beneficiaryType: 'delivery_partner',
      partnerId: partner.id,
      partnerName: partner.name,
      partnerPhone: partner.phone,
      partnerVehicle: `${partner.vehicleType} (${partner.vehicleNumber})`,
      amount,
      netPaid: amount,
      payoutMethod,
      upiOrAccount,
      status: 'pending',
      requestDate: today,
    };

    setWithdrawalRequests(prev => [newReq, ...prev]);
    setDeliveryPartners(prev =>
      prev.map(p => (p.id === partnerId ? { ...p, walletBalance: p.walletBalance - amount } : p))
    );

    showToast(`Withdrawal request of ₹${amount} submitted for "${partner.name}"!`);
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  // Withdrawals & Payout Management
  const approveWithdrawal = (withdrawalId: string, adminNotes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setWithdrawalRequests(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'approved',
              approvedDate: today,
              ...(adminNotes ? { adminNotes } : {}),
            }
          : w
      )
    );
    showToast(`Payout request #${withdrawalId} APPROVED. Ready for payment disbursal! ✅`);
    return true;
  };

  const rejectWithdrawal = (withdrawalId: string, reason: string, adminNotes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const wReq = withdrawalRequests.find(w => w.id === withdrawalId);
    if (!wReq) return false;

    setWithdrawalRequests(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'rejected',
              rejectionReason: reason || 'Application rejected by administrator.',
              processedDate: today,
              ...(adminNotes ? { adminNotes } : {}),
            }
          : w
      )
    );

    // Refund amount back to seller or delivery partner wallet
    if (wReq.beneficiaryType === 'delivery_partner' && wReq.partnerId) {
      setDeliveryPartners(prev =>
        prev.map(p => (p.id === wReq.partnerId ? { ...p, walletBalance: p.walletBalance + wReq.amount } : p))
      );
    } else if (wReq.sellerId) {
      setSellers(prev =>
        prev.map(s => (s.id === wReq.sellerId ? { ...s, walletBalance: s.walletBalance + wReq.amount } : s))
      );
      if (authSession.seller?.id === wReq.sellerId) {
        setAuthSession(prev => ({
          ...prev,
          seller: prev.seller ? { ...prev.seller, walletBalance: prev.seller.walletBalance + wReq.amount } : null,
        }));
      }
    }

    showToast(`Payout #${withdrawalId} REJECTED. ₹${wReq.amount} refunded to wallet.`);
    return true;
  };

  const markWithdrawalPaid = (
    withdrawalId: string,
    paymentDetails: { transactionRef: string; paymentMode?: string; paidDate?: string; adminNotes?: string }
  ) => {
    const today = paymentDetails.paidDate || new Date().toISOString().split('T')[0];
    const utr = paymentDetails.transactionRef || `UTR${Date.now()}`;
    const mode = paymentDetails.paymentMode || 'Direct Bank IMPS/UPI Payout';

    setWithdrawalRequests(prev =>
      prev.map(w =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'paid',
              transactionRef: utr,
              paymentMode: mode,
              paidDate: today,
              processedDate: today,
              ...(paymentDetails.adminNotes ? { adminNotes: paymentDetails.adminNotes } : {}),
            }
          : w
      )
    );
    showToast(`Payout #${withdrawalId} marked as PAID. Reference: ${utr} 💳`);
    return true;
  };

  const processWithdrawal = (
    withdrawalId: string,
    status: PayoutStatus,
    transactionRef?: string,
    rejectionReason?: string,
    adminNotes?: string
  ) => {
    if (status === 'approved') {
      approveWithdrawal(withdrawalId, adminNotes);
    } else if (status === 'rejected') {
      rejectWithdrawal(withdrawalId, rejectionReason || 'Rejected by administrator', adminNotes);
    } else if (status === 'paid' || status === 'completed') {
      markWithdrawalPaid(withdrawalId, {
        transactionRef: transactionRef || `UTR${Date.now()}`,
        paymentMode: 'Admin Verified Disbursal',
        adminNotes,
      });
    } else {
      setWithdrawalRequests(prev =>
        prev.map(w => (w.id === withdrawalId ? { ...w, status, ...(adminNotes ? { adminNotes } : {}) } : w))
      );
      showToast(`Payout #${withdrawalId} status updated to ${status}.`);
    }
  };

  const addManualPayout = (
    beneficiaryTypeOrSellerId: 'seller' | 'delivery_partner' | string,
    targetIdOrAmount: string | number,
    amountOrNote?: number | string,
    method?: 'upi' | 'bank_transfer',
    destination?: string,
    transactionRef?: string,
    note?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const utr = transactionRef || `SETTLE-${Date.now()}`;

    // Handle legacy call: addManualPayout(sellerId, amount, note)
    if (typeof targetIdOrAmount === 'number') {
      const sellerId = beneficiaryTypeOrSellerId;
      const amount = Math.abs(targetIdOrAmount);
      const customNote = typeof amountOrNote === 'string' ? amountOrNote : 'Manual settlement';
      const seller = sellers.find(s => s.id === sellerId);
      if (!seller) return false;

      const newReq: WithdrawalRequest = {
        id: `payout_manual_${Date.now()}`,
        beneficiaryType: 'seller',
        sellerId: seller.id,
        sellerShopName: seller.shopName,
        amount,
        grossAmount: amount,
        netPaid: amount,
        payoutMethod: 'bank_transfer',
        upiOrAccount: customNote,
        status: 'paid',
        requestDate: today,
        approvedDate: today,
        processedDate: today,
        paidDate: today,
        transactionRef: utr,
        paymentMode: 'Direct Bank Settlement',
        adminNotes: customNote,
      };

      setWithdrawalRequests(prev => [newReq, ...prev]);
      setSellers(prev =>
        prev.map(s =>
          s.id === sellerId
            ? {
                ...s,
                walletBalance: Math.max(0, s.walletBalance - amount),
                totalEarnings: s.totalEarnings + amount,
              }
            : s
        )
      );
      showToast(`Manual settlement of ₹${amount} recorded for "${seller.shopName}".`);
      return true;
    }

    // Modern multi-beneficiary call
    const bType = beneficiaryTypeOrSellerId === 'delivery_partner' ? 'delivery_partner' : 'seller';
    const targetId = String(targetIdOrAmount);
    const amount = Math.abs(Number(amountOrNote) || 0);
    const payoutMethod = method || 'upi';

    if (bType === 'seller') {
      const seller = sellers.find(s => s.id === targetId);
      if (!seller) return false;

      const newReq: WithdrawalRequest = {
        id: `payout_manual_${Date.now()}`,
        beneficiaryType: 'seller',
        sellerId: seller.id,
        sellerShopName: seller.shopName,
        amount,
        grossAmount: amount,
        netPaid: amount,
        payoutMethod,
        upiOrAccount: destination || seller.phone,
        status: 'paid',
        requestDate: today,
        approvedDate: today,
        processedDate: today,
        paidDate: today,
        transactionRef: utr,
        paymentMode: payoutMethod === 'upi' ? 'UPI Instant Payout' : 'Bank Transfer NEFT/IMPS',
        adminNotes: note || 'Direct Administrator Settlement',
      };

      setWithdrawalRequests(prev => [newReq, ...prev]);
      setSellers(prev =>
        prev.map(s =>
          s.id === targetId
            ? {
                ...s,
                walletBalance: Math.max(0, s.walletBalance - amount),
                totalEarnings: s.totalEarnings + amount,
              }
            : s
        )
      );
      showToast(`Manual settlement of ₹${amount} recorded for "${seller.shopName}".`);
      return true;
    } else {
      const partner = deliveryPartners.find(p => p.id === targetId);
      if (!partner) return false;

      const newReq: WithdrawalRequest = {
        id: `payout_manual_${Date.now()}`,
        beneficiaryType: 'delivery_partner',
        partnerId: partner.id,
        partnerName: partner.name,
        partnerPhone: partner.phone,
        partnerVehicle: `${partner.vehicleType} (${partner.vehicleNumber})`,
        amount,
        grossAmount: amount,
        netPaid: amount,
        payoutMethod,
        upiOrAccount: destination || partner.upiId || partner.phone,
        status: 'paid',
        requestDate: today,
        approvedDate: today,
        processedDate: today,
        paidDate: today,
        transactionRef: utr,
        paymentMode: payoutMethod === 'upi' ? 'UPI Instant Payout' : 'Bank Transfer NEFT/IMPS',
        adminNotes: note || 'Delivery Partner Earning Settlement',
      };

      setWithdrawalRequests(prev => [newReq, ...prev]);
      setDeliveryPartners(prev =>
        prev.map(p =>
          p.id === targetId
            ? {
                ...p,
                walletBalance: Math.max(0, p.walletBalance - amount),
                totalEarnings: p.totalEarnings + amount,
              }
            : p
        )
      );
      showToast(`Manual payout of ₹${amount} recorded for Delivery Partner "${partner.name}".`);
      return true;
    }
  };

  const deleteWithdrawalRequest = (withdrawalId: string) => {
    setWithdrawalRequests(prev => prev.filter(w => w.id !== withdrawalId));
    showToast(`Payout record #${withdrawalId} deleted.`);
    return true;
  };

  // PIN Codes & Cities CRUD
  const addCityHub = (hubData: Omit<CityHub, 'id'>) => {
    const newHub: CityHub = {
      ...hubData,
      id: `hub_${hubData.city.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
    };
    setCityHubs(prev => [...prev, newHub]);
    showToast(`City delivery hub "${newHub.city}, ${newHub.state}" configured.`);
    return newHub;
  };

  const editCityHub = (id: string, updates: Partial<CityHub>) => {
    setCityHubs(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
    showToast('City hub & PIN code configuration updated.');
    return true;
  };

  const deleteCityHub = (id: string) => {
    setCityHubs(prev => prev.filter(h => h.id !== id));
    showToast('City delivery hub removed.');
    return true;
  };

  // Video Shopping Campaigns (Admin & Seller)
  const addVideoAd = (videoData: Omit<ProductVideoAd, 'id' | 'views' | 'clicks' | 'shares' | 'createdAt'>) => {
    const newAd: ProductVideoAd = {
      ...videoData,
      id: `video_ad_${Date.now()}`,
      views: 0,
      clicks: 0,
      shares: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVideoAds(prev => [newAd, ...prev]);
    showToast(`Video shopping campaign "${newAd.productName}" published! 🎥`);
    return newAd;
  };

  const editVideoAd = (adId: string, updates: Partial<ProductVideoAd>) => {
    setVideoAds(prev => prev.map(v => (v.id === adId ? { ...v, ...updates } : v)));
    showToast('Video ad campaign updated.');
    return true;
  };

  const deleteVideoAd = (adId: string) => {
    setVideoAds(prev => prev.filter(v => v.id !== adId));
    showToast('Video ad campaign deleted.');
    return true;
  };

  const toggleVideoAdStatus = (adId: string, status: ProductVideoAd['status']) => {
    setVideoAds(prev => prev.map(v => (v.id === adId ? { ...v, status } : v)));
    showToast(`Video campaign status set to ${status}.`);
  };

  // Advertisements & Banners CRUD
  const addAdvertisement = (adData: Omit<Advertisement, 'id' | 'clicks' | 'impressions' | 'createdAt'>) => {
    const newAd: Advertisement = {
      ...adData,
      id: `ad_${Date.now()}`,
      clicks: 0,
      impressions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAdvertisements(prev => [newAd, ...prev]);
    showToast(`Advertisement banner "${newAd.title}" published!`);
    return newAd;
  };

  const editAdvertisement = (id: string, updates: Partial<Advertisement>) => {
    setAdvertisements(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Advertisement details saved.');
    return true;
  };

  const deleteAdvertisement = (id: string) => {
    setAdvertisements(prev => prev.filter(a => a.id !== id));
    showToast('Advertisement banner removed.');
    return true;
  };

  const toggleAdvertisementStatus = (id: string, status: Advertisement['status']) => {
    setAdvertisements(prev => prev.map(a => (a.id === id ? { ...a, status } : a)));
    showToast(`Ad banner status set to ${status}.`);
  };

  // Support & Contact Management
  const updateSupportTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(t => (t.id === ticketId ? { ...t, status } : t)));
    showToast(`Support ticket status updated to ${status}.`);
  };

  const deleteSupportTicket = (ticketId: string) => {
    setSupportTickets(prev => prev.filter(t => t.id !== ticketId));
    showToast('Support ticket deleted.');
    return true;
  };

  // Website Settings Management
  const updateWebsiteSettings = (updates: Partial<WebsiteSettings>) => {
    setWebsiteSettings(prev => {
      const merged = { ...prev, ...updates };
      // Sync to server if admin token exists
      const token = localStorage.getItem('hk_admin_auth_token');
      if (token) {
        fetch('/api/admin/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(merged),
        }).catch(err => console.warn('Server settings sync notice:', err));
      }
      return merged;
    });
    showToast('HARWALKART Platform Settings saved and applied across marketplace! ⚙️');
  };

  const resetWebsiteSettings = () => {
    setWebsiteSettings(INITIAL_WEBSITE_SETTINGS);
    const token = localStorage.getItem('hk_admin_auth_token');
    if (token) {
      fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(INITIAL_WEBSITE_SETTINGS),
      }).catch(err => console.warn('Server settings reset notice:', err));
    }
    showToast('HARWALKART Platform Settings restored to default.');
  };

  // Company Bank Account Management (Admin Private)
  const saveCompanyBankAccount = (account: CompanyBankAccount) => {
    const updated: CompanyBankAccount = {
      ...account,
      accountNumber: account.accountNumber.trim(),
      ifscCode: account.ifscCode.trim().toUpperCase(),
      accountHolderName: account.accountHolderName.trim(),
      bankName: account.bankName.trim(),
      upiId: account.upiId ? account.upiId.trim() : undefined,
      updatedAt: new Date().toISOString(),
    };
    setCompanyBankAccount(updated);
    setPaymentSettings(prev => ({ ...prev, companyBankAccount: updated }));

    // Send to server if admin token exists
    const token = localStorage.getItem('hk_admin_auth_token');
    if (token) {
      fetch('/api/admin/company-bank-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      }).catch(err => console.warn('Server sync notice:', err));
    }

    showToast('Company Bank Account saved successfully. 🏦');
  };

  const removeCompanyBankAccount = () => {
    setCompanyBankAccount(null);
    setPaymentSettings(prev => ({ ...prev, companyBankAccount: null }));

    const token = localStorage.getItem('hk_admin_auth_token');
    if (token) {
      fetch('/api/admin/company-bank-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(err => console.warn('Server sync notice:', err));
    }

    showToast('Company Bank Account removed.');
  };

  const updatePaymentSettings = (updates: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => ({ ...prev, ...updates }));
    showToast('Payment Settings updated.');
  };

  // --- SELLER DASHBOARD ACTIONS ---
  const addProduct = (prodData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'approved'> & { approved?: boolean }) => {
    const newProd: Product = {
      ...prodData,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      approved: prodData.approved !== undefined ? prodData.approved : true,
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${newProd.name.slice(0, 30)}..." added to inventory! 📦`);
  };

  const updateProduct = (id: string, updates: Partial<Product>, requestingSellerId?: string) => {
    const existing = products.find(p => p.id === id);
    if (!existing) {
      showToast('Product not found.');
      return false;
    }
    if (requestingSellerId && existing.sellerId !== requestingSellerId) {
      showToast('Unauthorized: You can only edit your own shop products.');
      return false;
    }
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Product inventory updated successfully.');
    return true;
  };

  const deleteProduct = (productId: string, requestingSellerId?: string) => {
    const existing = products.find(p => p.id === productId);
    if (!existing) {
      showToast('Product not found.');
      return false;
    }
    if (requestingSellerId && existing.sellerId !== requestingSellerId) {
      showToast('Unauthorized: You can only delete your own shop products.');
      return false;
    }
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast(`Product "${existing.name.slice(0, 25)}..." deleted from catalog.`);
    return true;
  };

  const updateSellerStock = (productId: string, stockQuantity: number, inStock: boolean) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockQuantity, inStock } : p))
    );
    showToast(`Stock updated: ${stockQuantity} units (${inStock ? 'In Stock' : 'Out of Stock'})`);
  };

  const createVideoCampaign = (campaign: Omit<ProductVideoAd, 'id' | 'views' | 'clicks' | 'shares' | 'status' | 'createdAt'>) => {
    const newAd: ProductVideoAd = {
      ...campaign,
      id: `video_ad_${Date.now()}`,
      views: 1,
      clicks: 0,
      shares: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVideoAds(prev => [newAd, ...prev]);
    showToast('Video Shopping Campaign created and submitted for area broadcasting! 🎥');
  };

  const updateSellerProfile = (sellerId: string, updates: Partial<Seller>) => {
    setSellers(prev => prev.map(s => (s.id === sellerId ? { ...s, ...updates } : s)));
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller ? { ...prev.seller, ...updates } : null,
      }));
    }
    showToast('Shop profile details updated successfully.');
  };

  const requestWithdrawal = (sellerId: string, amount: number, payoutMethod: 'upi' | 'bank_transfer', upiOrAccount: string) => {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return { success: false, message: 'Seller not found.' };
    if (amount <= 0 || amount > seller.walletBalance) {
      return { success: false, message: `Invalid amount. Maximum available balance is ₹${seller.walletBalance}.` };
    }
    if (!upiOrAccount.trim()) {
      return { success: false, message: 'Please provide valid UPI ID or Bank account details.' };
    }

    const newReq: WithdrawalRequest = {
      id: `wdr_${Date.now()}`,
      sellerId: seller.id,
      sellerShopName: seller.shopName,
      amount,
      payoutMethod,
      upiOrAccount,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };

    setWithdrawalRequests(prev => [newReq, ...prev]);
    setSellers(prev =>
      prev.map(s => (s.id === sellerId ? { ...s, walletBalance: s.walletBalance - amount } : s))
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller ? { ...prev.seller, walletBalance: prev.seller.walletBalance - amount } : null,
      }));
    }

    showToast(`Withdrawal request of ₹${amount} submitted to Harwalkart Accounts Team!`);
    return { success: true, message: 'Withdrawal request submitted successfully.' };
  };

  const replyToSellerMessage = (messageId: string, reply: string) => {
    setSellerMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, reply, repliedAt: new Date().toLocaleString('en-IN') }
          : m
      )
    );
    showToast('Reply sent to customer.');
  };

  const sendSellerCustomerMessage = (data: { sellerId: string; customerName: string; customerPhone: string; customerEmail: string; productName?: string; message: string }) => {
    const newMsg: SellerCustomerMessage = {
      id: `msg_${Date.now()}`,
      ...data,
      date: new Date().toLocaleString('en-IN'),
    };
    setSellerMessages(prev => [newMsg, ...prev]);
    showToast('Your message has been sent to the shop owner! 💬');
  };

  const updateServiceablePincodes = (sellerId: string, pincodes: string[], radiusKm: number) => {
    const target = sellers.find(s => s.id === sellerId);
    const isLocked = target?.isRadiusLocked || target?.sellerType === 'local_without_gst' || !target?.isGstRegistered;
    const finalRadius = isLocked ? Math.min(radiusKm, 10) : radiusKm;

    setSellers(prev =>
      prev.map(s => (s.id === sellerId ? { ...s, serviceablePincodes: pincodes, serviceRadiusKm: finalRadius } : s))
    );
    if (authSession.seller?.id === sellerId) {
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller ? { ...prev.seller, serviceablePincodes: pincodes, serviceRadiusKm: finalRadius } : null,
      }));
    }
    if (isLocked && radiusKm > 10) {
      showToast(`Notice: As a Non-GST Local Seller, delivery radius is fixed at 10 KM limit.`);
    } else {
      showToast(`Target delivery area updated: ${pincodes.length} PIN codes (${finalRadius} km radius).`);
    }
  };

  // Support Tickets
  const addSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt'>) => {
    const newTkt: SupportTicket = {
      ...ticketData,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      createdAt: new Date().toLocaleString('en-IN'),
    };
    setSupportTickets(prev => [newTkt, ...prev]);
    showToast('Aapka inquiry ticket Harwalkart Support Desk ko bhej diya gaya hai! 📩');
  };

  const replyToSupportTicket = (ticketId: string, reply: string) => {
    setSupportTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, response: reply, status: 'resolved' } : t))
    );
    showToast('Customer support reply recorded.');
  };

  // Wishlist
  const customerUser = authSession.customer || registeredCustomers[0];
  const wishlist = customerUser?.wishlist || [];

  const toggleWishlist = (productId: string) => {
    if (!authSession.customer) {
      showToast('Please login to your Harwalkart customer account to save favorites.');
      navigate('/customer/login');
      return;
    }
    const currentList = authSession.customer.wishlist || [];
    const exists = currentList.includes(productId);
    const updatedList = exists
      ? currentList.filter(id => id !== productId)
      : [...currentList, productId];

    updateCustomerProfile({ wishlist: updatedList });
    showToast(exists ? 'Removed from your Wishlist' : 'Added to your Wishlist ❤️');
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 25)}..." to cart 🛒`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartDeliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 40;
  const cartDiscount = appliedCoupon === 'HARWAL100' && cartSubtotal >= 499 ? 100 : 0;
  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - cartDiscount);

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'HARWAL100') {
      if (cartSubtotal >= 499) {
        setAppliedCoupon('HARWAL100');
        showToast('Coupon HARWAL100 applied: Flat ₹100 Discount! 🎉');
        return { success: true, message: 'Coupon applied successfully!' };
      }
      return { success: false, message: 'Minimum order amount for HARWAL100 is ₹499' };
    }
    return { success: false, message: 'Invalid coupon code. Try HARWAL100' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Orders
  const placeOrder = (orderDetails: Omit<Order, 'id' | 'date' | 'status' | 'trackingSteps'>) => {
    // Calculate 2% HARWALKART company commission order-wise and item-wise
    const enrichedItems = orderDetails.items.map(it => {
      const itemTotal = it.price * it.quantity;
      const commissionRate = 0.02; // Flat 2% company commission
      const commissionAmount = Math.round(itemTotal * commissionRate * 100) / 100;
      const netSellerAmount = Math.round((itemTotal - commissionAmount) * 100) / 100;
      return {
        ...it,
        commissionRate,
        commissionAmount,
        netSellerAmount,
      };
    });

    const sellerCommissionTotal = Math.round(enrichedItems.reduce((acc, cur) => acc + (cur.commissionAmount || 0), 0) * 100) / 100;
    const sellerNetSettlementTotal = Math.round(enrichedItems.reduce((acc, cur) => acc + (cur.netSellerAmount || 0), 0) * 100) / 100;

    const newOrder: Order = {
      id: `HK-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      ...orderDetails,
      items: enrichedItems,
      sellerCommissionTotal,
      sellerNetSettlementTotal,
      status: 'placed',
      trackingSteps: [
        { title: 'Order Placed', description: 'Order successfully placed on Harwalkart', timestamp: 'Just now', completed: true, current: true },
        { title: 'Order Confirmed', description: 'Awaiting seller dispatch confirmation', timestamp: 'Pending', completed: false, current: false },
        { title: 'Preparing / Packed', description: 'Packing fresh items with tamper-proof seal', timestamp: 'Pending', completed: false, current: false },
        { title: 'Out for Delivery', description: 'Local delivery executive assignment', timestamp: 'Pending', completed: false, current: false },
        { title: 'Delivered', description: 'Contactless delivery with OTP verification', timestamp: 'Pending', completed: false, current: false },
      ],
    };

    // Update sellers' wallet balances and total earnings with net settlement
    const sellerEarningsMap: Record<string, { gross: number; net: number }> = {};
    enrichedItems.forEach(item => {
      if (!sellerEarningsMap[item.sellerId]) {
        sellerEarningsMap[item.sellerId] = { gross: 0, net: 0 };
      }
      sellerEarningsMap[item.sellerId].gross += item.price * item.quantity;
      sellerEarningsMap[item.sellerId].net += item.netSellerAmount || 0;
    });

    setSellers(prev =>
      prev.map(s => {
        if (sellerEarningsMap[s.id]) {
          const { gross, net } = sellerEarningsMap[s.id];
          return {
            ...s,
            walletBalance: Math.round((s.walletBalance + net) * 100) / 100,
            totalEarnings: Math.round((s.totalEarnings + gross) * 100) / 100,
          };
        }
        return s;
      })
    );

    if (authSession.seller && sellerEarningsMap[authSession.seller.id]) {
      const { gross, net } = sellerEarningsMap[authSession.seller.id];
      setAuthSession(prev => ({
        ...prev,
        seller: prev.seller
          ? {
              ...prev.seller,
              walletBalance: Math.round((prev.seller.walletBalance + net) * 100) / 100,
              totalEarnings: Math.round((prev.seller.totalEarnings + gross) * 100) / 100,
            }
          : null,
      }));
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setSelectedTrackingOrderId(newOrder.id);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const steps = ord.trackingSteps.map((step, idx) => {
          if (status === 'placed') return { ...step, completed: idx === 0, current: idx === 0 };
          if (status === 'confirmed') return { ...step, completed: idx <= 1, current: idx === 1, timestamp: idx <= 1 ? (step.timestamp === 'Pending' ? now : step.timestamp) : 'Pending' };
          if (status === 'preparing') return { ...step, completed: idx <= 2, current: idx === 2, timestamp: idx <= 2 ? (step.timestamp === 'Pending' ? now : step.timestamp) : 'Pending' };
          if (status === 'out_for_delivery') return { ...step, completed: idx <= 3, current: idx === 3, timestamp: idx <= 3 ? (step.timestamp === 'Pending' ? now : step.timestamp) : 'Pending' };
          if (status === 'delivered') return { ...step, completed: true, current: false, timestamp: step.timestamp === 'Pending' ? now : step.timestamp };
          return step;
        });
        return { ...ord, status, trackingSteps: steps };
      })
    );
    showToast(`Order #${orderId} status changed to ${status.replace('_', ' ').toUpperCase()}`);
  };

  // Backward compatibility user methods
  const loginUser = (userUpdates: Partial<CustomerUser>) => {
    const updated = { ...customerUser, ...userUpdates };
    updateCustomerProfile(updated);
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    customerLogout();
  };

  const updateSavedAddress = (address: CustomerUser['savedAddresses'][0]) => {
    if (!authSession.customer) return;
    const existing = authSession.customer.savedAddresses || [];
    const updated = existing.map(a => (a.id === address.id ? address : a));
    if (!existing.some(a => a.id === address.id)) {
      updated.push(address);
    }
    updateCustomerProfile({ savedAddresses: updated });
  };

  const openShareModal = (data: ShareData) => setShareModalData(data);
  const closeShareModal = () => setShareModalData(null);

  // Filtered lists based on current GPS location, GST Pan-India eligibility, and 10 KM limit
  const currentPin = currentLocation.pincode;

  // Enriched sellers with live calculated distance from customer's coordinates
  const enrichedSellers = sellers.map(s => {
    const serviceCheck = checkSellerServiceability(s, currentLocation);
    return {
      ...s,
      distanceKm: serviceCheck.distanceKm,
    };
  });

  const eligibleProducts = products.filter(p => {
    const seller = sellers.find(s => s.id === p.sellerId);
    return checkProductServiceability(p, seller, currentLocation);
  });

  const eligibleSellers = enrichedSellers.filter(s => {
    if (s.status !== 'approved') return false;
    const check = checkSellerServiceability(s, currentLocation);
    return check.isServiceable;
  });

  const harwalkartProducts = eligibleProducts.filter(p => p.isHarwalkartDirect);
  const localShopProducts = eligibleProducts.filter(p => !p.isHarwalkartDirect);

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedShopId,
        setSelectedShopId,
        selectedCmsPage,
        setSelectedCmsPage,
        selectedBrandSlug,
        setSelectedBrandSlug,
        navigateToBrand,
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        toggleBrandStatus,
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        toggleHeroBannerStatus,
        authSession,
        currentRole,
        setCurrentRole,
        customerLogin,
        initiateCustomerRegister,
        verifyCustomerRegistrationOtp,
        initiateCustomerForgotPassword,
        resetCustomerPassword,
        customerLogout,
        updateCustomerProfile,
        registeredCustomers,
        sellerLogin,
        initiateSellerRegister,
        verifySellerRegistrationOtp,
        initiateSellerForgotPassword,
        resetSellerPassword,
        sellerLogout,
        adminLogin,
        initiateAdminForgotPassword,
        resetAdminPassword,
        adminLogout,
        activeOtpNotice,
        clearActiveOtpNotice,
        currentLocation,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        availableCities: CITIES_AND_PINCODES,
        sellers: enrichedSellers,
        products,
        videoAds,
        orders,
        supportTickets,
        withdrawalRequests,
        sellerMessages,
        eligibleProducts,
        eligibleSellers,
        harwalkartProducts,
        localShopProducts,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        customerUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginUser,
        logoutUser,
        updateSavedAddress,
        placeOrder,
        updateOrderStatus,
        selectedTrackingOrderId,
        setSelectedTrackingOrderId,
        shareModalData,
        openShareModal,
        closeShareModal,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSellerStock,
        createVideoCampaign,
        updateSellerProfile,
        requestWithdrawal,
        replyToSellerMessage,
        sendSellerCustomerMessage,
        updateServiceablePincodes,
        approveSeller,
        rejectSeller,
        requestSellerCorrection,
        submitSellerKycCorrection,
        toggleProductApproval,
        toggleSellerVerification,
        toggleVideoAdStatus,
        processWithdrawal,
        addSupportTicket,
        replyToSupportTicket,
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        advertisements,
        addAdvertisement,
        editAdvertisement,
        deleteAdvertisement,
        toggleAdvertisementStatus,
        cityHubs,
        addCityHub,
        editCityHub,
        deleteCityHub,
        websiteSettings,
        updateWebsiteSettings,
        resetWebsiteSettings,
        companyBankAccount,
        saveCompanyBankAccount,
        removeCompanyBankAccount,
        paymentSettings,
        updatePaymentSettings,
        addCustomer,
        editCustomer,
        toggleCustomerBlock,
        deleteCustomer,
        addSeller,
        editSeller,
        suspendSeller,
        deleteSeller,
        approveProduct,
        rejectProduct,
        deleteOrder,
        addManualPayout,
        deleteWithdrawalRequest,
        addVideoAd,
        editVideoAd,
        deleteVideoAd,
        updateSupportTicketStatus,
        deleteSupportTicket,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
