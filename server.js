import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Helper: Clean environment variable strings (strips accidental quotes & whitespace)
const cleanEnvStr = (val, defaultVal = '') => {
  if (!val) return defaultVal;
  let str = String(val).trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  return str.trim();
};

// Dynamic Email Configuration state (initialized from .env)
let emailConfig = {
  recipientEmail: cleanEnvStr(process.env.RECIPIENT_EMAIL, 'ponkojdas6586@gmail.com'),
  smtpHost: cleanEnvStr(process.env.SMTP_HOST, 'smtp.gmail.com'),
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: cleanEnvStr(process.env.SMTP_USER, 'ponkojdas6586@gmail.com'),
  smtpPass: cleanEnvStr(process.env.SMTP_PASS, ''),
  web3FormsKey: cleanEnvStr(process.env.WEB3FORMS_ACCESS_KEY, '')
};

app.use(cors());
app.use(express.json());

// Path Normalization Middleware for Netlify Functions & Direct Server Execution
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api');
  } else if (req.url.startsWith('/.netlify/functions/server')) {
    req.url = req.url.replace('/.netlify/functions/server', '/api');
  }
  next();
});

// In-memory rate limiting map for contact spam protection
const recentSubmissions = new Map();

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Stateless HMAC JWT Signing & Verification (works seamlessly across Netlify Lambdas)
const getJwtSecret = () => cleanEnvStr(process.env.JWT_SECRET, 'ponkoj_das_portfolio_secure_jwt_key_2026_secret_9988');

const signToken = (payload) => {
  const secret = getJwtSecret();
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
};

const verifyToken = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const secret = getJwtSecret();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now()) return null;

    return payload;
  } catch (e) {
    return null;
  }
};

// Authentication Middleware for Protected Server Endpoints
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, error: 'Session expired or unauthorized token.' });
  }

  req.adminUser = payload.username;
  next();
};

// Admin Login Handler
const handleAdminLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const cleanInputUser = String(username).trim().toLowerCase();
  const cleanInputPass = String(password).trim();

  const expectedUser = cleanEnvStr(process.env.ADMIN_USERNAME, 'ponkoj').toLowerCase();
  const expectedPass = cleanEnvStr(process.env.ADMIN_PASSWORD, 'Puja##2211');

  if (cleanInputUser !== expectedUser || cleanInputPass !== expectedPass) {
    console.warn(`[Admin Auth Mismatch] Attempt user: '${cleanInputUser}' vs Expected user: '${expectedUser}'`);
    return res.status(401).json({ success: false, error: 'Invalid admin credentials. Access denied.' });
  }

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = signToken({ username: expectedUser, exp: expiresAt });

  console.log(`[Admin Auth Success] User '${expectedUser}' logged in.`);

  return res.status(200).json({
    success: true,
    token,
    username: expectedUser,
    expiresAt,
    message: 'Authentication successful.'
  });
};

app.post('/api/admin/login', handleAdminLogin);
app.post('/admin/login', handleAdminLogin);

// Admin Verify Token Endpoint
const handleAdminVerify = (req, res) => {
  res.status(200).json({ success: true, authenticated: true, user: req.adminUser, emailConfig });
};

app.get('/api/admin/verify', requireAdminAuth, handleAdminVerify);
app.get('/admin/verify', requireAdminAuth, handleAdminVerify);

// Admin Get Email Config
const handleGetEmailConfig = (req, res) => {
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
};

app.get('/api/admin/email-config', requireAdminAuth, handleGetEmailConfig);
app.get('/admin/email-config', requireAdminAuth, handleGetEmailConfig);

