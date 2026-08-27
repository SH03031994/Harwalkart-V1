export type Role = 'customer' | 'seller' | 'admin';

export type SellerType = 'gst' | 'local_without_gst';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type KycStatus = 'pending_kyc' | 'kyc_submitted' | 'under_review' | 'approved' | 'rejected' | 'correction_requested';

export interface LocationState {
  city: string;
  pincode: string;
  area: string;
  state?: string;
  street?: string;
  formattedAddress?: string;
  latitude?: number;
  longitude?: number;
  accuracyMeters?: number;
  isGpsDetected?: boolean;
}

export interface SellerKycDoc {
  id?: string;
  docType: 'GST Certificate' | 'PAN Card' | 'Aadhaar Card' | 'Shop Act License' | 'FSSAI Registration' | 'Bank Passbook' | 'Electricity Bill' | 'Shop & Establishment Act' | 'FSSAI License' | 'Trade License' | 'Bank Passbook / Cheque' | string;
  docNumber: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  verified?: boolean;
  uploadedAt?: string;
  notes?: string;
}

export interface Seller {
  id: string;
  name: string; // Owner name
  ownerName?: string;
  shopName: string;
  slug: string;
  logo: string;
  bannerImage: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
  distanceKm: number;
  serviceablePincodes: string[];
  serviceRadiusKm: number;
  isRadiusLocked?: boolean;
  sellerType: SellerType;
  kycStatus: KycStatus;
  isHarwalkartDirect: boolean;
  isGstRegistered: boolean;
  gstin?: string;
  gstDocFileName?: string;
  panNumber?: string;
  panDocFileName?: string;
  businessInfo?: string;
  status: SellerStatus;
  rejectionReason?: string;
  correctionNotes?: string;
  adminNotes?: string;
  kycDoc?: SellerKycDoc;
  kycDocuments?: SellerKycDoc[];
  walletBalance: number;
  totalEarnings: number;
  password?: string;
  latitude?: number;
  longitude?: number;
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
    state: string;
  };
  phone: string;
  email: string;
  verified: boolean;
  productCount: number;
  joinedDate: string;
  categories: string[];
  commissionRateOverride?: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  pincode?: string;
  address?: string;
  avatar?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  status?: 'active' | 'blocked';
  joinedDate?: string;
  savedAddresses: {
    id: string;
    name: string;
    mobile: string;
    addressLine: string;
    area: string;
    city: string;
    pincode: string;
    isDefault: boolean;
  }[];
  wishlist: string[]; // product IDs
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  avatar?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  pincode?: string;
  vehicleType: 'Bike' | 'Scooter' | 'Electric EV' | 'Van';
  vehicleNumber: string;
  licenseNumber?: string;
  status: 'active' | 'offline' | 'suspended';
  walletBalance: number;
  totalEarnings: number;
  completedDeliveries: number;
  rating: number;
  upiId?: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  joinedDate: string;
}

export type PayoutStatus = 'pending' | 'approved' | 'rejected' | 'paid' | 'completed';

export interface WithdrawalRequest {
  id: string;
  beneficiaryType?: 'seller' | 'delivery_partner';
  sellerId?: string;
  sellerShopName?: string;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerVehicle?: string;
  amount: number;
  grossAmount?: number;
  commissionDeducted?: number;
  tdsDeducted?: number;
  netPaid?: number;
  payoutMethod: 'upi' | 'bank_transfer' | 'imps' | 'neft';
  upiOrAccount: string;
  bankDetails?: {
    accountHolderName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    upiId?: string;
  };
  status: PayoutStatus;
  rejectionReason?: string;
  adminNotes?: string;
  requestDate: string;
  approvedDate?: string;
  processedDate?: string;
  paidDate?: string;
  transactionRef?: string;
  paymentMode?: string;
}

export interface SellerCustomerMessage {
  id: string;
  sellerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName?: string;
  message: string;
  date: string;
  reply?: string;
  repliedAt?: string;
}

export interface AuthSession {
  role: Role | null;
  isAuthenticated: boolean;
  customer: CustomerUser | null;
  seller: Seller | null;
  admin: AdminUser | null;
}

