import fs from 'fs';
import path from 'path';
import {
  Seller,
  Product,
  ProductVideoAd,
  CustomerUser,
  DeliveryPartner,
  WithdrawalRequest,
  SellerCustomerMessage,
  CategoryItem,
  SubCategoryItem,
  Advertisement,
  CityHub,
  WebsiteSettings,
  CompanyBankAccount,
  Brand,
  HeroBanner,
  Order,
  SupportTicket,
} from '../src/types';
import {
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
} from '../src/data/mockData';

export interface HarwalkartDatabase {
  version: number;
  lastUpdated: string;
  products: Product[];
  sellers: Seller[];
  brands: Brand[];
  categories: CategoryItem[];
  heroBanners: HeroBanner[];
  orders: Order[];
  customers: CustomerUser[];
  videoAds: ProductVideoAd[];
  deliveryPartners: DeliveryPartner[];
  withdrawalRequests: WithdrawalRequest[];
  sellerMessages: SellerCustomerMessage[];
  advertisements: Advertisement[];
  cityHubs: CityHub[];
  supportTickets: SupportTicket[];
  websiteSettings: WebsiteSettings;
  companyBankAccount: CompanyBankAccount | null;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'harwalkart_db.json');

const INITIAL_ORDERS: Order[] = [
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
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    estimatedDelivery: 'Today by 6:00 PM',
    trackingSteps: [
      { title: 'Order Placed', description: 'Order received at Harwalkart', timestamp: '23 Aug, 2:30 PM', completed: true, current: false },
      { title: 'Order Confirmed', description: 'Verified by local hub and seller', timestamp: '23 Aug, 2:35 PM', completed: true, current: false },
      { title: 'Preparing / Packed', description: 'Items safely packed & sealed in transparent packaging', timestamp: '23 Aug, 3:15 PM', completed: true, current: false },
      { title: 'Out for Delivery', description: 'Rider Ramesh is on the way with Cash on Delivery collection (₹601)', timestamp: '23 Aug, 4:00 PM', completed: true, current: true },
      { title: 'Delivered & COD Collected', description: 'Handed over with OTP verification', timestamp: 'Pending', completed: false, current: false },
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
];

const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1002',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '9876543210',
    orderId: 'HK-ORD-89421',
    category: 'Delivery query',
    message: 'Namaste Harwalkart, please ensure delivery before 7 PM today.',
    status: 'in_progress',
    createdAt: '2026-08-23 15:00',
    response: 'Our delivery partner is en route and will reach by 5:30 PM. Thank you!',
  },
];

let inMemoryDb: HarwalkartDatabase | null = null;

function getInitialDbState(): HarwalkartDatabase {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    products: INITIAL_PRODUCTS,
    sellers: INITIAL_SELLERS,
    brands: INITIAL_BRANDS,
    categories: INITIAL_CATEGORIES,
    heroBanners: INITIAL_HERO_BANNERS,
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS,
    videoAds: INITIAL_VIDEO_ADS,
    deliveryPartners: INITIAL_DELIVERY_PARTNERS,
    withdrawalRequests: INITIAL_WITHDRAWAL_REQUESTS,
    sellerMessages: INITIAL_SELLER_MESSAGES,
    advertisements: INITIAL_ADVERTISEMENTS,
    cityHubs: INITIAL_CITY_HUBS,
    supportTickets: INITIAL_SUPPORT_TICKETS,
    websiteSettings: INITIAL_WEBSITE_SETTINGS,
    companyBankAccount: null,
  };
}

export function loadDatabase(): HarwalkartDatabase {
  if (inMemoryDb) {
    return inMemoryDb;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.products) && Array.isArray(parsed.sellers)) {
        inMemoryDb = {
          ...getInitialDbState(),
          ...parsed,
          // Ensure arrays are intact
          products: parsed.products || INITIAL_PRODUCTS,
          sellers: parsed.sellers || INITIAL_SELLERS,
          brands: parsed.brands || INITIAL_BRANDS,
          categories: parsed.categories || INITIAL_CATEGORIES,
          heroBanners: parsed.heroBanners || INITIAL_HERO_BANNERS,
          orders: parsed.orders || INITIAL_ORDERS,
          customers: parsed.customers || INITIAL_CUSTOMERS,
        };
        return inMemoryDb!;
      }
    } catch (e) {
      console.error('Error reading database file, resetting to initial state:', e);
    }
  }

  inMemoryDb = getInitialDbState();
  saveDatabase();
  return inMemoryDb;
}

export function saveDatabase(): boolean {
  if (!inMemoryDb) {
    inMemoryDb = getInitialDbState();
  }

  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    inMemoryDb.lastUpdated = new Date().toISOString();
    inMemoryDb.version = (inMemoryDb.version || 0) + 1;

    const data = JSON.stringify(inMemoryDb, null, 2);
    // Write safely
    fs.writeFileSync(DB_FILE, data, 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save Harwalkart central database:', err);
    return false;
  }
}

