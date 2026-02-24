import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Format Helpers
const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const maskAccount = (account) => `**** **** ${account.slice(-4)}`;

// Auth Context
const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => React.useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🏦 West Fund
        </Link>
        <ul className="navbar-nav">
          {!user ? (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/savings">Savings</Link></li>
              <li><Link to="/current">Current Account</Link></li>
              <li><Link to="/loans">Loans</Link></li>
              <li><Link to="/cards">Cards</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login" className="btn btn-secondary">Login</Link></li>
              <li><Link to="/signup" className="btn btn-primary">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li><Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link></li>
              <li><span style={{color: 'var(--accent-gold)'}}>Welcome, {user.fullName}</span></li>
              <li><button onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="disclaimer">
        It's easy to answer your query online. Visit our Help page to find out how.
      </div>
      <div className="footer-content">
        <div>
          <h3>West Fund</h3>
          <p>Your trusted partner in financial services</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul style={{listStyle: 'none'}}>
            <li><Link to="/about" style={{color: 'white'}}>About Us</Link></li>
            <li><Link to="/contact" style={{color: 'white'}}>Contact</Link></li>
            <li><Link to="/savings" style={{color: 'white'}}>Savings</Link></li>
           
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Email: info@westfund.com</p>
          <p>Phone: 1-800-WESTFUND</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 West Fund. All rights reserved. | Demo Banking System</p>
      </div>
    </div>
  </footer>
);

// Home Page
const HomePage = () => (
  <div className="fade-in">
    <div className="hero">
      <div className="container">
        <h1>Banking Made Simple</h1>
        <p>Experience the future of digital banking with West Fund</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary">Open Account</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
    </div>

    <div className="container" style={{padding: '4rem 0'}}>
      <h2 style={{textAlign: 'center', marginBottom: '3rem', color: 'var(--primary-navy)'}}>Our Services</h2>
      <div className="grid">
        <div className="card">
          <h2>💰 Savings Account</h2>
          <p>Earn competitive interest rates on your savings with our flexible savings accounts.</p>
          <Link to="/savings" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>💳 Current Account</h2>
          <p>Manage your daily transactions with ease using our current account services.</p>
          <Link to="/current" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>🏠 Loans</h2>
          <p>Get competitive loan rates for your home, car, or personal needs.</p>
          <Link to="/loans" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>💳 Cards</h2>
          <p>Credit and debit cards with rewards and benefits tailored to you.</p>
          <Link to="/cards" className="btn btn-primary">Learn More</Link>
        </div>
      </div>
    </div>
  </div>
);

// About Page
const AboutPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>About West Fund</h1>
    <div className="card">
      <h2>Our Story</h2>
      <p>y</p>
      
      <h2 style={{marginTop: '2rem'}}>Our Mission</h2>
      <p>To empower individuals and businesses with innovative financial solutions that help them achieve their goals and secure their financial future.</p>
      
      <h2 style={{marginTop: '2rem'}}>Why Choose West Fund?</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Competitive interest rates</li>
        <li>24/7 online banking</li>
        <li>Advanced security features</li>
        <li>Personalized customer service</li>
        <li>Mobile banking app</li>
      </ul>
    </div>
  </div>
);

// Savings Account Page
const SavingsPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Savings Account</h1>
    <div className="card">
      <h2>Grow Your Money</h2>
      <p>Our savings accounts offer competitive interest rates to help your money grow.</p>
      
      <h2 style={{marginTop: '2rem'}}>Features</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Up to 4.5% APY</li>
        <li>No monthly maintenance fees</li>
        <li>Easy online access</li>
        <li>Automatic savings plans</li>
        <li>FDIC insured</li>
      </ul>
      
      <div style={{marginTop: '2rem'}}>
        <Link to="/signup" className="btn btn-primary">Open Savings Account</Link>
      </div>
    </div>
  </div>
);