export interface Brand {
  id: string;
  name: string; // 'KitchenShakti' | 'NutriFlow' | 'Rupabhoom™' | 'GrahShorya™' | string
  slug: string; // 'kitchen-shakti' | 'nutriflow' | 'rupabhoom' | 'grahshorya' | string
  hindiName?: string;
  category: string;
  categoryName?: string;
  tagline: string;
  description: string;
  logoUrl: string; // file_00000000...png or asset URL
  bannerUrl?: string;
  themeColor: string;
  accentColor: string;
  isOwned: boolean; // Harwalkart owned / flagship brand
  isFeatured: boolean;
  status: 'active' | 'inactive';
  isActive?: boolean;
  story?: string;
  uspBadges: string[];
  productCount?: number;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  brand: string;
  brandId?: string;
  brandSlug?: string;
  sellerId: string;
  sellerName: string;
  isHarwalkartDirect: boolean;
  category: string;
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  sku?: string;
  images: string[];
  videoUrl?: string;
  unit: string;
  packagingType?: string; // 'Transparent Stand-up Pouch' | 'Transparent Food-Grade Pouch' | 'Clear Premium Jar' | 'Frosted Beauty Bottle' | 'Transparent Trigger Spray' | string
  weightOrQuantity?: string;
  description: string;
  ingredients?: string[];
  benefits?: string[];
  fssaiNumber?: string;
  serviceablePincodes: string[]; // empty or ['*'] means PAN-India
  approved: boolean;
  isActive?: boolean;
  displayOrder?: number;
  featured?: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  buttonText: string;
  buttonLink: string; // e.g. '/brand/kitchen-shakti', '/brand/nutriflow', '/products'
  brandTag?: string;
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface ProductVideoAd {
  id: string;
  productId: string;
  productName: string;
  price: number;
  shopId: string;
  shopName: string;
  sellerName: string;
  locationArea: string;
  city: string;
  videoUrl: string;
  thumbnail: string;
  targetPincodes: string[];
  targetRadiusKm: number;
  campaignDurationDays: number;
  budgetDaily: number;
  views: number;
  clicks: number;
  shares: number;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  image: string;
  price: number;
  quantity: number;
  sellerName: string;
  sellerId: string;
  commissionRate?: number; // 0.02 (2%)
  commissionAmount?: number; // e.g. price * quantity * 0.02
  netSellerAmount?: number; // e.g. (price * quantity) - commissionAmount
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  taxAmount: number;
  total: number;
  sellerCommissionTotal?: number; // total 2% Harwalkart commission
  sellerNetSettlementTotal?: number; // total net payable to sellers
  status: OrderStatus;
  deliveryAddress: {
    fullName: string;
    mobile: string;
    addressLine: string;
    area: string;
    city: string;
    pincode: string;
    state: string;
    landmark?: string;
  };
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending';
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    description: string;
    timestamp?: string;
    completed: boolean;
    current: boolean;
  }[];
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderId?: string;
  category: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  response?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image: string;
  description: string;
  commissionRate: number; // e.g. 2.5
  isActive: boolean;
  displayOrder?: number;
}

export interface Advertisement {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  linkUrl: string;
  targetCity: string; // e.g. 'All' or 'New Delhi'
  targetPincode?: string;
  position: 'hero' | 'middle' | 'sidebar' | 'popup';
  status: 'active' | 'paused';
  clicks: number;
  impressions: number;
  createdAt: string;
}

export interface CityHubArea {
  name: string;
  pincode: string;
}

export interface CityHub {
  id: string;
  city: string;
  state: string;
  areas: CityHubArea[];
  isActive: boolean;
}

export interface WebsiteSettings {
  // 1. Basic Information
  brandName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  helplinePhone: string;
  supportEmail: string;
  whatsappSupportNumber: string;
  officialAddress: string;
  registeredAddress?: string;

  // In-House Brand (Kitchen Shakti)
  flagshipBrand: string;
  flagshipTagline: string;

