# 🚀 QUICK START GUIDE - West Fund Banking App

## ⚡ Get Running in 5 Minutes

### Step 1: Install MongoDB (if not installed)

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud - FREE)**
1. Go to mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster
4. Get your connection string
5. Use it in backend .env

### Step 2: Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/westfund
JWT_SECRET=westfund-super-secret-key-12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# Seed database with admin and demo users
npm run seed

# Start backend
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

### Step 3: Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend
npm start
```

Browser will open at: http://localhost:3000

### Step 4: Login!

**Admin Login:**
- Email: admin@westfund.com
- Password: admin123

**User Login:**
- Email: john@example.com
- Password: password123

## 🎯 What You Can Do Now

### As a User:
1. View your dashboard
2. See account balance ($5,000 demo)
3. Transfer money to another account
4. Deposit funds
5. View transaction history

### As Admin:
1. View all users
2. See platform statistics
3. Suspend/activate users
4. Delete users
5. Monitor transactions

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
```bash
# Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: Start MongoDB service from Services
```

**"Port 5000 already in use"**
```bash
# Change PORT in backend/.env to 5001
# Update frontend/.env REACT_APP_API_URL to http://localhost:5001/api
```

**"Module not found"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## 📱 Testing Transfers

1. Login as john@example.com
2. Go to "Transfer Money"
3. Enter recipient account number (from Jane's profile)
4. Enter amount (e.g., 100)
5. Submit
6. Check transaction history!

To get Jane's account number:
- Login as admin
- View all users
- Copy Jane's account number

Or:
- Create a new account
- Use that account number

## 🚀 Next Steps

1. **Customize Design**: Edit `frontend/src/App.css`
2. **Add Features**: Modify `frontend/src/App.js`
3. **Add Endpoints**: Create new routes in `backend/src/routes/`
4. **Deploy**: Follow deployment guide in main README.md

## 📧 Demo Accounts Created by Seed

| Role  | Email              | Password    | Balance |
|-------|-------------------|-------------|---------|
| Admin | admin@westfund.com | admin123    | $0      |
| User  | john@example.com   | password123 | $5,000  |
| User  | jane@example.com   | password123 | $7,500  |

## 🎨 Features Showcase

**Transfer Demo:**
```
1. Login as John ($5,000)
2. Transfer $500 to Jane's account
3. John's balance: $4,500
4. Jane's balance: $8,000
5. Both see transaction in history!
```

**Admin Demo:**
```
1. Login as admin
2. See 2 users (John & Jane)
3. View statistics
4. Suspend John's account
5. John can't login anymore
6. Reactivate to restore access
```

## ⚠️ Remember

This is a **DEMO** banking system:
- ✅ Perfect for learning/portfolio
- ✅ Safe to experiment with
- ❌ Not for real money
- ❌ Not production-ready
- ❌ No real banking compliance

## 🆘 Need Help?

1. Check main README.md
2. Review code comments
3. Check console for errors
4. Verify all environment variables

Happy Banking! 🏦