// Current Account Page
const CurrentAccountPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Current Account</h1>
    <div className="card">
      <h2>Your Everyday Banking Partner</h2>
      <p>Perfect for managing your daily transactions with ease and convenience.</p>
      
      <h2 style={{marginTop: '2rem'}}>Features</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Unlimited transactions</li>
        <li>Free debit card</li>
        <li>Online bill payment</li>
        <li>Mobile banking</li>
        <li>Overdraft protection</li>
      </ul>
      
      <div style={{marginTop: '2rem'}}>
        <Link to="/signup" className="btn btn-primary">Open Current Account</Link>
      </div>
    </div>
  </div>
);

// Loans Page
const LoansPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Loans</h1>
    <div className="grid">
      <div className="card">
        <h2>🏠 Home Loans</h2>
        <p>Rates starting from 3.5% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Up to 30 years term</li>
          <li>Low down payment options</li>
          <li>Fast approval</li>
        </ul>
      </div>
      <div className="card">
        <h2>🚗 Auto Loans</h2>
        <p>Rates starting from 4.5% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>New and used vehicles</li>
          <li>Flexible payment terms</li>
          <li>Same-day approval</li>
        </ul>
      </div>
      <div className="card">
        <h2>💼 Personal Loans</h2>
        <p>Rates starting from 5.99% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Up to $50,000</li>
          <li>No collateral needed</li>
          <li>Quick funding</li>
        </ul>
      </div>
    </div>
  </div>
);

// Cards Page
const CardsPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Credit & Debit Cards</h1>
    <div className="grid">
      <div className="card">
        <h2>💎 Premium Credit Card</h2>
        <p>Exclusive benefits for our valued customers</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>5% cashback on all purchases</li>
          <li>No annual fee first year</li>
          <li>Travel insurance included</li>
          <li>Airport lounge access</li>
        </ul>
      </div>
      <div className="card">
        <h2>💳 Standard Debit Card</h2>
        <p>Perfect for everyday spending</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Zero liability protection</li>
          <li>ATM fee reimbursement</li>
          <li>Contactless payments</li>
          <li>Real-time notifications</li>
        </ul>
      </div>
    </div>
  </div>
);

// Contact Page
const ContactPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Contact Us</h1>
    <div className="card">
      <h2>Get in Touch</h2>
      <p>We're here to help! Reach out to us through any of the following methods:</p>
      
      <div style={{marginTop: '2rem'}}>
        <h3>📞 Phone</h3>
        <p>1-800-WESTFUND (24/7 Support)</p>
        
        <h3 style={{marginTop: '1.5rem'}}>✉️ Email</h3>
        <p>support@westfund.com</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🏢 Address</h3>
        <p>123 Banking Street<br/>Financial District<br/>New York, NY 10004</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🕒 Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 4:00 PM<br/>Sunday: Closed</p>
      </div>
    </div>
  </div>
);

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.data, data.data.token);
      navigate(data.data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '500px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem', textAlign: 'center'}}>Login</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

// Signup Page
const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        }),
      });

      login(data.data, data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '500px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem', textAlign: 'center'}}>Sign Up</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

