# 🚀 Quick Start Guide - Secure Login System

## ⚡ Fastest Way to Run (5 minutes)

### Prerequisites
- **Node.js** (v14+) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone Repository
```bash
git clone https://github.com/Eknoor-coder/secure-login-system.git
cd secure-login-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Server
```bash
npm start
```
✅ Server running at: http://localhost:5000

### Step 4: Open Frontend (in another terminal)
```bash
# Option A: Using Python (built-in)
python -m http.server 8000

# Option B: Using Node.js http-server
npx http-server -p 8000

# Option C: Using VS Code Live Server extension
# Just right-click index.html and select "Open with Live Server"
```

✅ Open browser: **http://localhost:8000**

---

## 📋 What You'll See

### 1. **Registration Page**
- Enter email & password
- Password strength indicator shows in real-time
- Requirements: 8+ chars, UPPERCASE, lowercase, number, special char

### 2. **Login Page**
- Enter credentials
- If 2FA enabled, you'll be prompted for code

### 3. **Dashboard**
- View your account info
- Enable/disable 2FA
- Logout option

### 4. **2FA Setup** (Optional)
- Scan QR code with authenticator app
- Use: Google Authenticator, Microsoft Authenticator, Authy, etc.
- Enter 6-digit code to confirm

---

## 🧪 Test Credentials (After Registering)

Create a test account:
- **Email:** test@example.com
- **Password:** TestPassword123! (meets all requirements)

---

## 🔧 Troubleshooting

### ❌ "Cannot find module 'express'"
```bash
npm install
```

### ❌ "Port 5000 already in use"
```bash
# Change port in .env file
echo "PORT=5001" > .env
```

### ❌ CORS error in browser console
- Make sure server is running on http://localhost:5000
- Make sure frontend is running on http://localhost:8000

### ❌ 2FA not working
- Make sure authenticator app is installed (Google Authenticator, etc.)
- Check that your device time is synchronized

---

## 📁 Project Structure

```
secure-login-system/
├── index.html          ← Open this in browser
├── server.js           ← Backend server
├── package.json        ← Dependencies list
├── .env.example        ← Configuration template
├── .gitignore          ← Git ignore rules
├── README.md           ← Full documentation
└── SETUP.md            ← This file
```

---

## 🛠️ For Company/Production Setup

### Option 1: Docker (Recommended for Company)
```bash
# Create Dockerfile
docker build -t secure-login .
docker run -p 5000:5000 -p 8000:8000 secure-login
```

### Option 2: Deploy to Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Option 3: Deploy to AWS/Azure
- Use Node.js runtime
- Set environment variables
- Point domain to server

---

## 📊 Architecture

```
Browser (index.html)
    ↓ (HTTP Requests)
    ↓
Express Server (server.js)
    ├── /api/register     → Create account
    ├── /api/login        → Login user
    ├── /api/verify-2fa   → Verify 2FA code
    ├── /api/enable-2fa   → Generate QR code
    ├── /api/dashboard    → User dashboard
    └── /api/logout       → Logout
```

---

## 🔒 Security Features Implemented

✅ **Password Hashing** - Bcrypt 12 rounds  
✅ **Session Management** - HTTPOnly cookies  
✅ **Input Validation** - Server + Client  
✅ **CSRF Protection** - SameSite cookies  
✅ **XSS Prevention** - Input escaping  
✅ **2FA (TOTP)** - Time-based one-time passwords  

---

## 📞 Need Help?

1. Check browser console for errors (F12)
2. Check server terminal for error messages
3. Make sure both servers are running
4. Clear browser cache (Ctrl+Shift+Del)
5. Restart both servers

---

**Happy Testing! 🎉**