  // 2. Appearance
  theme: 'light' | 'dark' | 'system' | 'amber-modern';
  primaryColor: string;
  accentColor: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  showHeroBanner: boolean;
  showCategorySection: boolean;
  showTrendingSection: boolean;
  showKitchenShaktiSection: boolean;
  announcementBannerText: string;
  isAnnouncementActive: boolean;
  footerAboutText: string;
  footerCopyrightText: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    linkedin?: string;
  };

  // 3. Marketplace
  enableCustomerRegistration: boolean;
  enableSellerRegistration: boolean;
  requireSellerKycApproval: boolean;
  requireProductApproval: boolean;
  enableProductReviews: boolean;
  defaultCommissionRate: number; // e.g. 2.5
  enableDirectKitchenShakti: boolean;

  // 4. Delivery
  localDeliveryRadiusKm: number;
  standardDeliveryFee: number;
  expressDeliveryFee: number;
  freeDeliveryThreshold: number;
  localDeliveryTime: string;
  enablePanIndiaDelivery: boolean;
  panIndiaDeliveryTime: string;
  panIndiaDeliveryFee: number;
  enableCodDelivery: boolean;

  // 5. Payment
  enableUpiPayment: boolean;
  enableCardPayment: boolean;
  enableNetBankingPayment: boolean;
  enableCodPayment: boolean;
  enableWalletPayment: boolean;
  minWithdrawalAmount: number;
  payoutSchedule: 'instant' | 'daily' | 'weekly' | 'manual';
  settlementCycleDays: number;
  autoApprovePayoutsBelow: number;
  companyBankAccount?: CompanyBankAccount | null;

  // 6. Orders
  orderAutoCancelUnpaidMinutes: number;
  enableOrderLiveTracking: boolean;
  allowCustomerOrderCancellation: boolean;
  orderCancellationWindowMinutes: number;
  allowCustomerReturns: boolean;
  returnWindowDays: number;
  refundProcessingDays: number;

  // 7. Users & Sellers
  requireCustomerOtpVerification: boolean;
  requireCustomerEmailVerification: boolean;
  requireSellerGst: boolean;
  requireSellerPan: boolean;
  requireSellerBankProof: boolean;
  requireSellerFssai: boolean;
  gstNumber: string;
  defaultGstPercentage: number;
  fssaiLicense: string;
  autoSuspendSellerOnReports: boolean;
  maxReportThreshold: number;

  // 8. Location
  allowedPincodes: string;
  enablePincodeCheck: boolean;
  operationalCities: string[];
  defaultCity: string;
  defaultState: string;
  serviceableAreasLabel: string;
  enableGpsLocation: boolean;
  requirePreciseLocation: boolean;

  // 9. Notifications
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  enableWhatsAppNotifications: boolean;
  smsGatewayProvider: 'Fast2SMS' | 'Twilio' | 'MSG91' | 'Default Gateway';
  notificationSenderEmail: string;
  notifyCustomerOnOrderPlaced: boolean;
  notifyCustomerOnOutForDelivery: boolean;
  notifyCustomerOnDelivered: boolean;
  notifySellerOnNewOrder: boolean;
  notifyDeliveryPartnerOnDispatch: boolean;

  // 10. Security
  enableAdmin2FA: boolean;
  admin2faMethod: 'email_otp' | 'sms_otp' | 'authenticator_app';
  adminSessionTimeoutMinutes: number;
  maxFailedLoginAttempts: number;
  lockoutDurationMinutes: number;
  enableActivityLogging: boolean;
  logRetentionDays: number;
  allowSubAdminProductDelete: boolean;
  allowSubAdminPayoutApproval: boolean;

  // 11. Legal Pages
  termsAndConditionsText: string;
  privacyPolicyText: string;
  refundPolicyText: string;
  cancellationPolicyText: string;
  shippingDeliveryPolicyText: string;
  sellerTermsText: string;

  // 12. System
  maintenanceModeEnabled: boolean;
  maintenanceMessage: string;
  isWebsiteLive: boolean;
  offlineNoticeMessage: string;
  autoBackupEnabled: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly';
  lastBackupTimestamp: string;
  enableDebugLogs: boolean;
  logLevel: 'info' | 'warn' | 'error';
}

export interface CompanyBankAccount {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  accountType?: 'Current' | 'Savings' | 'Overdraft';
  branchName?: string;
  updatedAt?: string;
}

export interface PaymentSettings {
  companyBankAccount: CompanyBankAccount | null;
  enableCod: boolean;
  enableUpi: boolean;
  enableCards: boolean;
  enableNetbanking: boolean;
  merchantName?: string;
  gatewayMode?: 'sandbox' | 'disabled' | 'live';
}

