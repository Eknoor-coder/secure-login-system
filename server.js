const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const validator = require('validator');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8000',
  credentials: true
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key_change_in_production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent JavaScript access
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000 // 1 hour
  }
}));

// In-memory user storage (replace with database in production)
const users = new Map();

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

// Helper function to validate password strength
function isStrongPassword(password) {
  return passwordRegex.test(password);
}

// Helper function to validate email
function isValidEmail(email) {
  return validator.isEmail(email);
}

// Helper function to sanitize input
function sanitizeInput(input) {
  return validator.escape(input);
}

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Input validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
      });
    }

    // Password match validation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check if user already exists
    const emailLower = email.toLowerCase();
    if (users.has(emailLower)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 12);

    // Store user
    const userId = Date.now().toString();
    users.set(emailLower, {
      id: userId,
      email: emailLower,
      password: hashedPassword,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      createdAt: new Date()
    });

    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Email validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user exists
    const emailLower = email.toLowerCase();
    const user = users.get(emailLower);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Set temporary session for 2FA verification
      req.session.tempUserId = user.id;
      req.session.tempEmail = emailLower;
      return res.json({
        message: 'Please enter your 2FA code',
        requiresTwoFactor: true
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userEmail = emailLower;

    res.json({
      message: 'Login successful',
      user: {
        email: user.email,
        id: user.id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify 2FA endpoint
app.post('/api/verify-2fa', (req, res) => {
  try {
    const { token } = req.body;

    if (!req.session.tempUserId) {
      return res.status(401).json({ error: 'Please login first' });
    }

    if (!token) {
      return res.status(400).json({ error: '2FA token is required' });
    }

    // Find user
    const user = Array.from(users.values()).find(u => u.id === req.session.tempUserId);

    if (!user || !user.twoFactorSecret) {
      return res.status(401).json({ error: '2FA not configured' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow ±60 seconds for time skew
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    delete req.session.tempUserId;
    delete req.session.tempEmail;

    res.json({
      message: '2FA verification successful',
      user: {
        email: user.email,
        id: user.id
      }
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({ error: '2FA verification failed' });
  }
});

// Enable 2FA endpoint (generate secret and QR code)
app.post('/api/enable-2fa', requireAuth, async (req, res) => {
  try {
    // Find user
    const user = Array.from(users.values()).find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: '2FA is already enabled' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${process.env.TWO_FACTOR_APP_NAME} (${user.email})`,
      length: 32
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Store temporary secret in session for confirmation
    req.session.tempTwoFactorSecret = secret.base32;

    res.json({
      message: 'Scan this QR code with your authenticator app',
      qrCode: qrCode,
      secret: secret.base32,
      manualEntry: secret.base32
    });
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ error: 'Failed to enable 2FA' });
  }
});

// Confirm 2FA endpoint
app.post('/api/confirm-2fa', requireAuth, (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: '2FA token is required' });
    }

    if (!req.session.tempTwoFactorSecret) {
      return res.status(400).json({ error: 'Please generate 2FA secret first' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: req.session.tempTwoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 2
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid 2FA token' });
    }

    // Find user and enable 2FA
    const user = Array.from(users.values()).find(u => u.id === req.session.userId);

    if (user) {
      user.twoFactorSecret = req.session.tempTwoFactorSecret;
      user.twoFactorEnabled = true;
    }

    delete req.session.tempTwoFactorSecret;

    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('Confirm 2FA error:', error);
    res.status(500).json({ error: 'Failed to confirm 2FA' });
  }
});

// Dashboard endpoint (protected)
app.get('/api/dashboard', requireAuth, (req, res) => {
  try {
    const user = Array.from(users.values()).find(u => u.id === req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Welcome to dashboard',
      user: {
        id: user.id,
        email: user.email,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
app.get('/api/user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = Array.from(users.values()).find(u => u.id === req.session.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔐 Secure Login System running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
