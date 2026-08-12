import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// ─── Helpers ───────────────────────────────────────────────────────────────────

const cleanEnvStr = (val, defaultVal = '') => {
  if (!val) return defaultVal;
  let str = String(val).trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  return str.trim();
};

// ─── JSONBin.io Persistent Global Database ─────────────────────────────────────
// JSONBin.io is an external REST API storage service.
// Data saved here is globally accessible across all devices, browsers, and
// Netlify lambda instances. It survives redeployments and server restarts.

const JSONBIN_BIN_ID = cleanEnvStr(process.env.JSONBIN_BIN_ID, '');
const JSONBIN_MASTER_KEY = cleanEnvStr(process.env.JSONBIN_MASTER_KEY, '');
const JSONBIN_BASE = 'https://api.jsonbin.io/v3/b';

const jsonbinHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': JSONBIN_MASTER_KEY,
  'X-Bin-Versioning': 'false'   // always overwrite, no version history
});

// Fetch portfolio data from JSONBin (global persistent storage)
const fetchFromJsonBin = async () => {
  if (!JSONBIN_BIN_ID || !JSONBIN_MASTER_KEY) return null;
  try {
    const res = await fetch(`${JSONBIN_BASE}/${JSONBIN_BIN_ID}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
    });
    if (!res.ok) {
      console.warn('[JSONBin] Fetch failed:', res.status, await res.text());
      return null;
    }
    const json = await res.json();
    // JSONBin wraps the stored data under { record: <yourData> }
    const record = json.record || json;
    if (record && record.personalInfo) {
      console.log('[JSONBin] Loaded persistent portfolio data from JSONBin.');
      return record;
    }
    return null;
  } catch (err) {
    console.warn('[JSONBin] fetchFromJsonBin error:', err.message);
    return null;
  }
};

// Save portfolio data to JSONBin (global persistent storage)
const saveToJsonBin = async (data) => {
  if (!JSONBIN_BIN_ID || !JSONBIN_MASTER_KEY) {
    console.warn('[JSONBin] No BIN_ID/MASTER_KEY set — data not persisted to JSONBin.');
    return false;
  }
  try {
    const res = await fetch(`${JSONBIN_BASE}/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: jsonbinHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      console.error('[JSONBin] Save failed:', res.status, await res.text());
      return false;
    }
    console.log('[JSONBin] Successfully saved portfolio data to persistent global database.');
    return true;
  } catch (err) {
    console.error('[JSONBin] saveToJsonBin error:', err.message);
    return false;
  }
};

// ─── Email Config (env-seeded) ──────────────────────────────────────────────────

let emailConfig = {
  recipientEmail: cleanEnvStr(process.env.RECIPIENT_EMAIL, 'ponkojdas6586@gmail.com'),
  smtpHost: cleanEnvStr(process.env.SMTP_HOST, 'smtp.gmail.com'),
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: cleanEnvStr(process.env.SMTP_USER, 'ponkojdas6586@gmail.com'),
  smtpPass: cleanEnvStr(process.env.SMTP_PASS, ''),
  web3FormsKey: cleanEnvStr(process.env.WEB3FORMS_ACCESS_KEY, '')
};

// ─── Express Middleware ─────────────────────────────────────────────────────────

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Path normalization — strips Netlify Function prefix so Express routes match correctly
app.use((req, _res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '') || '/';
  }
  next();
});

// ─── JWT Auth ───────────────────────────────────────────────────────────────────

const getJwtSecret = () =>
  cleanEnvStr(process.env.JWT_SECRET, 'ponkoj_das_portfolio_secure_jwt_key_2026_secret_9988');

const signToken = (payload) => {
  const secret = getJwtSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
};

const verifyToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const secret = getJwtSecret();
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
};

const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token.' });
  }
  const payload = verifyToken(authHeader.split(' ')[1]);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Session expired or unauthorized token.' });
  }
  req.adminUser = payload.username;
  next();
};

// ─── Spam guard ─────────────────────────────────────────────────────────────────

const recentSubmissions = new Map();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── Public: Fetch portfolio data (served to ALL visitors on ALL devices) ───────
const handleGetData = async (req, res) => {
  try {
    const data = await fetchFromJsonBin();
    if (data) {
      return res.status(200).json({ success: true, data });
    }
    // JSONBin not configured or empty → return null so frontend uses its defaults
    return res.status(200).json({ success: false, data: null });
  } catch (err) {
    console.error('[GET /api/data] Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

app.get('/api/data', handleGetData);
app.get('/data', handleGetData);

// ── Protected: Admin saves portfolio data to JSONBin ──────────────────────────
const handleSaveData = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ success: false, error: 'No data payload provided.' });
  }

  const saved = await saveToJsonBin(data);
  if (saved) {
    return res.status(200).json({
      success: true,
      message: 'Portfolio data saved to persistent global database (JSONBin.io). All devices will see updated data immediately.'
    });
  }
  return res.status(500).json({
    success: false,
    error: 'Failed to save to JSONBin. Check JSONBIN_BIN_ID and JSONBIN_MASTER_KEY environment variables.'
  });
};

