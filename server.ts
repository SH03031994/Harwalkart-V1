import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

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
  res.json({ success: true, message: `Seller ${sellerId} approved by server authority.` });
});

app.post('/api/admin/reject-seller', requireAdminAuth, (req, res) => {
  const { sellerId, reason } = req.body;
  res.json({ success: true, message: `Seller ${sellerId} rejected by server authority. Reason: ${reason}` });
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
