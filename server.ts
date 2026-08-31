import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import {
  loadDatabase,
  saveDatabase,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getSellers,
  getSellerById,
  updateSeller,
  approveSeller,
  rejectSeller,
} from './server/db';

const app = express();
const PORT = 3000;

// Initialize database on startup
loadDatabase();

// Set payload limits for robust image upload support (up to 25MB)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Persistent Storage Directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images statically with persistent caching
app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));

// List of authorized administrator emails
const AUTHORIZED_ADMIN_EMAILS = [
  'admin@harwalkart.com',
  'harwalkart@gmail.com',
  'jaishreeramenterprises24@gmail.com',
];

// In-memory / server-authoritative token registry for admin sessions
const activeAdminTokens = new Set<string>();

// Generate secure session token
function generateAdminToken(email: string): string {
  const token = `hk_admin_sec_${Buffer.from(email).toString('hex')}_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  activeAdminTokens.add(token);
  return token;
}

// Server-side admin verification middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Administrative access token required.' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired administrative session.' });
  }

  next();
}

// ================= API ROUTES =================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'HARWALKART Marketplace API', timestamp: new Date().toISOString() });
});

// ================= CENTRAL DATABASE FULL SYNC ENDPOINT =================
// Single source of truth for Admin, Seller, and Customer panels
app.get('/api/sync/full', (req, res) => {
  const db = loadDatabase();
  res.json({
    success: true,
    version: db.version,
    lastUpdated: db.lastUpdated,
    data: {
      products: db.products,
      sellers: db.sellers,
      brands: db.brands,
      categories: db.categories,
      heroBanners: db.heroBanners,
      orders: db.orders,
      customers: db.customers,
      videoAds: db.videoAds,
      deliveryPartners: db.deliveryPartners,
      withdrawalRequests: db.withdrawalRequests,
      sellerMessages: db.sellerMessages,
      advertisements: db.advertisements,
      cityHubs: db.cityHubs,
      supportTickets: db.supportTickets,
      websiteSettings: db.websiteSettings,
      companyBankAccount: db.companyBankAccount,
    },
  });
});

// ================= PRODUCTS CRUD API =================

// GET products (with query filter support)
app.get('/api/products', (req, res) => {
  const { approvedOnly, sellerId, category, brand } = req.query;
  const products = getProducts({
    approvedOnly: approvedOnly === 'true',
    sellerId: sellerId as string,
    category: category as string,
    brand: brand as string,
  });
  res.json({ success: true, count: products.length, products });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  res.json({ success: true, product });
});

// POST add product (Admin or Seller)
app.post('/api/products', (req, res) => {
  try {
    const productData = req.body;
    if (!productData.name || !productData.price) {
      return res.status(400).json({ success: false, error: 'Product name and price are required.' });
    }
    const newProduct = createProduct(productData);
    res.json({ success: true, message: 'Product created in central database.', product: newProduct });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update product (Admin or Seller)
app.put('/api/products/:id', (req, res) => {
  try {
    const { requestingSellerId, ...updates } = req.body;
    const updated = updateProduct(req.params.id, updates, requestingSellerId);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found or permission denied.' });
    }
    res.json({ success: true, message: 'Product updated in central database.', product: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const requestingSellerId = req.query.sellerId as string;
    const success = deleteProduct(req.params.id, requestingSellerId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Product not found or unauthorized.' });
    }
    res.json({ success: true, message: 'Product removed from central database.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= HERO BANNERS CRUD API =================

app.get('/api/banners', (req, res) => {
  const activeOnly = req.query.activeOnly === 'true';
  const banners = getHeroBanners(activeOnly);
  res.json({ success: true, count: banners.length, banners });
});

app.post('/api/banners', (req, res) => {
  try {
    const newBanner = createHeroBanner(req.body);
    res.json({ success: true, message: 'Banner saved to central database.', banner: newBanner });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/banners/:id', (req, res) => {
  try {
    const updated = updateHeroBanner(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Banner not found.' });
    }
    res.json({ success: true, message: 'Banner updated in central database.', banner: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/banners/:id', (req, res) => {
  try {
    const success = deleteHeroBanner(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Banner not found.' });
    }
    res.json({ success: true, message: 'Banner removed from central database.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= BRANDS CRUD API =================

app.get('/api/brands', (req, res) => {
  const activeOnly = req.query.activeOnly === 'true';
  const brands = getBrands(activeOnly);
  res.json({ success: true, count: brands.length, brands });
});

app.post('/api/brands', (req, res) => {
  try {
    const newBrand = createBrand(req.body);
    res.json({ success: true, message: 'Brand added to central database.', brand: newBrand });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/brands/:id', (req, res) => {
  try {
    const updated = updateBrand(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Brand not found.' });
    }
    res.json({ success: true, message: 'Brand updated in central database.', brand: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/brands/:id', (req, res) => {
  try {
    const success = deleteBrand(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Brand not found.' });
    }
    res.json({ success: true, message: 'Brand removed from central database.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= CATEGORIES CRUD API =================

app.get('/api/categories', (req, res) => {
  const categories = getCategories();
  res.json({ success: true, count: categories.length, categories });
});

app.post('/api/categories', (req, res) => {
  try {
    const newCat = createCategory(req.body);
    res.json({ success: true, message: 'Category added to central database.', category: newCat });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const updated = updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category updated in central database.', category: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const success = deleteCategory(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Category not found.' });
    }
    res.json({ success: true, message: 'Category removed from central database.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= SUBCATEGORIES CRUD API =================

app.post('/api/categories/:categoryId/subcategories', (req, res) => {
  try {
    const newSub = addSubCategory(req.params.categoryId, req.body);
    if (!newSub) {
      return res.status(404).json({ success: false, error: 'Category not found to add subcategory.' });
    }
    res.json({ success: true, message: 'Sub-category added to central database.', subCategory: newSub });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/categories/:categoryId/subcategories/:subCatId', (req, res) => {
  try {
    const updated = updateSubCategory(req.params.categoryId, req.params.subCatId, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Sub-category not found.' });
    }
    res.json({ success: true, message: 'Sub-category updated in central database.', subCategory: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/categories/:categoryId/subcategories/:subCatId', (req, res) => {
  try {
    const success = deleteSubCategory(req.params.categoryId, req.params.subCatId);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Sub-category not found to delete.' });
    }
    res.json({ success: true, message: 'Sub-category removed from central database.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= ORDERS CRUD API (WITH COD & REAL-TIME SYNC) =================

app.get('/api/orders', (req, res) => {
  const { customerPhone, customerEmail, sellerId } = req.query;
  const orders = getOrders({
    customerPhone: customerPhone as string,
    customerEmail: customerEmail as string,
    sellerId: sellerId as string,
  });
  res.json({ success: true, count: orders.length, orders });
});

app.get('/api/orders/:id', (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found.' });
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = createOrder(req.body);
    res.json({ success: true, message: 'Order created and dispatched to sellers/admin.', order: newOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  try {
    const { status, riderName, riderPhone, note } = req.body;
    const updated = updateOrderStatus(req.params.id, status, { riderName, riderPhone, note });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order status updated across all panels.', order: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const success = deleteOrder(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Order not found.' });
    }
    res.json({ success: true, message: 'Order deleted.' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ================= SELLERS API =================

app.get('/api/sellers', (req, res) => {
  const sellers = getSellers();
  res.json({ success: true, count: sellers.length, sellers });
});

app.get('/api/sellers/:id', (req, res) => {
  const seller = getSellerById(req.params.id);
  if (!seller) {
    return res.status(404).json({ success: false, error: 'Seller not found.' });
  }
  res.json({ success: true, seller });
});

app.put('/api/sellers/:id', (req, res) => {
  try {
    const updated = updateSeller(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Seller not found.' });
    }
    res.json({ success: true, message: 'Seller updated in central database.', seller: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Authentication Endpoint (Server-Side)
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  const isAuthorizedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
  const isMasterPassword = cleanPass === 'Harwal@Admin2026' || cleanPass === 'admin123' || cleanPass === 'AdminHarwal@2025';

  if (isAuthorizedAdmin && isMasterPassword) {
    const token = generateAdminToken(cleanEmail);
    return res.json({
      success: true,
      token,
      admin: {
        id: 'admin_master_1',
        name: 'Harwalkart Central Admin',
        email: cleanEmail,
        role: 'admin',
      },
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Access Denied: Unrecognized administrator credentials or unauthorized email.',
  });
});

// Admin Session Verification
app.get('/api/auth/verify-admin', requireAdminAuth, (req, res) => {
  res.json({ success: true, authorized: true, role: 'admin' });
});

// Admin Protected Actions (e.g. approve seller, process payout)
app.post('/api/admin/approve-seller', requireAdminAuth, (req, res) => {
  const { sellerId } = req.body;
  const seller = approveSeller(sellerId);
  res.json({ success: true, message: `Seller ${sellerId} approved by server authority.`, seller });
});

app.post('/api/admin/reject-seller', requireAdminAuth, (req, res) => {
  const { sellerId, reason } = req.body;
  const seller = rejectSeller(sellerId, reason || 'KYC verification failed');
  res.json({ success: true, message: `Seller ${sellerId} rejected by server authority.`, seller });
});

// Company Bank Account Endpoints (Admin Only)
app.get('/api/admin/company-bank-account', requireAdminAuth, (req, res) => {
  const db = loadDatabase();
  res.json({
    success: true,
    account: db.companyBankAccount,
  });
});

app.post('/api/admin/company-bank-account', requireAdminAuth, (req, res) => {
  const { accountHolderName, bankName, accountNumber, ifscCode, upiId, accountType, branchName } = req.body;

  if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
    return res.status(400).json({
      success: false,
      error: 'Account holder name, bank name, account number, and IFSC code are required.',
    });
  }

  const db = loadDatabase();
  const acc = {
    accountHolderName: accountHolderName.trim(),
    bankName: bankName.trim(),
    accountNumber: accountNumber.trim(),
    ifscCode: ifscCode.trim().toUpperCase(),
    upiId: upiId ? upiId.trim() : undefined,
    accountType: accountType || 'Current',
    branchName: branchName ? branchName.trim() : undefined,
    updatedAt: new Date().toISOString(),
  };

  db.companyBankAccount = acc as any;
  saveDatabase();

  res.json({
    success: true,
    message: 'Company bank account saved successfully.',
    account: acc,
  });
});

app.delete('/api/admin/company-bank-account', requireAdminAuth, (req, res) => {
  const db = loadDatabase();
  db.companyBankAccount = null;
  saveDatabase();
  res.json({
    success: true,
    message: 'Company bank account removed.',
  });
});

let serverActivityLogs: Array<{ id: string; timestamp: string; action: string; user: string; ip: string; status: 'SUCCESS' | 'WARNING' | 'ERROR' }> = [
  { id: 'log_1', timestamp: new Date(Date.now() - 3600000).toISOString(), action: 'Admin logged in to dashboard', user: 'admin@harwalkart.com', ip: '127.0.0.1', status: 'SUCCESS' },
  { id: 'log_2', timestamp: new Date(Date.now() - 1800000).toISOString(), action: 'Website settings synchronized', user: 'Super Admin', ip: '127.0.0.1', status: 'SUCCESS' },
  { id: 'log_3', timestamp: new Date(Date.now() - 900000).toISOString(), action: 'Company Bank Account verified', user: 'Finance Admin', ip: '127.0.0.1', status: 'SUCCESS' },
];

// Public Website Settings endpoint
app.get('/api/settings', (req, res) => {
  const db = loadDatabase();
  res.json({
    success: true,
    settings: db.websiteSettings,
  });
});

// Admin Website Settings endpoints
app.get('/api/admin/settings', requireAdminAuth, (req, res) => {
  const db = loadDatabase();
  res.json({
    success: true,
    settings: db.websiteSettings,
  });
});

app.post('/api/admin/settings', requireAdminAuth, (req, res) => {
  const updates = req.body;
  const db = loadDatabase();
  db.websiteSettings = {
    ...db.websiteSettings,
    ...updates,
  };
  saveDatabase();

  serverActivityLogs.unshift({
    id: `log_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'Platform settings updated and saved to server',
    user: 'Super Admin',
    ip: req.ip || '127.0.0.1',
    status: 'SUCCESS',
  });

  if (serverActivityLogs.length > 50) {
    serverActivityLogs = serverActivityLogs.slice(0, 50);
  }

  res.json({
    success: true,
    message: 'Website settings saved and updated successfully.',
    settings: db.websiteSettings,
  });
});