// ================= PRODUCT REPOSITORY =================

export function getProducts(options?: { approvedOnly?: boolean; sellerId?: string; category?: string; brand?: string }) {
  const db = loadDatabase();
  let list = db.products;

  if (options?.approvedOnly) {
    list = list.filter(p => p.approved && p.inStock);
  }
  if (options?.sellerId) {
    list = list.filter(p => p.sellerId === options.sellerId);
  }
  if (options?.category && options.category !== 'all') {
    list = list.filter(p => p.category === options.category);
  }
  if (options?.brand && options.brand !== 'all') {
    list = list.filter(p => p.brand.toLowerCase() === options.brand!.toLowerCase() || p.brandSlug === options.brand);
  }

  return list;
}

export function getProductById(id: string) {
  const db = loadDatabase();
  return db.products.find(p => p.id === id) || null;
}

export function createProduct(productData: Omit<Product, 'id'> & { id?: string }): Product {
  const db = loadDatabase();
  const id = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newProduct: Product = {
    ...productData,
    id,
    rating: productData.rating || 4.8,
    reviewCount: productData.reviewCount || 1,
    approved: productData.approved !== undefined ? productData.approved : true,
    inStock: productData.inStock !== undefined ? productData.inStock : true,
    discountPercent: productData.mrp > productData.price ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100) : 0,
    images: productData.images && productData.images.length > 0 ? productData.images : [productData.productImage || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'],
  };

  db.products.unshift(newProduct);
  saveDatabase();
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>, requestingSellerId?: string): Product | null {
  const db = loadDatabase();
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const current = db.products[idx];
  // Seller permission check
  if (requestingSellerId && current.sellerId !== requestingSellerId) {
    return null;
  }

  const updatedPrice = updates.price !== undefined ? updates.price : current.price;
  const updatedMrp = updates.mrp !== undefined ? updates.mrp : current.mrp;
  const discountPercent = updatedMrp > updatedPrice ? Math.round(((updatedMrp - updatedPrice) / updatedMrp) * 100) : 0;

  const updated: Product = {
    ...current,
    ...updates,
    discountPercent,
    images: updates.images || (updates.productImage ? [updates.productImage, ...(current.images?.slice(1) || [])] : current.images),
  };

  db.products[idx] = updated;
  saveDatabase();
  return updated;
}

export function deleteProduct(id: string, requestingSellerId?: string): boolean {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === id);
  if (!product) return false;

  if (requestingSellerId && product.sellerId !== requestingSellerId) {
    return false;
  }

  db.products = db.products.filter(p => p.id !== id);
  saveDatabase();
  return true;
}

// ================= HERO BANNER REPOSITORY =================

export function getHeroBanners(activeOnly = false) {
  const db = loadDatabase();
  let list = [...db.heroBanners];
  if (activeOnly) {
    list = list.filter(b => b.isActive);
  }
  return list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
}

export function createHeroBanner(bannerData: Omit<HeroBanner, 'id'>): HeroBanner {
  const db = loadDatabase();
  const newBanner: HeroBanner = {
    ...bannerData,
    id: `banner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: bannerData.createdAt || new Date().toISOString().split('T')[0],
    isActive: bannerData.isActive !== undefined ? bannerData.isActive : true,
    priority: bannerData.priority || db.heroBanners.length + 1,
  };

  db.heroBanners.push(newBanner);
  saveDatabase();
  return newBanner;
}

export function updateHeroBanner(id: string, updates: Partial<HeroBanner>): HeroBanner | null {
  const db = loadDatabase();
  const idx = db.heroBanners.findIndex(b => b.id === id);
  if (idx === -1) return null;

  db.heroBanners[idx] = {
    ...db.heroBanners[idx],
    ...updates,
  };
  saveDatabase();
  return db.heroBanners[idx];
}

export function deleteHeroBanner(id: string): boolean {
  const db = loadDatabase();
  const before = db.heroBanners.length;
  db.heroBanners = db.heroBanners.filter(b => b.id !== id);
  if (db.heroBanners.length !== before) {
    saveDatabase();
    return true;
  }
  return false;
}

// ================= BRANDS REPOSITORY =================

export function getBrands(activeOnly = false) {
  const db = loadDatabase();
  let list = db.brands;
  if (activeOnly) {
    list = list.filter(b => b.isActive);
  }
  return list;
}

export function createBrand(brandData: Omit<Brand, 'id'>): Brand {
  const db = loadDatabase();
  const newBrand: Brand = {
    ...brandData,
    id: `brand_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };
  db.brands.push(newBrand);
  saveDatabase();
  return newBrand;
}

