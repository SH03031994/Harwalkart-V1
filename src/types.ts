export type Role = 'customer' | 'seller' | 'admin';

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

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
  docType: 'Aadhaar Card' | 'PAN Card' | 'GST Certificate' | 'Shop Act License' | 'FSSAI Registration';
  docNumber: string;
  fileName?: string;
  verified: boolean;
  uploadedAt: string;
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
  isHarwalkartDirect: boolean;
  isGstRegistered: boolean;
  gstin?: string;
  panNumber?: string;
  businessInfo?: string;
  status: SellerStatus;
  rejectionReason?: string;
  kycDoc?: SellerKycDoc;
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

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  slug: string;
  brand: string;
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
  description: string;
  ingredients?: string[];
  benefits?: string[];
  fssaiNumber?: string;
  serviceablePincodes: string[]; // empty or ['*'] means PAN-India
  approved: boolean;
  featured?: boolean;
  isBestSeller?: boolean;
  tags: string[];
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
  brandName: string;
  tagline: string;
  flagshipBrand: string;
  flagshipTagline: string;
  helplinePhone: string;
  supportEmail: string;
  officialAddress: string;
  defaultCommissionRate: number; // e.g. 2.5
  minWithdrawalAmount: number; // e.g. 500
  freeDeliveryThreshold: number; // e.g. 499
  standardDeliveryFee: number; // e.g. 40
  gstNumber: string;
  fssaiLicense: string;
  enableGpsLocation: boolean;
  enableDirectKitchenShakti: boolean;
  announcementBannerText: string;
  isAnnouncementActive: boolean;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}