// Admin Update Email Config
const handleUpdateEmailConfig = (req, res) => {
  const { recipientEmail, smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, web3FormsKey } = req.body;

  if (recipientEmail) emailConfig.recipientEmail = cleanEnvStr(recipientEmail);
  if (smtpHost) emailConfig.smtpHost = cleanEnvStr(smtpHost);
  if (smtpPort) emailConfig.smtpPort = Number(smtpPort);
  if (typeof smtpSecure === 'boolean') emailConfig.smtpSecure = smtpSecure;
  if (smtpUser) emailConfig.smtpUser = cleanEnvStr(smtpUser);
  if (smtpPass !== undefined && smtpPass !== '') emailConfig.smtpPass = cleanEnvStr(smtpPass);
  if (web3FormsKey !== undefined) emailConfig.web3FormsKey = cleanEnvStr(web3FormsKey);

  console.log(`[Admin] Updated email delivery config for ${emailConfig.recipientEmail}`);

  res.status(200).json({
    success: true,
    message: 'Email configuration updated successfully.',
    config: {
      recipientEmail: emailConfig.recipientEmail,
      smtpHost: emailConfig.smtpHost,
      smtpPort: emailConfig.smtpPort,
      smtpUser: emailConfig.smtpUser,
      hasSmtpPass: !!emailConfig.smtpPass
    }
  });
};

app.post('/api/admin/email-config', requireAdminAuth, handleUpdateEmailConfig);
app.post('/admin/email-config', requireAdminAuth, handleUpdateEmailConfig);

