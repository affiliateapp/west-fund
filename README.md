# West Fund - Demo Banking Application

🏦 A full-stack demo banking application with user and admin dashboards.

⚠️ **IMPORTANT**: This is a DEMO banking system. No real financial transactions are processed.

## Features

### Public Features
- ✅ Modern, professional banking website
- ✅ Home, About, Services pages (Savings, Current Account, Loans, Cards)
- ✅ Contact page
- ✅ User authentication (Login/Signup)

### User Dashboard Features
- ✅ View account balance
- ✅ View transaction history
- ✅ Transfer money (simulation)
- ✅ Deposit funds (simulation)
- ✅ View profile
- ✅ Logout functionality

### Admin Dashboard Features
- ✅ View all users
- ✅ View dashboard statistics
- ✅ Suspend/Activate users
- ✅ Delete users
- ✅ View user details
- ✅ Monitor platform activity

## Tech Stack

### Frontend
- React 18
- React Router DOM 6
- CSS3 with custom styling
- Axios for API calls
- JWT authentication

### Backend
- Node.js & Express
- MongoDB (Mongoose ODM)
- JWT authentication
- BCrypt for password hashing
- Express Validator

## Project Structure

```
west-fund/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Transaction.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   └── admin.js
│   │   ├── utils/
│   │   │   └── seed.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.js (Complete application)
    │   ├── App.css
    │   └── index.js
    ├── public/
    │   └── index.html
    ├── package.json
    └── .env.example
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd west-fund
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/westfund
# JWT_SECRET=your-super-secret-jwt-key

# Seed the database (creates admin and demo users)
npm run seed

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default API URL is correct for local dev)
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend
npm start
```

Frontend will run on `http://localhost:3000`

## Demo Login Credentials

After running `npm run seed` in the backend:

### Admin Account
- **Email**: admin@westfund.com
- **Password**: admin123

### Demo User Accounts
- **User 1**
  - Email: john@example.com
  - Password: password123
  
- **User 2**
  - Email: jane@example.com
  - Password: password123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Routes (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/transactions` - Get user transactions
- `POST /api/users/transfer` - Transfer money
- `POST /api/users/deposit` - Deposit money
- `GET /api/users/balance` - Get current balance

### Admin Routes (Protected - Admin Only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id/balance` - Update user balance
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/users/:id/transaction` - Add transaction
- `GET /api/admin/stats` - Get dashboard statistics

## Deployment

### Backend Deployment (Render/Railway)

1. **Create account** on Render.com or Railway.app

2. **Create a new Web Service**
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   ```
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-secret-key
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=your-frontend-url
   ```

4. **Deploy** and note your backend URL

### Frontend Deployment (Netlify/Vercel)

1. **Create account** on Netlify.com or Vercel.com

2. **Create new site from Git**
   - Connect your GitHub repository
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=your-backend-url/api
   ```

4. **Deploy**

### MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP or allow access from anywhere (0.0.0.0/0)
5. Get connection string and add to backend .env

## Features Implementation

### Transfer Money (Simulation)
- Enter recipient account number
- Enter amount
- Add description (optional)
- System deducts from sender, adds to recipient
- Transaction recorded in history
- NO REAL MONEY TRANSFER

### Deposit (Simulation)
- Enter amount
- Add description (optional)
- Amount added to balance
- Transaction recorded
- NO REAL DEPOSIT

### Admin Features
- View all users in table format
- See total users, active users, suspended users
- View total platform balance
- Suspend/Activate user accounts
- Delete users (removes user and their transactions)
- View real-time statistics

## Security Features

- Password hashing with BCrypt
- JWT token authentication
- Protected routes (middleware)
- Role-based access control (User/Admin)
- Input validation with express-validator
- Token expiration (30 days)

## Important Notes

⚠️ **This is a DEMO banking application**
- No real financial transactions
- No connection to real banks
- No PCI compliance
- Educational/demonstration purposes only
- Clear disclaimer on all pages

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Run `npm install` again

### Frontend won't connect to backend
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in frontend .env
- Check for CORS errors in browser console

### Database connection errors
- Verify MongoDB URI in .env
- Check MongoDB is running
- For Atlas: verify IP whitelist and credentials

## Future Enhancements

Potential additions:
- Email notifications
- Password reset functionality
- Two-factor authentication
- Transaction export (PDF/CSV)
- Account statements
- Spending analytics
- Bill payment simulation
- Scheduled transfers

## License

MIT License - This is a demo/educational project

## Support

For issues or questions:
- Check this README
- Review code comments
- Contact: support@westfund.com (demo)

---

**Remember**: This is a DEMONSTRATION banking system. No real financial transactions are processed.
