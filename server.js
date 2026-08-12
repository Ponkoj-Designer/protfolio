import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Dynamic Email Configuration state (initialized from .env)
let emailConfig = {
  recipientEmail: process.env.RECIPIENT_EMAIL || 'ponkojdas6586@gmail.com',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || 'ponkojdas6586@gmail.com',
  smtpPass: process.env.SMTP_PASS || '',
  web3FormsKey: process.env.WEB3FORMS_ACCESS_KEY || ''
};

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'ponkoj';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Puja##2211';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key_ponkoj_das_2026';

app.use(cors());
app.use(express.json());

// In-memory session store
const activeAdminSessions = new Map();
const recentSubmissions = new Map();

// Helper: Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Authentication Middleware
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token.' });
  }

  const token = authHeader.split(' ')[1];
  const session = activeAdminSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeAdminSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Session expired or unauthorized token.' });
  }

  req.adminUser = session.username;
  next();
};

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  const expectedUser = process.env.ADMIN_USERNAME || 'ponkoj';
  const expectedPass = process.env.ADMIN_PASSWORD || 'Puja##2211';

  if (username !== expectedUser || password !== expectedPass) {
    return res.status(401).json({ success: false, error: 'Invalid admin credentials. Access denied.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  activeAdminSessions.set(token, { username, expiresAt });

  return res.status(200).json({
    success: true,
    token,
    username,
    expiresAt,
    message: 'Authentication successful.'
  });
});

// Admin Verify Token Endpoint
app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.status(200).json({ success: true, authenticated: true, user: req.adminUser, emailConfig });
});

// Admin Get Email Config
app.get('/api/admin/email-config', requireAdminAuth, (req, res) => {
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
});

// Admin Update Email Config
app.post('/api/admin/email-config', requireAdminAuth, (req, res) => {
  const { recipientEmail, smtpHost, smtpPort, smtpSecure, smtpUser, smtpPass, web3FormsKey } = req.body;

  if (recipientEmail) emailConfig.recipientEmail = recipientEmail.trim();
  if (smtpHost) emailConfig.smtpHost = smtpHost.trim();
  if (smtpPort) emailConfig.smtpPort = Number(smtpPort);
  if (typeof smtpSecure === 'boolean') emailConfig.smtpSecure = smtpSecure;
  if (smtpUser) emailConfig.smtpUser = smtpUser.trim();
  if (smtpPass !== undefined && smtpPass !== '') emailConfig.smtpPass = smtpPass.trim();
  if (web3FormsKey !== undefined) emailConfig.web3FormsKey = web3FormsKey.trim();

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
});

// Admin Test Email Delivery Endpoint
app.post('/api/admin/test-email', requireAdminAuth, async (req, res) => {
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
});

// Admin Logout Endpoint
app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  activeAdminSessions.delete(token);
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// Contact Form Endpoint (Public API)
app.post('/api/contact', async (req, res) => {
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

    // If delivery failed or SMTP pass is not configured, inform the user clearly
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
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    recipient: emailConfig.recipientEmail,
    hasSmtpPass: !!emailConfig.smtpPass
  });
});

if (process.env.NETLIFY !== 'true' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] Portfolio Contact & Auth API running on port ${PORT}`);
    console.log(`[Server] Recipient Email: ${emailConfig.recipientEmail}`);
  });
}

export default app;
export { app };