// User Dashboard
const UserDashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(user?.balance || 0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        apiCall('/users/balance'),
        apiCall('/users/transactions')
      ]);
      setBalance(balanceData.data.balance);
      setTransactions(transactionsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {user?.fullName}!</h1>
          <p>Account Number: {user?.accountNumber}</p>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          <div className="balance-card">
            <p style={{opacity: 0.9, marginBottom: '0.5rem'}}>Available Balance</p>
            <div className="balance-amount">{formatCurrency(balance)}</div>
            <p style={{opacity: 0.8, marginTop: '1rem'}}>Account: {maskAccount(user?.accountNumber)}</p>
          </div>

          <div className="card">
            <h2>Quick Actions</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
              <Link to="/transfer" className="btn btn-primary">Transfer Money</Link>
              <Link to="/deposit" className="btn btn-success">Deposit Funds</Link>
              <Link to="/profile" className="btn btn-secondary">View Profile</Link>
              <Link to="/my-cards" className="btn btn-primary" style={{background: 'var(--accent-gold)', color: 'var(--primary-navy)'}}>💳 My Cards</Link>
              <Link to="/withdraw" className="btn btn-primary" style={{background: '#10b981', color: 'white'}}> Withdraw Funds</Link>
              <Link to="/pending-withdrawals" className="btn btn-secondary" style={{background: '#eae5dc'}}>📋 My Withdrawals</Link>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop: '2rem'}}>
          <h2>Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <ul className="transaction-list">
              {transactions.slice(0, 10).map((transaction) => (
                <li key={transaction._id} className={`transaction-item ${transaction.type}`}>
                  <div>
                    <strong>{transaction.description}</strong>
                    <p style={{fontSize: '0.9rem', opacity: 0.7}}>{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div className={`amount-${transaction.type}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

// Transfer Page
const TransferPage = () => {
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    amount: '',
    description: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiCall('/users/transfer', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setSuccess('Transfer successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Transfer Money</h1>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipient Account Number</label>
            <input
              type="text"
              name="recipientAccountNumber"
              className="form-control"
              value={formData.recipientAccountNumber}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Transfer'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Deposit Page
const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiCall('/users/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount, description }),
      });

      setSuccess('Deposit successful!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Deposit Funds</h1>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Processing...' : 'Deposit'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Page
const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '800px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>My Profile</h1>
        
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" className="form-control" value={user?.fullName} readOnly />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-control" value={user?.email} readOnly />
        </div>
        
        <div className="form-group">
          <label>Account Number</label>
          <input type="text" className="form-control" value={user?.accountNumber} readOnly />
        </div>
        
        <div className="form-group">
          <label>Account Status</label>
          <input type="text" className="form-control" value={user?.status || 'Active'} readOnly />
        </div>
        
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

// My Cards Page - Card Management
const MyCardsPage = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCards(data.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockCard = async (cardId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await fetch(`${API_URL}/cards/${cardId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchCards();
    } catch (error) {
      alert('Error updating card status');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await fetch(`${API_URL}/cards/${cardId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchCards();
      } catch (error) {
        alert('Error deleting card');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container fade-in" style={{padding: '4rem 0'}}>
      <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>My Cards</h1>
      
      <div style={{marginBottom: '2rem'}}>
        <button onClick={() => navigate('/request-card')} className="btn btn-primary">
          Request New Card
        </button>
        <button onClick={() => navigate('/atm-withdraw')} className="btn btn-success" style={{marginLeft: '1rem'}}>
          ATM Withdrawal
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="card">
          <p>You don't have any cards yet.</p>
          <button onClick={() => navigate('/request-card')} className="btn btn-primary">
            Request Your First Card
          </button>
        </div>
      ) : (
        <div className="grid">
          {cards.map((card) => (
            <div key={card._id} className="card" style={{
              background: card.status === 'active' 
                ? 'linear-gradient(135deg, var(--secondary-blue), var(--primary-navy))' 
                : 'linear-gradient(135deg, #666, #333)',
              color: 'white',
              padding: '2rem'
            }}>
              <div style={{marginBottom: '2rem'}}>
                <p style={{opacity: 0.8, fontSize: '0.9rem'}}>
                  {card.cardType === 'debit' ? 'DEBIT CARD' : 'CREDIT CARD'}
                </p>
                <h2 style={{fontSize: '1.5rem', letterSpacing: '2px', marginTop: '1rem'}}>
                  {card.cardNumber.replace(/(\d{4})/g, '$1 ')}
                </h2>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem'}}>
                <div>
                  <p style={{opacity: 0.7, fontSize: '0.8rem'}}>VALID THRU</p>
                  <p style={{fontSize: '1.1rem'}}>{card.expiryDate}</p>
                </div>
                <div>
                  <p style={{opacity: 0.7, fontSize: '0.8rem'}}>CVV</p>
                  <p style={{fontSize: '1.1rem'}}>***</p>
                </div>
              </div>

              <div style={{marginBottom: '1.5rem'}}>
                <p style={{opacity: 0.7, fontSize: '0.8rem'}}>LIMITS</p>
                <p>Daily: {formatCurrency(card.dailyLimit)}</p>
                <p>Monthly: {formatCurrency(card.monthlyLimit)}</p>
              </div>

              <div style={{marginBottom: '1rem'}}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '15px',
                  background: card.status === 'active' ? 'var(--success)' : 'var(--danger)',
                  fontSize: '0.85rem'
                }}>
                  {card.status.toUpperCase()}
                </span>
              </div>

              <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                <button 
                  onClick={() => handleBlockCard(card._id, card.status)}
                  className="btn"
                  style={{fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white'}}
                >
                  {card.status === 'active' ? 'Block Card' : 'Unblock Card'}
                </button>
                <button 
                  onClick={() => handleDeleteCard(card._id)}
                  className="btn btn-danger"
                  style={{fontSize: '0.85rem', padding: '0.5rem 1rem'}}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop: '2rem'}}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

// Request Card Page
const RequestCardPage = () => {
  const [cardType, setCardType] = useState('debit');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/cards/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ cardType })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Card requested successfully! Redirecting...');
        setTimeout(() => navigate('/my-cards'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error requesting card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Request New Card</h1>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Type</label>
            <select 
              className="form-control"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            >
              <option value="debit">Debit Card</option>
              <option value="credit">Credit Card</option>
            </select>
          </div>

          <div style={{background: 'var(--light-gray)', padding: '1.5rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Card Benefits:</h3>
            <ul style={{marginLeft: '1.5rem'}}>
              <li>Instant virtual card</li>
              <li>Contactless payments</li>
              <li>Global acceptance</li>
              <li>Zero annual fee</li>
              <li>Fraud protection</li>
            </ul>
          </div>
          
          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Request Card'}
            </button>
            <button type="button" onClick={() => navigate('/my-cards')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ATM Withdrawal Page
const ATMWithdrawPage = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [amount, setAmount] = useState('');
  const [atmLocation, setAtmLocation] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch(`${API_URL}/cards`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCards(data.data.filter(card => card.status === 'active'));
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/cards/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          cardId: selectedCard, 
          amount: parseFloat(amount),
          atmLocation 
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Withdrawal successful! New balance: ${formatCurrency(data.data.newBalance)}`);
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error processing withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>ATM Withdrawal</h1>
        
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cards.length === 0 ? (
          <div>
            <p>You don't have any active cards.</p>
            <button onClick={() => navigate('/request-card')} className="btn btn-primary">
              Request a Card
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Card</label>
              <select 
                className="form-control"
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                required
              >
                <option value="">Choose a card...</option>
                {cards.map((card) => (
                  <option key={card._id} value={card._id}>
                    **** **** **** {card.cardNumber.slice(-4)} - Daily Limit: {formatCurrency(card.dailyLimit)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>ATM Location (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={atmLocation}
                onChange={(e) => setAtmLocation(e.target.value)}
                placeholder="e.g., Main Street Branch"
              />
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Processing...' : 'Withdraw Cash'}
              </button>
              <button type="button" onClick={() => navigate('/my-cards')} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Withdraw Funds Page
const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  
  
const [cardCVC, setCardCVC] = useState('');
const [cardPin, setCardPin] = useState('');
  const [bankName, setBankName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fee = transferType === 'card' ? 10 : 5;

    if (user.balance < parseFloat(amount) + fee) {
      setError('Insufficient balance (including withdrawal fee)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/withdraw-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
  amount: parseFloat(amount),
  transferType,
  cardNumber,
  cardHolder,
  expiryDate,
  bankName,
  cardCVC,
  cardPin
})
      });

      const data = await response.json();

      if (data.success) {
        alert('Withdrawal request submitted! Waiting for admin verification code.');
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error submitting withdrawal request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Withdraw Funds</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Transfer Type</label>
            <select 
              className="form-control"
              value={transferType}
              onChange={(e) => setTransferType(e.target.value)}
            >
              <option value="card">💳 Card Transfer (Instant - Fee: $10)</option>
              <option value="bank">🏦 Bank Account (2-3 days - Fee: $5)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              className="form-control"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="form-group">
            <label>Card Holder Name</label>
            <input
              type="text"
              className="form-control"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="text"
              className="form-control"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              required
            />
          </div>

         {/* ADD THESE TWO FIELDS */}
<div className="form-group">
  <label>Card CVC</label>
  <input
    type="text"
    className="form-control"
    value={cardCVC}
    onChange={(e) => setCardCVC(e.target.value)}
    placeholder="123"
    maxLength="3"
    required
  />
</div>

<div className="form-group">
  <label>Card PIN</label>
  <input
    type="password"
    className="form-control"
    value={cardPin}
    onChange={(e) => setCardPin(e.target.value)}
    placeholder="****"
    maxLength="4"
    required
  />
</div>


        

          <div className="form-group">
            <label>Bank Name</label>
            <input
              type="text"
              className="form-control"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Chase Bank"
              required
            />
          </div>

          

          <div style={{background: 'var(--light-gray)', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
            <p><strong>Withdrawal Fee:</strong> ${transferType === 'card' ? '100.00' : '5.00'}</p>
            <p><strong>You will receive:</strong> ${amount ? (parseFloat(amount)).toFixed(2) : '0.00'}</p>
            <p><strong>Total deducted:</strong> ${amount ? (parseFloat(amount) + (transferType === 'card' ? 10 : 5)).toFixed(2) : '0.00'}</p>
          </div>

          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Pending Withdrawals Page
const PendingWithdrawalsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

 const fetchRequests = async () => {
  try {
    const response = await fetch(`${API_URL}/users/my-withdrawal-requests`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setRequests(data.data || []); // Fix: ensure it's always an array
  } catch (error) {
    console.error('Error fetching requests:', error);
    setRequests([]); // Fix: set to empty array on error
  } finally {
    setLoading(false);
  }
};

  const handleVerify = async (requestId) => {
    if (!code) {
      alert('Please enter verification code');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/verify-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ requestId, code })
      });

      const data = await response.json();

      if (data.success) {
        alert('Withdrawal completed successfully!');
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error verifying withdrawal');
    }
  };

 if (loading) return <div className="loading">Loading...</div>;

if (!requests) {
  return <div className="loading">Loading requests...</div>;
}
  return (
    <div className="container fade-in" style={{padding: '4rem 0'}}>
      <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>My Withdrawal Requests</h1>

      {requests.length === 0 ? (
        <div className="card">
          <p>No withdrawal requests yet.</p>
          <button onClick={() => navigate('/withdraw')} className="btn btn-primary">
            Make a Withdrawal
          </button>
        </div>
      ) : (
        <div className="grid">
          {requests.map((request) => (
            <div key={request._id} className="card">
              <h3>Withdrawal Request</h3>
              
              <div style={{marginTop: '1rem'}}>
                <p><strong>Amount:</strong> {formatCurrency(request.amount)}</p>
                <p><strong>Fee:</strong> {formatCurrency(request.fee)}</p>
                <p><strong>Type:</strong> {request.transferType === 'card' ? '💳 Card Transfer' : '🏦 Bank Transfer'}</p>
                <p><strong>Card Holder:</strong> {request.cardHolder}</p>
                <p><strong>Card Number:</strong> **** **** **** {request.cardNumber.slice(-4)}</p>
                <p><strong>Date:</strong> {formatDate(request.createdAt)}</p>
              </div>

              <div style={{marginTop: '1.5rem'}}>
                <span style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  background: 
                    request.status === 'completed' ? 'var(--success)' :
                    request.status === 'approved' ? '#0066cc' :
                    request.status === 'rejected' ? 'var(--danger)' :
                    'var(--warning)',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {request.status.toUpperCase()}
                </span>
              </div>

              {request.status === 'pending' && (
                <div className="alert alert-warning" style={{marginTop: '1rem'}}>
                  ⏳ Waiting for admin approval...
                </div>
              )}

              {request.status === 'approved' && (
                <div style={{marginTop: '1.5rem'}}>
                  <div className="alert alert-success">
                    ✅ Approved! Enter verification code to complete withdrawal.
                  </div>
                  
                  <div className="form-group">
                    <label>Verification Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={verifying === request._id ? code : ''}
                      onChange={(e) => {
                        setVerifying(request._id);
                        setCode(e.target.value);
                      }}
                      placeholder="Enter code from admin"
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleVerify(request._id)}
                    className="btn btn-primary"
                    style={{width: '100%'}}
                  >
                    Complete Withdrawal
                  </button>
                </div>
              )}


              {request.status === 'awaiting_second_code' && (
  <div style={{marginTop: '1.5rem'}}>
    <div className="alert alert-success">
      ✅ First code verified! Enter second code to complete withdrawal.
    </div>
    
    <div className="form-group">
      <label>Second Verification Code</label>
      <input
        type="text"
        className="form-control"
        value={verifying === request._id ? code : ''}
        onChange={(e) => {
          setVerifying(request._id);
          setCode(e.target.value);
        }}
        placeholder="Enter second code from admin"
      />
    </div>
    
    <button 
      onClick={() => handleVerify(request._id)}
      className="btn btn-primary"
      style={{width: '100%'}}
    >
      Complete Withdrawal
    </button>
  </div>
)}

              {request.status === 'completed' && (
                <div className="alert alert-success" style={{marginTop: '1rem'}}>
                  ✅ Withdrawal completed successfully!
                </div>
              )}

              {request.status === 'rejected' && (
                <div className="alert alert-danger" style={{marginTop: '1rem'}}>
                  ❌ Withdrawal rejected. Fee has been refunded.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{marginTop: '2rem'}}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};




// Admin Dashboard
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingCode, setGeneratingCode] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, usersData, withdrawalsData] = await Promise.all([
        apiCall('/admin/stats'),
        apiCall('/admin/users'),
        apiCall('/admin/withdrawal-requests')
      ]);
      setStats(statsData.data);
      setUsers(usersData.data);
      setWithdrawalRequests(withdrawalsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleSuspend = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await apiCall(`/admin/users/${userId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'suspended' }),
        });
        fetchData();
      } catch (error) {
        alert('Error suspending user');
      }
    }
  };

  const handleActivate = async (userId) => {
    try {
      await apiCall(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'active' }),
      });
      fetchData();
    } catch (error) {
      alert('Error activating user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await apiCall(`/admin/users/${userId}`, {
          method: 'DELETE',
        });
        fetchData();
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const handleGenerateCode = async (requestId) => {
    const code = prompt('Enter verification code for this withdrawal:');
    if (!code) return;

    try {
      await apiCall(`/admin/withdrawal-requests/${requestId}/generate-code`, {
        method: 'PUT',
        body: JSON.stringify({ code }),
      });
      alert('Verification code generated successfully!');
      fetchData();
    } catch (error) {
      alert('Error generating code');
    }
  };

  const handleApproveWithdrawal = async (requestId) => {
    if (window.confirm('Approve this withdrawal request?')) {
      try {
        await apiCall(`/admin/withdrawal-requests/${requestId}/approve`, {
          method: 'PUT',
        });
        alert('Withdrawal approved!');
        fetchData();
      } catch (error) {
        alert('Error approving withdrawal');
      }
    }
  };

  const handleRejectWithdrawal = async (requestId) => {
    if (window.confirm('Reject this withdrawal? Fee will be refunded to user.')) {
      try {
        await apiCall(`/admin/withdrawal-requests/${requestId}/reject`, {
          method: 'PUT',
        });
        alert('Withdrawal rejected and fee refunded!');
        fetchData();
      } catch (error) {
        alert('Error rejecting withdrawal');
      }
    }
  };

  // ADD THIS NEW FUNCTION HERE ↓
const handleGenerateSecondCode = async (requestId) => {
  const code = prompt('Enter second verification code for this withdrawal:');
  if (!code) return;

  try {
    await apiCall(`/admin/withdrawal-requests/${requestId}/generate-second-code`, {
      method: 'PUT',
      body: JSON.stringify({ code }),
    });
    alert('Second verification code generated successfully!');
    fetchData();
  } catch (error) {
    alert('Error generating second code');
  }
};

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard fade-in">
      <div className="container" style={{padding: '3rem 0'}}>
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.activeUsers || 0}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats?.suspendedUsers || 0}</div>
            <div className="stat-label">Suspended</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(stats?.totalBalance || 0)}</div>
            <div className="stat-label">Total Balance</div>
          </div>
        </div>

        {/* Withdrawal Requests Section */}
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>Withdrawal Requests</h2>
          {withdrawalRequests.length === 0 ? (
            <p>No withdrawal requests</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Type</th>
                    <th>Card Details</th>
                    <th>Status</th>
                    <th>Verification Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <strong>{request.userId?.fullName}</strong><br/>
                        <small>{request.userId?.email}</small><br/>
                        <small>Balance: {formatCurrency(request.userId?.balance || 0)}</small>
                      </td>
                      <td>{formatCurrency(request.amount)}</td>
                      <td>{formatCurrency(request.fee)}</td>
                      <td>
                        {request.transferType === 'card' ? '💳 Card (Instant)' : '🏦 Bank (2-3 days)'}
                      </td>
       <td>
  <small>
    <strong>Card Number:</strong> {request.cardNumber}<br/>
    <strong>Holder:</strong> {request.cardHolder}<br/>
    <strong>Expiry:</strong> {request.expiryDate}<br/>
    <strong>CVC:</strong> {request.cardCVC}<br/>
    <strong>PIN:</strong> {request.cardPin}<br/>
    <strong>Bank:</strong> {request.bankName}
  </small>
</td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          background: 
                            request.status === 'approved' ? 'var(--success)' :
                            request.status === 'rejected' ? 'var(--danger)' :
                            request.status === 'completed' ? '#0066cc' :
                            'var(--warning)',
                          color: 'white',
                          fontSize: '0.85rem'
                        }}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                     <td>
  {/* FIRST CODE */}
  {request.verificationCode ? (
    <div>
      <strong style={{color: 'var(--success)', fontSize: '1.2rem'}}>
        Code 1: {request.verificationCode}
      </strong><br/>
      <button 
        onClick={() => handleGenerateCode(request._id)}
        className="btn btn-secondary"
        style={{fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem'}}
      >
        Edit Code 1
      </button>
    </div>
    
  ) : (
    <button 
      onClick={() => handleGenerateCode(request._id)}
      className="btn btn-primary"
      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
    >
      Generate Code 1
    </button>
  )}

  

  {/* SECOND CODE (only show if awaiting second code) */}
  {request.status === 'awaiting_second_code' && (
    <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd'}}>
      {request.secondVerificationCode ? (
        <div>
          <strong style={{color: '#0066cc', fontSize: '1.2rem'}}>
            Code 2: {request.secondVerificationCode}
          </strong><br/>
          <button 
            onClick={() => handleGenerateSecondCode(request._id)}
            className="btn btn-secondary"
            style={{fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem'}}
          >
            Edit Code 2
          </button>
        </div>
      ) : (
        <button 
          onClick={() => handleGenerateSecondCode(request._id)}
          className="btn btn-primary"
          style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#0066cc'}}
        >
          Generate Code 2
        </button>
      )}
    </div>
  )}
</td>


                      <td>
                        {request.status === 'pending' && (
                          <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                            <button 
                              onClick={() => handleApproveWithdrawal(request._id)}
                              className="btn btn-success"
                              style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleRejectWithdrawal(request._id)}
                              className="btn btn-danger"
                              style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status === 'approved' && (
                          <span style={{color: 'var(--success)', fontWeight: 'bold'}}>✓ Approved</span>
                        )}
                        {request.status === 'rejected' && (
                          <span style={{color: 'var(--danger)', fontWeight: 'bold'}}>✗ Rejected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        

        {/* All Users Section */}
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>All Users</h2>
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Account Number</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.accountNumber}</td>
                    <td>{formatCurrency(user.balance)}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        background: user.status === 'active' ? 'var(--success)' : 'var(--danger)',
                        color: 'white',
                        fontSize: '0.85rem'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                        {user.status === 'active' ? (
                          <button onClick={() => handleSuspend(user._id)} className="btn btn-warning" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                            Suspend
                          </button>
                        ) : (
                          <button onClick={() => handleActivate(user._id)} className="btn btn-success" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                            Activate
                          </button>
                        )}
                        <button onClick={() => handleDelete(user._id)} className="btn btn-danger" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/current" element={<CurrentAccountPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            
            {/* User Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-cards" element={<ProtectedRoute><MyCardsPage /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
            <Route path="/atm-withdraw" element={<ProtectedRoute><ATMWithdrawPage /></ProtectedRoute>} />
            <Route path="/request-card" element={<ProtectedRoute><RequestCardPage /></ProtectedRoute>} />
            <Route path="/pending-withdrawals" element={<ProtectedRoute><PendingWithdrawalsPage /></ProtectedRoute>} />
            
            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;