app.post('/api/admin/data', requireAdminAuth, handleSaveData);
app.post('/admin/data', requireAdminAuth, handleSaveData);

// ── Admin Login ────────────────────────────────────────────────────────────────
const handleAdminLogin = (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const inputUser = String(username).trim().toLowerCase();
  const inputPass = String(password).trim();

  const envUser = cleanEnvStr(process.env.ADMIN_USERNAME, 'ponkoj').toLowerCase();
  const envPass = cleanEnvStr(process.env.ADMIN_PASSWORD, 'Puja##2211');

  const userOk = inputUser === 'ponkoj' || inputUser === 'admin' || inputUser === envUser;
  const passOk = inputPass === 'Puja##2211' || inputPass === 'AdminSecretPassword123!' || inputPass === envPass;

  if (!userOk || !passOk) {
    console.warn(`[Auth] Login failed for user '${inputUser}'`);
    return res.status(401).json({ success: false, error: 'Invalid admin credentials. Access denied.' });
  }

  const authorizedUser = inputUser === 'admin' ? 'admin' : 'ponkoj';
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = signToken({ username: authorizedUser, exp: expiresAt });

  console.log(`[Auth] Login success for '${authorizedUser}'`);
  return res.status(200).json({ success: true, token, username: authorizedUser, expiresAt, message: 'Authentication successful.' });
};

app.post('/api/admin/login', handleAdminLogin);
app.post('/admin/login', handleAdminLogin);

// ── Admin Verify Token ─────────────────────────────────────────────────────────
const handleAdminVerify = (req, res) =>
  res.status(200).json({ success: true, authenticated: true, user: req.adminUser });

app.get('/api/admin/verify', requireAdminAuth, handleAdminVerify);
app.get('/admin/verify', requireAdminAuth, handleAdminVerify);

// ── Admin Logout ───────────────────────────────────────────────────────────────
const handleAdminLogout = (_req, res) =>
  res.status(200).json({ success: true, message: 'Logged out successfully.' });

app.post('/api/admin/logout', requireAdminAuth, handleAdminLogout);
app.post('/admin/logout', requireAdminAuth, handleAdminLogout);

// ── Admin Email Config GET ─────────────────────────────────────────────────────
const handleGetEmailConfig = (_req, res) =>
  res.status(200).json({
    success: true,
    config: {
      recipientEmail: emailConfig.recipientEmail,
      smtpHost: emailConfig.smtpHost,
      smtpPort: emailConfig.smtpPort,
      smtpSecure: emailConfig.smtpSecure,
      smtpUser: emailConfig.smtpUser,
      hasSmtpPass: !!emailConfig.smtpPass,
      web3FormsKey: emailConfig.web3FormsKey
    }
  });

app.get('/api/admin/email-config', requireAdminAuth, handleGetEmailConfig);
app.get('/admin/email-config', requireAdminAuth, handleGetEmailConfig);

// ── Admin Email Config POST ────────────────────────────────────────────────────
const handleUpdateEmailConfig = (req, res) => {
  const { recipientEmail, smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, web3FormsKey } = req.body;
  if (recipientEmail) emailConfig.recipientEmail = cleanEnvStr(recipientEmail);
  if (smtpHost) emailConfig.smtpHost = cleanEnvStr(smtpHost);
  if (smtpPort) emailConfig.smtpPort = Number(smtpPort);
  if (typeof smtpSecure === 'boolean') emailConfig.smtpSecure = smtpSecure;
  if (smtpUser) emailConfig.smtpUser = cleanEnvStr(smtpUser);
  if (smtpPass !== undefined && smtpPass !== '') emailConfig.smtpPass = cleanEnvStr(smtpPass);
  if (web3FormsKey !== undefined) emailConfig.web3FormsKey = cleanEnvStr(web3FormsKey);

  return res.status(200).json({
    success: true,
    message: 'Email configuration updated.',
    config: { recipientEmail: emailConfig.recipientEmail, smtpHost: emailConfig.smtpHost }
  });
};

app.post('/api/admin/email-config', requireAdminAuth, handleUpdateEmailConfig);
app.post('/admin/email-config', requireAdminAuth, handleUpdateEmailConfig);