// Admin System Activity Logs
app.get('/api/admin/activity-logs', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    logs: serverActivityLogs,
  });
});

app.post('/api/admin/clear-logs', requireAdminAuth, (req, res) => {
  serverActivityLogs = [
    {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'Activity logs purged by Super Admin',
      user: 'Super Admin',
      ip: req.ip || '127.0.0.1',
      status: 'WARNING',
    },
  ];
  res.json({ success: true, message: 'Logs cleared successfully.' });
});

// ================= IMAGE UPLOAD & PERSISTENT STORAGE API =================

// Allowed Image MIME types
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

app.post('/api/upload/image', (req, res) => {
  try {
    const { image, fileName, fileType, role, sellerId, imageType, folder } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No image data provided. Please select an image file.',
      });
    }

    // Role-based authorization for banners
    if ((imageType === 'banner' || folder === 'banners') && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Storage permission denied: Only Admin can upload Hero Banners.',
      });
    }

    // Parse data URL or raw Base64
    let mimeType = fileType || '';
    let base64Data = image;

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([a-zA-Z0-9/+-]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1].toLowerCase();
        base64Data = match[2];
      }
    }

    // Validate MIME type
    if (!mimeType || !ALLOWED_IMAGE_MIMES.includes(mimeType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'File type not supported. Supported formats: JPG, JPEG, PNG, WEBP.',
      });
    }

    // Convert Base64 to Buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Validate file size (max 10MB)
    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        error: `File size is too large (${(buffer.length / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`,
      });
    }

    // Determine extension
    let ext = 'jpg';
    if (mimeType.includes('png')) ext = 'png';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';

    // Generate unique sanitized filename
    const prefix = imageType === 'banner' ? 'banner' : imageType === 'packaging' ? 'pkg' : 'prod';
    const uniqueId = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const safeName = `hk_${prefix}_${uniqueId}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    // Save permanently to storage
    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${safeName}`;
    const storageRef = `uploads/${safeName}`;

    return res.json({
      success: true,
      url: relativeUrl,
      storageRef: storageRef,
      fileName: fileName || safeName,
      fileSize: buffer.length,
      mimeType: mimeType,
      uploadedAt: new Date().toISOString(),
      message: 'Image uploaded successfully to persistent storage.',
    });
  } catch (error: any) {
    console.error('Image upload server error:', error);
    return res.status(500).json({
      success: false,
      error: `Image upload failed: ${error.message || 'Internal storage server error.'}`,
    });
  }
});

// Delete Image from Storage
app.delete('/api/upload/image', (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, error: 'Image URL is required for deletion.' });
    }

    const filename = path.basename(url);
    const filePath = path.join(uploadsDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ success: true, message: 'Image deleted from persistent storage.' });
    } else {
      return res.json({ success: true, message: 'Image record cleared.' });
    }
  } catch (error: any) {
    console.error('Delete image error:', error);
    return res.status(500).json({ success: false, error: `Failed to delete image: ${error.message}` });
  }
});

// List Uploaded Assets (for Admin auditing)
app.get('/api/uploads/list', requireAdminAuth, (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const list = files.map(file => {
      const stat = fs.statSync(path.join(uploadsDir, file));
      return {
        name: file,
        url: `/uploads/${file}`,
        size: stat.size,
        createdAt: stat.birthtime,
      };
    });
    res.json({ success: true, count: list.length, files: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HARWALKART server running on port ${PORT}`);
  });
}

startServer();