export function updateBrand(id: string, updates: Partial<Brand>): Brand | null {
  const db = loadDatabase();
  const idx = db.brands.findIndex(b => b.id === id);
  if (idx === -1) return null;

  db.brands[idx] = {
    ...db.brands[idx],
    ...updates,
  };
  saveDatabase();
  return db.brands[idx];
}

export function deleteBrand(id: string): boolean {
  const db = loadDatabase();
  const before = db.brands.length;
  db.brands = db.brands.filter(b => b.id !== id);
  if (db.brands.length !== before) {
    saveDatabase();
    return true;
  }
  return false;
}

// ================= CATEGORIES REPOSITORY =================

export function getCategories() {
  const db = loadDatabase();
  return db.categories;
}

export function createCategory(catData: Omit<CategoryItem, 'id'> & { id?: string }): CategoryItem {
  const db = loadDatabase();
  const id = catData.id || `cat_${catData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const newCat: CategoryItem = {
    ...catData,
    id,
  };
  db.categories.push(newCat);
  saveDatabase();
  return newCat;
}

export function updateCategory(id: string, updates: Partial<CategoryItem>): CategoryItem | null {
  const db = loadDatabase();
  const idx = db.categories.findIndex(c => c.id === id);
  if (idx === -1) return null;

  db.categories[idx] = {
    ...db.categories[idx],
    ...updates,
  };
  saveDatabase();
  return db.categories[idx];
}

export function deleteCategory(id: string): boolean {
  const db = loadDatabase();
  const before = db.categories.length;
  db.categories = db.categories.filter(c => c.id !== id);
  if (db.categories.length !== before) {
    saveDatabase();
    return true;
  }
  return false;
}

export function addSubCategory(
  categoryId: string,
  subCatData: Omit<SubCategoryItem, 'id' | 'categoryId'> & { id?: string }
): SubCategoryItem | null {
  const db = loadDatabase();
  const cat = db.categories.find(c => c.id === categoryId);
  if (!cat) return null;

  if (!cat.subCategories) {
    cat.subCategories = [];
  }

  const id = subCatData.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newSubCat: SubCategoryItem = {
    ...subCatData,
    id,
    categoryId,
    categoryName: subCatData.categoryName || cat.name,
    isActive: subCatData.isActive !== undefined ? subCatData.isActive : true,
    displayOrder: subCatData.displayOrder || (cat.subCategories.length + 1),
  };

  cat.subCategories.push(newSubCat);
  saveDatabase();
  return newSubCat;
}

export function updateSubCategory(
  categoryId: string,
  subCatId: string,
  updates: Partial<SubCategoryItem>
): SubCategoryItem | null {
  const db = loadDatabase();
  const cat = db.categories.find(c => c.id === categoryId);
  if (!cat || !cat.subCategories) return null;

  const idx = cat.subCategories.findIndex(s => s.id === subCatId);
  if (idx === -1) return null;

  cat.subCategories[idx] = {
    ...cat.subCategories[idx],
    ...updates,
  };
  saveDatabase();
  return cat.subCategories[idx];
}

export function deleteSubCategory(categoryId: string, subCatId: string): boolean {
  const db = loadDatabase();
  const cat = db.categories.find(c => c.id === categoryId);
  if (!cat || !cat.subCategories) return false;

  const before = cat.subCategories.length;
  cat.subCategories = cat.subCategories.filter(s => s.id !== subCatId);
  if (cat.subCategories.length !== before) {
    saveDatabase();
    return true;
  }
  return false;
}

// ================= ORDERS REPOSITORY =================

export function getOrders(options?: { customerPhone?: string; customerEmail?: string; sellerId?: string }) {
  const db = loadDatabase();
  let list = db.orders;

  if (options?.customerPhone) {
    list = list.filter(o => o.deliveryAddress.mobile === options.customerPhone);
  } else if (options?.customerEmail) {
    // optional email match
  }

  if (options?.sellerId) {
    list = list.filter(o => o.items.some(it => it.sellerId === options.sellerId));
  }

  return list;
}

export function getOrderById(id: string) {
  const db = loadDatabase();
  return db.orders.find(o => o.id === id) || null;
}

export function createOrder(orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingSteps'> & { paymentMethod: string; paymentStatus?: string }): Order {
  const db = loadDatabase();
  const orderId = `HK-ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const isCod = orderData.paymentMethod === 'cod';
  const initialStatus = 'confirmed';
  const paymentStatus = orderData.paymentStatus || (isCod ? 'pending' : 'paid');

  const newOrder: Order = {
    ...orderData,
    id: orderId,
    date: dateStr,
    status: initialStatus,
    paymentStatus: paymentStatus as 'paid' | 'pending',
    trackingSteps: [
      {
        title: 'Order Placed',
        description: isCod ? `Order placed with Cash on Delivery (₹${orderData.total})` : `Order placed & payment verified via ${orderData.paymentMethod.toUpperCase()}`,
        timestamp: 'Just now',
        completed: true,
        current: false,
      },
      {
        title: 'Order Confirmed',
        description: 'Order confirmed by Harwalkart Central Hub and assigned sellers',
        timestamp: 'Just now',
        completed: true,
        current: true,
      },
      {
        title: 'Preparing / Packed',
        description: 'Sellers packaging 100% pure transparent packaging items safely',
        timestamp: 'Pending',
        completed: false,
        current: false,
      },
      {
        title: 'Out for Delivery',
        description: isCod ? `Delivery rider dispatched. Please keep ₹${orderData.total} cash ready.` : 'Delivery rider dispatched for contactless delivery.',
        timestamp: 'Pending',
        completed: false,
        current: false,
      },
      {
        title: isCod ? 'Delivered & COD Collected' : 'Delivered Successfully',
        description: isCod ? 'Handed over and Cash on Delivery collected.' : 'Handed over to customer safely.',
        timestamp: 'Pending',
        completed: false,
        current: false,
      },
    ],
  };

  db.orders.unshift(newOrder);

  // Update seller wallet / order stats
  newOrder.items.forEach(item => {
    const seller = db.sellers.find(s => s.id === item.sellerId);
    if (seller) {
      seller.totalEarnings = (seller.totalEarnings || 0) + (item.netSellerAmount || item.price * item.quantity * 0.98);
      seller.walletBalance = (seller.walletBalance || 0) + (item.netSellerAmount || item.price * item.quantity * 0.98);
    }
  });

  saveDatabase();
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status'], details?: { riderName?: string; riderPhone?: string; note?: string }): Order | null {
  const db = loadDatabase();
  const idx = db.orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;

  const order = db.orders[idx];
  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const isCod = order.paymentMethod === 'cod';

  const updatedSteps = (order.trackingSteps || []).map(step => {
    if (status === 'confirmed') {
      if (step.title.includes('Placed') || step.title.includes('Confirmed')) return { ...step, completed: true, current: step.title.includes('Confirmed') };
      return { ...step, completed: false, current: false };
    }
    if (status === 'preparing') {
      if (step.title.includes('Placed') || step.title.includes('Confirmed') || step.title.includes('Preparing')) return { ...step, completed: true, current: step.title.includes('Preparing') };
      return { ...step, completed: false, current: false };
    }
    if (status === 'out_for_delivery') {
      if (step.title.includes('Delivered')) return { ...step, completed: false, current: false };
      if (step.title.includes('Out for Delivery')) return { ...step, completed: true, current: true, timestamp: `Today, ${timeStr}` };
      return { ...step, completed: true, current: false };
    }
    if (status === 'delivered') {
      return { ...step, completed: true, current: step.title.includes('Delivered'), timestamp: step.title.includes('Delivered') ? `Delivered at ${timeStr}` : step.timestamp };
    }
    return step;
  });

  let paymentStatus = order.paymentStatus;
  if (status === 'delivered' && isCod) {
    paymentStatus = 'paid'; // COD collected upon delivery!
  } else if (status === 'cancelled') {
    paymentStatus = isCod ? 'cancelled' as any : 'refunded';
  }

  const updatedOrder: Order = {
    ...order,
    status,
    paymentStatus,
    trackingSteps: updatedSteps,
  };

  db.orders[idx] = updatedOrder;
  saveDatabase();
  return updatedOrder;
}

