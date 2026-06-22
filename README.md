# 🔐 Secure Login System - Internship Project

A modern, secure login web application with hashed passwords, input validation, session management, and optional Two-Factor Authentication (2FA). This project demonstrates security best practices for web authentication.

## ✨ Key Features

### 1. **User Registration & Login**
   - Email validation using industry-standard validators
   - Bcrypt password hashing with 12 salt rounds
   - Secure password storage in backend
   - User account management

### 2. **Password Security**
   - Minimum 8 characters requirement
   - Mandatory uppercase, lowercase, numbers, and special characters
   - Real-time password strength indicator
   - Protection against common weak passwords

### 3. **Input Validation & Protection**
   - Email format validation
   - XSS protection with validator.js escaping
   - SQL injection prevention through parameterized queries
   - Input sanitization on both client and server

### 4. **Session Management**
   - HTTPOnly cookies for session tokens (prevents XSS theft)
   - Secure flag for production HTTPS
   - SameSite=strict to prevent CSRF attacks
   - Automatic session timeout after 1 hour
   - Logout functionality

### 5. **Two-Factor Authentication (2FA)**
   - TOTP-based (Time-based One-Time Password) implementation
   - QR code generation for authenticator apps
   - Compatible with Google Authenticator, Microsoft Authenticator, Authy, etc.

## 🛠️ Tech Stack

**Backend:**
- Node.js with Express.js
- Bcrypt for password hashing
- Express-session for session management
- Speakeasy for 2FA/TOTP
- QRCode for generating 2FA QR codes
- Validator.js for input validation

**Frontend:**
- HTML5
- CSS3 (modern styling with gradients)
- Vanilla JavaScript (no frameworks)
- Responsive design

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- An authenticator app for 2FA testing (Google Authenticator, Authy, Microsoft Authenticator, etc.)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Eknoor-coder/secure-login-system.git
cd secure-login-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update values (optional for development)
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The server will run on `http://localhost:5000`

### 5. Open in Browser
- Open `index.html` in your browser or
- Serve it using a local server: `python -m http.server 8000` or `npx http-server`
- Navigate to `http://localhost:8000`

## 📖 Usage Guide

### Register a New Account
1. Click "Register" link
2. Enter your email address
3. Create a strong password (must include uppercase, lowercase, number, special character)
4. Confirm your password
5. Click "Register"

### Login
1. Enter your registered email
2. Enter your password
3. Click "Login"
4. If 2FA is enabled, enter the 6-digit code from your authenticator

### Enable 2FA
1. Login to your account
2. Click "Enable 2FA" button
3. Scan the QR code with your authenticator app
4. Enter the 6-digit code displayed in the app
5. Click "Confirm & Enable 2FA"

## 🔒 Security Implementation Details

### Password Hashing
```javascript
// Bcrypt with 12 salt rounds
const hashedPassword = await bcrypt.hash(password, 12);
```

### Session Security
```javascript
cookie: { 
  secure: true,           // HTTPS only in production
  httpOnly: true,         // Prevent JavaScript access
  sameSite: 'strict',     // CSRF protection
  maxAge: 3600000         // 1 hour expiration
}
```

### Input Validation
```javascript
// Email validation
validator.isEmail(email)

// Password strength requirements
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/
```

### SQL Injection Prevention
```javascript
// Use parameterized queries (shown with validator escaping)
validator.escape(userInput)
```

### 2FA Implementation
```javascript
// TOTP-based with 30-second window
speakeasy.totp.verify({
  secret: twoFactorSecret,
  encoding: 'base32',
  token: userToken,
  window: 2  // Allow ±60 seconds for time skew
})
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login user |
| POST | `/api/verify-2fa` | Verify 2FA token |
| POST | `/api/enable-2fa` | Generate 2FA secret & QR code |
| POST | `/api/confirm-2fa` | Confirm and enable 2FA |
| POST | `/api/logout` | Logout user |
| GET | `/api/dashboard` | Get dashboard (protected route) |
| GET | `/api/health` | Health check |

## 🧪 Test Credentials

After registration, use your test email and password to login:
- **Email:** test@example.com
- **Password:** TestPassword123! (must meet strength requirements)

## 🐛 Common Issues & Solutions

### CORS Errors
- Ensure frontend and backend are on correct ports
- Check `CORS` middleware configuration in `server.js`
- Update `CLIENT_URL` in `.env`

### 2FA Not Working
- Ensure your device time is synchronized
- Check that authenticator app is installed
- Verify QR code was scanned correctly

### Password Not Accepted
- Must be at least 8 characters
- Must contain: UPPERCASE, lowercase, numbers, special characters (@$!%*?&)

## 🔐 Security Recommendations for Production

1. **Database Integration**
   - Replace in-memory Map with PostgreSQL/MongoDB
   - Use prepared statements for all queries
   - Implement proper indexing

2. **HTTPS**
   - Enable secure cookie flag
   - Use SSL/TLS certificates

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **Logging & Monitoring**
   - Implement winston or morgan
   - Monitor failed login attempts
   - Alert on suspicious activity

5. **Backup Codes**
   - Implement 2FA backup codes
   - Store recovery codes securely

6. **Password Reset**
   - Implement secure password reset flow
   - Use JWT tokens with expiration

7. **CSRF Protection**
   - Use csrf middleware

## 📁 Project Structure

```
secure-login-system/
├── server.js              # Express server with all API endpoints
├── index.html             # Frontend UI
├── package.json           # Dependencies
├── .env                   # Environment variables
├── .env.example           # Example environment file
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 📚 Learning Outcomes

By completing this project, you'll understand:
- ✅ Password hashing and security best practices
- ✅ Input validation and sanitization
- ✅ Session management and cookies
- ✅ Two-Factor Authentication implementation
- ✅ OWASP security guidelines
- ✅ SQL injection and XSS prevention
- ✅ CSRF protection mechanisms
- ✅ Secure API design

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this in your projects

## 👨‍💻 Author

**Eknoor-coder**
- GitHub: [@Eknoor-coder](https://github.com/Eknoor-coder)
- Internship Project 2024

## 🙏 Acknowledgments

- Bcrypt for secure password hashing
- Speakeasy for TOTP implementation
- Validator.js for input validation
- Express.js community

---

**⭐ If this project helped you, please consider giving it a star!**