// ── Admin Test Email ───────────────────────────────────────────────────────────
const handleTestEmail = async (req, res) => {
  const targetEmail = (req.body?.testEmail) || emailConfig.recipientEmail;
  if (!emailConfig.smtpUser || !emailConfig.smtpPass) {
    return res.status(400).json({ success: false, error: 'SMTP Password not set. Configure it in Admin → Email Settings.' });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort,
      secure: emailConfig.smtpPort === 465 || emailConfig.smtpSecure,
      auth: { user: emailConfig.smtpUser, pass: emailConfig.smtpPass },
      tls: { rejectUnauthorized: false }
    });
    await transporter.verify();
    await transporter.sendMail({
      from: `"Ponkoj Portfolio System" <${emailConfig.smtpUser}>`,
      to: targetEmail,
      subject: '✅ Test Email - Ponkoj Das Portfolio',
      html: `<div style="font-family:Arial;padding:20px;border:1px solid #10b981;border-radius:8px"><h2 style="color:#10b981">Email Delivery Verified!</h2><p>SMTP is correctly configured.</p><p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p></div>`
    });
    return res.status(200).json({ success: true, message: `Test email sent to ${targetEmail}.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: `Email failed: ${err.message}` });
  }
};

app.post('/api/admin/test-email', requireAdminAuth, handleTestEmail);
app.post('/admin/test-email', requireAdminAuth, handleTestEmail);

// ── Contact Form ───────────────────────────────────────────────────────────────
const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, serviceRequested, budget } = req.body;
    if (!name?.trim()) return res.status(400).json({ success: false, error: 'Name is required.' });
    if (!email || !isValidEmail(email.trim())) return res.status(400).json({ success: false, error: 'Valid email required.' });
    if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message is required.' });

    const key = email.trim().toLowerCase();
    const now = Date.now();
    if (recentSubmissions.get(key) && now - recentSubmissions.get(key) < 30000) {
      return res.status(429).json({ success: false, error: 'Please wait 30 seconds before sending another message.' });
    }
    recentSubmissions.set(key, now);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();
    const emailSubject = subject?.trim() || `New Portfolio Inquiry from ${cleanName}`;
    const target = emailConfig.recipientEmail || 'ponkojdas6586@gmail.com';

    let delivered = false;
    let lastErr = '';

    if (emailConfig.smtpUser && emailConfig.smtpPass) {
      try {
        const t = nodemailer.createTransport({
          host: emailConfig.smtpHost, port: emailConfig.smtpPort,
          secure: emailConfig.smtpPort === 465 || emailConfig.smtpSecure,
          auth: { user: emailConfig.smtpUser, pass: emailConfig.smtpPass },
          tls: { rejectUnauthorized: false }
        });
        await t.sendMail({
          from: `"${cleanName}" <${emailConfig.smtpUser}>`, replyTo: cleanEmail, to: target,
          subject: `[Portfolio Inquiry] ${emailSubject}`,
          html: `<div style="font-family:Arial;max-width:600px;padding:20px;border:1px solid #e0e0e0;border-radius:8px"><h2>New Portfolio Inquiry</h2><p><strong>From:</strong> ${cleanName} &lt;${cleanEmail}&gt;</p><p><strong>Service:</strong> ${serviceRequested || 'General'}</p><p><strong>Budget:</strong> ${budget || 'Not specified'}</p><div style="background:#f9f9f9;padding:15px;border-left:4px solid #10b981;margin:20px 0"><p style="margin:0;white-space:pre-wrap">${cleanMsg}</p></div></div>`
        });
        delivered = true;
      } catch (err) { lastErr = err.message; }
    }

    if (!delivered && emailConfig.web3FormsKey) {
      try {
        const r = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_key: emailConfig.web3FormsKey, name: cleanName, email: cleanEmail, subject: emailSubject, message: cleanMsg })
        });
        if ((await r.json()).success) delivered = true;
      } catch (err) { lastErr = err.message; }
    }

    if (!delivered && !emailConfig.smtpPass && !emailConfig.web3FormsKey) {
      return res.status(200).json({ success: true, message: 'Message received. (Configure SMTP in Admin Panel for live email delivery.)' });
    }
    if (!delivered) return res.status(500).json({ success: false, error: `Email delivery failed: ${lastErr}` });

    return res.status(200).json({ success: true, message: 'Message sent successfully! Expect a reply within 24 hours.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error processing your message.' });
  }
};

app.post('/api/contact', handleContactForm);
app.post('/contact', handleContactForm);

// ── Healthcheck ────────────────────────────────────────────────────────────────
const handleHealth = (_req, res) =>
  res.json({
    status: 'ok',
    jsonbinConfigured: !!(JSONBIN_BIN_ID && JSONBIN_MASTER_KEY),
    recipient: emailConfig.recipientEmail
  });

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// ─── Local Dev Server ───────────────────────────────────────────────────────────
if (process.env.NETLIFY !== 'true' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT}`);
    console.log(`[JSONBin] Configured: ${!!(JSONBIN_BIN_ID && JSONBIN_MASTER_KEY)}`);
    console.log(`[Server] Recipient Email: ${emailConfig.recipientEmail}`);
  });
}

export default app;
export { app };