export function deleteOrder(id: string): boolean {
  const db = loadDatabase();
  const before = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== id);
  if (db.orders.length !== before) {
    saveDatabase();
    return true;
  }
  return false;
}

// ================= SELLERS REPOSITORY =================

export function getSellers() {
  const db = loadDatabase();
  return db.sellers;
}

export function getSellerById(id: string) {
  const db = loadDatabase();
  return db.sellers.find(s => s.id === id) || null;
}

export function updateSeller(id: string, updates: Partial<Seller>): Seller | null {
  const db = loadDatabase();
  const idx = db.sellers.findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.sellers[idx] = {
    ...db.sellers[idx],
    ...updates,
  };
  saveDatabase();
  return db.sellers[idx];
}

export function approveSeller(id: string): Seller | null {
  const db = loadDatabase();
  const idx = db.sellers.findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.sellers[idx].status = 'approved';
  db.sellers[idx].kycStatus = 'approved';
  db.sellers[idx].verified = true;
  saveDatabase();
  return db.sellers[idx];
}

export function rejectSeller(id: string, reason: string): Seller | null {
  const db = loadDatabase();
  const idx = db.sellers.findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.sellers[idx].status = 'rejected';
  db.sellers[idx].kycStatus = 'rejected';
  db.sellers[idx].rejectionReason = reason;
  saveDatabase();
  return db.sellers[idx];
}