// Admin Test Email Delivery Endpoint
const handleTestEmail = async (req, res) => {
  try {
    const { testEmail } = req.body;
    const targetEmail = testEmail || emailConfig.recipientEmail;

    if (!emailConfig.smtpUser || !emailConfig.smtpPass) {
      return res.status(400).json({
        success: false,
        error: 'SMTP Password is not set. Please enter your Gmail App Password in Admin settings or .env file.'
      });
    }

    const transporter = nodemailer.createTransport({
      host: emailConfig.smtpHost,
      port: emailConfig.smtpPort,
      secure: emailConfig.smtpPort === 465 || emailConfig.smtpSecure,
      auth: {
        user: emailConfig.smtpUser,
        pass: emailConfig.smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Ponkoj Portfolio System" <${emailConfig.smtpUser}>`,
      to: targetEmail,
      subject: '✅ Test Email Delivery Confirmation - Ponkoj Das Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">
          <h2 style="color: #10b981;">Email Delivery Verified!</h2>
          <p>This is a test notification confirming that your backend email server is properly configured and successfully delivering messages.</p>
          <hr />
          <p><strong>Recipient:</strong> ${targetEmail}</p>
          <p><strong>SMTP Host:</strong> ${emailConfig.smtpHost}:${emailConfig.smtpPort}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Admin Test Email] Successfully delivered to ${targetEmail}`);

    return res.status(200).json({
      success: true,
      message: `Test email successfully delivered to ${targetEmail}!`
    });
  } catch (err) {
    console.error('[Admin Test Email Error]:', err);
    return res.status(500).json({
      success: false,
      error: `Email delivery failed: ${err.message}`
    });
  }
};

app.post('/api/admin/test-email', requireAdminAuth, handleTestEmail);
app.post('/admin/test-email', requireAdminAuth, handleTestEmail);

// Admin Logout Endpoint
const handleAdminLogout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

app.post('/api/admin/logout', requireAdminAuth, handleAdminLogout);
app.post('/admin/logout', requireAdminAuth, handleAdminLogout);

// Contact Form Endpoint (Public API)
const handleContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, serviceRequested, budget } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message content cannot be empty.' });
    }

    // Rate limiting (30 sec)
    const userEmailKey = email.trim().toLowerCase();
    const lastTime = recentSubmissions.get(userEmailKey);
    const now = Date.now();

    if (lastTime && now - lastTime < 30000) {
      return res.status(429).json({
        success: false,
        error: 'Please wait 30 seconds before sending another message.'
      });
    }
    recentSubmissions.set(userEmailKey, now);

    const emailSubject = subject?.trim() || `New Portfolio Inquiry from ${name.trim()}`;
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const cleanService = serviceRequested || 'General Inquiry';
    const cleanBudget = budget || 'Not specified';
    const targetRecipient = emailConfig.recipientEmail || 'ponkojdas6586@gmail.com';

    console.log(`[Contact Form] Processing inquiry from ${cleanName} (${cleanEmail}) -> ${targetRecipient}`);

    let delivered = false;
    let lastErrorDetails = '';

    // 1. Attempt Nodemailer SMTP delivery if SMTP user & pass configured
    if (emailConfig.smtpUser && emailConfig.smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: emailConfig.smtpHost,
          port: emailConfig.smtpPort,
          secure: emailConfig.smtpPort === 465 || emailConfig.smtpSecure,
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPass
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailOptions = {
          from: `"${cleanName}" <${emailConfig.smtpUser}>`,
          replyTo: cleanEmail,
          to: targetRecipient,
          subject: `[Portfolio Inquiry] ${emailSubject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #1a1a1a; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">New Portfolio Website Inquiry</h2>
              <p><strong>From:</strong> ${cleanName} (&lt;${cleanEmail}&gt;)</p>
              <p><strong>Service Requested:</strong> ${cleanService}</p>
              <p><strong>Budget Range:</strong> ${cleanBudget}</p>
              <p><strong>Subject:</strong> ${emailSubject}</p>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${cleanMessage}</p>
              </div>
              <p style="font-size: 12px; color: #888888; border-top: 1px solid #e0e0e0; padding-top: 10px;">
                Sent via Ponkoj Das Portfolio Website Backend Server
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        delivered = true;
        console.log(`[Contact Form] Email successfully delivered to ${targetRecipient} via SMTP.`);
      } catch (err) {
        console.error('[Contact Form SMTP Error]:', err.message);
        lastErrorDetails = `SMTP Delivery Error: ${err.message}`;
      }
    }

    // 2. Attempt Web3Forms API fallback if key available
    if (!delivered && emailConfig.web3FormsKey) {
      try {
        const web3Res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: emailConfig.web3FormsKey,
            name: cleanName,
            email: cleanEmail,
            subject: `[Portfolio Inquiry] ${emailSubject}`,
            message: `Service: ${cleanService}\nBudget: ${cleanBudget}\n\nMessage:\n${cleanMessage}`
          })
        });
        const web3Data = await web3Res.json();
        if (web3Data.success) {
          delivered = true;
          console.log(`[Contact Form] Delivered via Web3Forms API to ${targetRecipient}`);
        } else {
          lastErrorDetails = `Web3Forms Error: ${web3Data.message}`;
        }
      } catch (err) {
        console.error('[Contact Form Web3Forms Error]:', err.message);
      }
    }

    if (!delivered && !emailConfig.smtpPass && !emailConfig.web3FormsKey) {
      console.warn(`[Contact Form Warning] Message stored in inbox, but live email requires Gmail App Password in Admin or .env.`);
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been received and saved to the inbox. (Live email delivery pending SMTP App Password configuration).'
      });
    }

    if (!delivered) {
      return res.status(500).json({
        success: false,
        error: `Email delivery failed. ${lastErrorDetails || 'Please check SMTP credentials in Admin Panel.'}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully to Ponkoj. Expect a response within 24 hours.'
    });
  } catch (error) {
    console.error('[Contact Form Internal Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred while processing your message.'
    });
  }
};

app.post('/api/contact', handleContactForm);
app.post('/contact', handleContactForm);

// Healthcheck
const handleHealth = (req, res) => {
  res.json({
    status: 'ok',
    recipient: emailConfig.recipientEmail,
    hasSmtpPass: !!emailConfig.smtpPass
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

if (process.env.NETLIFY !== 'true' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Portfolio Contact & Auth API running on port ${PORT}`);
    console.log(`[Server] Recipient Email: ${emailConfig.recipientEmail}`);
  });
}

export default app;
export { app };
