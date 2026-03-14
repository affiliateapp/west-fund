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
          🏦 Stamford Members Credit Union
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
          <h3>Stamford</h3>
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
          <p>Email: infoStamford.com</p>
          <p>Phone: 1-800-Stamford</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Stamford. All rights reserved. | Stamford Banking System</p>
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
        <p>Experience the future of digital banking with Stamford</p>
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
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>About Stamford</h1>
    <div className="card">
      <h2>Our Story</h2>
      <p>y</p>
      
      <h2 style={{marginTop: '2rem'}}>Our Mission</h2>
      <p>To empower individuals and businesses with innovative financial solutions that help them achieve their goals and secure their financial future.</p>
      
      <h2 style={{marginTop: '2rem'}}>Why Choose Stamford Members Credit Union?</h2>
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
        <p>1-800-Stamford (24/7 Support)</p>
        
        <h3 style={{marginTop: '1.5rem'}}>✉️ Email</h3>
        <p>support@Stamford.com</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🏢 Address</h3>
        <p>123 Banking Street<br/>Financial District<br/>New York, NY 10004</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🕒 Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 4:00 PM<br/>Sunday: Closed</p>
      </div>
    </div>
  </div>
);


// Login Page with CAPTCHA
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Generate random CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verify CAPTCHA first
    if (captchaInput !== captchaCode) {
      setError('Invalid CAPTCHA code. Please try again.');
      generateCaptcha();
      return;
    }
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
      generateCaptcha(); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '500px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem', textAlign: 'center'}}>Welcome Back</h1>
        
        <p style={{textAlign: 'center', marginBottom: '2rem', color: '#666'}}>
          Please verify you are not a robot by entering the code below. 
          This will enable you to access Stamford Online Banking.
        </p>

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

          {/* CAPTCHA Section */}
          <div className="form-group">
            <label>Verification Code</label>
            <div style={{
              background: '#4169e1',
              padding: '1.5rem',
              borderRadius: '5px',
              textAlign: 'center',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '10px',
                fontFamily: 'monospace',
                userSelect: 'none',
                transform: 'skew(-5deg)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {captchaCode}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
                title="Refresh CAPTCHA"
              >
                🔄
              </button>
            </div>
            <input
              type="text"
              className="form-control"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Enter code above"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>

          <p style={{textAlign: 'center', marginTop: '1.5rem'}}>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};
// Signup Page
// Enhanced Signup Page with Full Registration Form
const SignupPage = () => {
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    dateOfBirth: '',
    houseAddress: '',
    phoneNumber: '',
    email: '',
    
    // Employment
    occupation: '',
    annualIncome: '',
    
    // Banking
    accountType: '',
    accountCurrency: 'USD',
    twoFactorPin: '',
    password: '',
    confirmPassword: '',
    passportPhoto: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, passportPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
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

    if (!formData.twoFactorPin || formData.twoFactorPin.length !== 4) {
      setError('2FA PIN must be 4 digits');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
      
      const data = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          ...formData
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
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '900px'}}>
      <div className="card">
        <div style={{background: '#4169e1', color: 'white', padding: '1.5rem', marginBottom: '2rem', borderRadius: '8px', textAlign: 'center'}}>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>
            👥 Kindly provide the information requested below to enable us create an account for you.
          </h1>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Personal Details</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Middle Name</label>
              <input
                type="text"
                name="middleName"
                className="form-control"
                placeholder="Optional"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h4 style={{marginTop: '2rem', marginBottom: '1rem'}}>Address</h4>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Country *</label>
              <select
                name="country"
                className="form-control"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Nigeria">Nigeria</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                className="form-control"
                placeholder="Select State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                className="form-control"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Zip Code *</label>
              <input
                type="text"
                name="zipCode"
                className="form-control"
                placeholder="zipcode/postal code"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                className="form-control"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>House Address *</label>
              <input
                type="text"
                name="houseAddress"
                className="form-control"
                placeholder="House address"
                value={formData.houseAddress}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-control"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Employment Information */}
          <h3 style={{color: 'var(--primary-navy)', marginTop: '2rem', marginBottom: '1.5rem'}}>Employment Information</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Occupation *</label>
              <select
                name="occupation"
                className="form-control"
                value={formData.occupation}
                onChange={handleChange}
                required
              >
                <option value="">Select Type of Employment</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Annual Income Range *</label>
              <select
                name="annualIncome"
                className="form-control"
                value={formData.annualIncome}
                onChange={handleChange}
                required
              >
                <option value="">Select Salary Range</option>
                <option value="Under $25,000">Under $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                <option value="Over $100,000">Over $100,000</option>
              </select>
            </div>
          </div>

          {/* Banking Details */}
          <h3 style={{color: 'var(--primary-navy)', marginTop: '2rem', marginBottom: '1.5rem'}}>Banking Details</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Account Type *</label>
              <select
                name="accountType"
                className="form-control"
                value={formData.accountType}
                onChange={handleChange}
                required
              >
                <option value="">Please select Account Type</option>
                <option value="Savings">Savings Account</option>
                <option value="Checking">Checking Account</option>
                <option value="Business">Business Account</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Account Currency *</label>
              <select
                name="accountCurrency"
                className="form-control"
                value={formData.accountCurrency}
                onChange={handleChange}
                required
              >
                <option value="USD">America (United States) Dollars – USD</option>
                <option value="GBP">British Pounds – GBP</option>
                <option value="EUR">Euro – EUR</option>
                <option value="CAD">Canadian Dollars – CAD</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>2FA PIN *</label>
              <input
                type="password"
                name="twoFactorPin"
                className="form-control"
                placeholder="••••"
                value={formData.twoFactorPin}
                onChange={handleChange}
                maxLength="4"
                required
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Password *</label>
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
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Passport Photograph *</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {formData.passportPhoto && (
                <img 
                  src={formData.passportPhoto} 
                  alt="Preview" 
                  style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '5px'}}
                />
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{padding: '0.75rem 2rem'}}>
              {loading ? 'Creating Account...' : 'Submit'}
            </button>
            <button type="button" className="btn" style={{background: '#ff6b6b', color: 'white', padding: '0.75rem 2rem'}}>
              Reset
            </button>
            <Link to="/login" className="btn btn-secondary" style={{padding: '0.75rem 2rem'}}>
              ← Back
            </Link>
          </div>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '2rem'}}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

// Enhanced Dashboard 
const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        apiCall('/users/balance'),
        apiCall('/users/transactions'),
      ]);
      setBalance(balanceData.data.balance);
      setTransactions(transactionsData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#f5f7fa'}}>
      {/* Sidebar */}
<div style={{
  width: '280px',
  background: 'white',
  padding: '1.5rem 1rem',
  borderRight: '1px solid #e0e0e0',
  position: 'fixed',
  height: '100vh',
  overflowY: 'auto'
}}>
  {/* Logo */}
  <div style={{marginBottom: '1.5rem'}}>
    <h2 style={{color: 'var(--primary-navy)', fontSize: '1.3rem', margin: 0}}>
      Stamford Members Credit Union
    </h2>
  </div>



  {/* Available Balance - COMPACT */}
  <div style={{marginBottom: '1.5rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px'}}>
    <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem'}}>
      AVAILABLE BALANCE
    </p>
    <h1 style={{fontSize: '1.5rem', color: 'var(--primary-navy)', margin: '0.3rem 0'}}>
      {formatCurrency(balance)}
    </h1>
    <p style={{fontSize: '0.85rem', color: '#666', margin: '0.3rem 0'}}>ALL</p>
  </div>

  {/* Action Buttons - COMPACT */}
  <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
    <Link to="/transfer" className="btn btn-primary" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>
      💸 TRANSFER
    </Link>
    <button className="btn btn-danger" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>
      📄 PAY BILLS
    </button>
    <Link to="/pending-withdrawals" className="btn" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem', background: '#9c27b0', color: 'white'}}>
      📋 MY WITHDRAWALS
    </Link>
  </div>

  {/* Menu - COMPACT */}
  <div>
    <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.75rem'}}>
      MENU
    </p>
    
    <Link to="/dashboard" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      background: '#e3f2fd',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#1976d2',
      fontSize: '0.9rem'
    }}>
      <span>📊</span>
      <span style={{fontWeight: 'bold'}}>Dashboard</span>
    </Link>
    
    <Link to="/profile" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#666',
      fontSize: '0.9rem'
    }}>
      <span>👤</span>
      <span>My Account</span>
    </Link>
    
    <Link to="/my-cards" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#666',
      fontSize: '0.9rem'
    }}>
      <span>💳</span>
      <span>My Cards</span>
    </Link>
    
    <Link to="/transfer" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#666',
      fontSize: '0.9rem'
    }}>
      <span>💰</span>
      <span>Send Money</span>
    </Link>
    
    <Link to="/withdraw" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#666',
      fontSize: '0.9rem'
    }}>
      <span>💸</span>
      <span>Withdraw Funds</span>
    </Link>
    
    <Link to="/pending-withdrawals" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      borderRadius: '5px',
      marginBottom: '0.4rem',
      textDecoration: 'none',
      color: '#666',
      fontSize: '0.9rem'
    }}>
      <span>📋</span>
      <span>My Withdrawals</span>
    </Link>
  </div>
</div>
      {/* Main Content */}
      <div style={{marginLeft: '280px', flex: 1, padding: '2rem'}}>
        {/* Header */}
        <div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
}}>
  <div>
    <h1 style={{fontSize: '1.75rem', color: 'var(--primary-navy)', marginBottom: '0.5rem'}}>
      Good Day! {user.fullName}
    </h1>
    <p style={{color: '#666'}}>At a glance summary of your account!</p>
  </div>
  <div style={{display: 'flex', gap: '1rem'}}>
    {/* KYC Button - Only show if not verified */}
    {user.kycStatus === 'not_submitted' && (
      <Link 
        to="/kyc-verification" 
        className="btn"
        style={{
          background: '#ffc107',
          color: '#000',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          border: '2px solid #ff9800'
        }}
      >
        ⚠️ Verify KYC
      </Link>
    )}
    {user.kycStatus === 'pending' && (
      <button 
        className="btn"
        style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          border: '2px solid #ffc107',
          cursor: 'default'
        }}
        disabled
      >
        ⏳ KYC Pending
      </button>
    )}
    {user.kycStatus === 'verified' && (
      <button 
        className="btn"
        style={{
          background: '#d4edda',
          color: '#155724',
          padding: '0.75rem 1.5rem',
          fontWeight: 'bold',
          border: '2px solid #28a745',
          cursor: 'default'
        }}
        disabled
      >
         Verified
      </button>
    )}
    <Link to="/deposit" className="btn btn-primary">Deposit →</Link>
    <Link to="/transfer" className="btn btn-danger">Transfer Fund →</Link>
  </div>
</div>




        


        {/* Overview Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Last Login</h3>
            <p style={{fontSize: '1rem'}}>{new Date().toLocaleDateString('en-US', { 
              month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true 
            })}</p>
          </div>
          <div>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9}}>Available balance</h3>
            <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
              GBP {formatCurrency(balance).replace('$', '')}
            </p>
            <p style={{fontSize: '1.1rem'}}>{user.fullName}</p>
          </div>
          <div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Your IP address</h3>
            <p style={{fontSize: '0.9rem'}}>127.1.1.0</p>
            <p style={{fontSize: '0.9rem'}}>105.112.22.113</p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
         
         {/* EURUSD Mini Widget - LIVE */}
<div style={{
  background: 'white',
  padding: '1.5rem',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
}}>
  <div style={{height: '280px'}}>
    <iframe
      src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22FX%3AEURUSD%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22dateRange%22%3A%226M%22%2C%22colorTheme%22%3A%22dark%22%2C%22trendLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%201)%22%2C%22underLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200.3)%22%2C%22underLineBottomColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22isTransparent%22%3Afalse%2C%22autosize%22%3Afalse%2C%22largeChartUrl%22%3A%22%22%2C%22chartOnly%22%3Afalse%2C%22noTimeScale%22%3Afalse%7D"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '8px'
      }}
      title="EURUSD Mini Chart"
    ></iframe>
  </div>
</div>
          {/* Crypto Currency Account */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>Crypto Currency Account</h3>
              <Link to="/transfer" style={{color: '#1976d2', textDecoration: 'none'}}>Transfer Fund</Link>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e0e0e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                💰
              </div>
              <div>
                <p style={{margin: 0, fontSize: '0.85rem', color: '#666'}}>*****{user.accountNumber.slice(-5)}</p>
                <p style={{margin: '0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold'}}>
                  {formatCurrency(balance)} ALL
                </p>
              </div>
            </div>
          </div>

          {/* Loans */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>Loans and lines of credit</h3>
              <a href="#" style={{color: '#1976d2', textDecoration: 'none'}}>Pay bills</a>
            </div>
            <div style={{display: 'flex', gap: '2rem'}}>
              <div>
                <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>💼 Business Support L...</p>
                <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>0 GBP</p>
              </div>
              <div>
                <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>📊 FICO Credit Score</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>300</p>
                  <div style={{width: '12px', height: '12px', background: '#f44336', borderRadius: '50%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions & Balance Flow */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
          {/* Recent Transactions */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom: '1rem'}}>Recent Transaction Activities</h3>
            {transactions.length === 0 ? (
              <p style={{color: '#666', textAlign: 'center', padding: '2rem'}}>No transactions yet</p>
            ) : (
              <div>
                {transactions.map((txn) => (
                  <div key={txn._id} style={{
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <p style={{margin: 0, fontWeight: 'bold'}}>{txn.description}</p>
                      <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#666'}}>
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p style={{
                      margin: 0,
                      fontWeight: 'bold',
                      color: txn.type === 'credit' ? 'green' : 'red'
                    }}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balance Flow */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom: '1rem'}}>Balance Flow</h3>
            <div style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <p style={{color: '#666'}}>Chart visualization coming soon...</p>
            </div>
            <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#4caf50', borderRadius: '50%'}}></div>
                <span style={{fontSize: '0.9rem'}}>Credit</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#f44336', borderRadius: '50%'}}></div>
                <span style={{fontSize: '0.9rem'}}>Debit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{marginBottom: '1rem'}}>We are here to help you!</h3>
          <p style={{color: '#666', marginBottom: '1.5rem'}}>
            Ask a question or file a support ticket, manage request, report an issues. 
            Our team support team will get back to you by email.
          </p>
          <button className="btn btn-primary">Get Support Now</button>
        </div>
      </div>
    </div>
  );
};
// Enhanced Transfer Page with Tabs
const TransferPage = () => {
  const [activeTab, setActiveTab] = useState('send'); // 'send', 'recipient', 'history'
  const [step, setStep] = useState(1); // Step 1 or Step 2
  const [formData, setFormData] = useState({
    selectedAccount: 'crypto-all',
    transferType: 'local',
    amount: '',
    recipientAccountNumber: '',
    recipientCountry: '',
    swiftCode: '',
    deliveryDate: '',
    description: ''
  });
  const [recipients, setRecipients] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


if (user.kycStatus !== 'verified') {
    return (
      <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <h2 style={{color: '#ff6b6b', marginBottom: '1rem'}}>🔒 KYC Verification Required</h2>
            <p style={{marginBottom: '1.5rem'}}>
              {user.kycStatus === 'not_submitted' && 'You need to complete KYC verification before making transfers.'}
              {user.kycStatus === 'pending' && 'Your KYC documents are under review. Please wait for admin approval.'}
              {user.kycStatus === 'rejected' && 'Your KYC was rejected. Please resubmit with correct documents.'}
            </p>
            {user.kycStatus === 'not_submitted' && (
              <Link to="/kyc-verification" className="btn btn-primary">
                Complete KYC Verification
              </Link>
            )}
            {user.kycStatus === 'pending' && (
              <div style={{background: '#fff3cd', padding: '1rem', borderRadius: '5px'}}>
                ⏳ Verification in progress. You'll be notified once approved.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getFee = () => {
    const amount = parseFloat(formData.amount) || 0;
    if (formData.transferType === 'local') return 0;
    return amount * 0.02; // 2% for cross-border
  };

  const handleContinueStep1 = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) < 5) {
      setError('Minimum transfer amount is 5.00 GBP');
      return;
    }
    setStep(2);
    setError('');
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
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '900px'}}>
      {/* Currency Ticker */}
      <div style={{
        background: '#f8f9fa',
        padding: '0.5rem',
        marginBottom: '1rem',
        overflow: 'hidden',
        borderRadius: '5px',
        fontSize: '0.85rem'
      }}>
        <div style={{display: 'flex', gap: '2rem', animation: 'scroll 20s linear infinite'}}>
          <span>GBP/CAD = <strong style={{color: 'green'}}>1.81309 ▲</strong></span>
          <span>GBP/USD = <strong style={{color: 'green'}}>1.33603 ▲</strong></span>
          <span>GBP/NZD = <strong style={{color: 'red'}}>2.25888 ▼</strong></span>
          <span>GBP/TRY = <strong style={{color: 'green'}}>58.89765 ▲</strong></span>
          <span>GBP/DKK = <strong style={{color: 'green'}}>8.63386 ▲</strong></span>
        </div>
      </div>

      <div className="card">
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: '#2ecc71', fontSize: '2rem', marginBottom: '0.5rem'}}>
            PAY FOR GOODS AND SERVICES
          </h1>
          <h2 style={{color: 'var(--primary-navy)', fontSize: '1.5rem'}}>
            Stamford Members Credit Online Banking Transfer
          </h2>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '2rem',
          background: '#4169e1',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => { setActiveTab('send'); setStep(1); }}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'send' ? '#2952cc' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            💸 Send Money
          </button>
          <button
            onClick={() => setActiveTab('recipient')}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'recipient' ? '#2952cc' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            📋 Add a Recipient
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={{
              flex: 1,
              padding: '1rem',
              background: activeTab === 'history' ? '#2952cc' : 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 History
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Send Money Tab */}
        {activeTab === 'send' && step === 1 && (
          <form onSubmit={handleContinueStep1}>
            <div className="form-group">
              <label>Select Account</label>
              <select
                name="selectedAccount"
                className="form-control"
                value={formData.selectedAccount}
                onChange={handleChange}
                required
              >
                <option value="crypto-all">💰 Crypto Currency Account (ALL) - Balance: ALL 0</option>
                <option value="gbp">£ GBP Account - Balance: GBP 0</option>
              </select>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{fontWeight: 'bold', marginBottom: '0.5rem', display: 'block'}}>
                Amount to Transfer
              </label>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                <span>Daily Transfer Limit:</span>
                <strong>ALL0.00 OF ALL5,000.00</strong>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="5"
                  required
                  style={{flex: 1}}
                />
                <span style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--light-gray)',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}>GBP</span>
              </div>
              <div style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>
                <div>Minimum: 5.00 GBP</div>
                <div>1 GBP = 110.71 ALL</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
              Continue to next step
            </button>

            <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', fontStyle: 'italic'}}>
              Note: our transfer fee is included.
            </p>
          </form>
        )}

        {/* Step 2: Recipient Details */}
        {activeTab === 'send' && step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select a Recipient</label>
              <select
                name="recipientAccountNumber"
                className="form-control"
                value={formData.recipientAccountNumber}
                onChange={handleChange}
                required
              >
                <option value="">No recipient has been added</option>
                <option value="ACC-002">Jane Smith - ACC-002</option>
                <option value="ACC-003">Bob Wilson - ACC-003</option>
              </select>
            </div>

            <div className="form-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                className="form-control"
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{fontWeight: 'bold', marginBottom: '0.5rem', display: 'block'}}>Amount</label>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                <span>Daily Transfer Limit:</span>
                <strong>ALL0.00 OF ALL5,000.00</strong>
              </div>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input
                  type="number"
                  className="form-control"
                  value={formData.amount}
                  readOnly
                  style={{flex: 1, background: '#f8f9fa'}}
                />
                <span style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--light-gray)',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold'
                }}>GBP</span>
              </div>
              <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>
                *Cross-border transfer fee will be deducted
              </p>
            </div>

            <div className="form-group">
              <label>Description (Reason)</label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary"
                style={{flex: 1}}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{flex: 1}}
              >
                {loading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {/* Add Recipient Tab */}
        {activeTab === 'recipient' && (
          <div style={{padding: '2rem', textAlign: 'center'}}>
            <h3>Add a New Recipient</h3>
            <p>Loading...</p>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{padding: '2rem', textAlign: 'center'}}>
            <h3>Transfer History</h3>
            <p>Loading...</p>
          </div>
        )}
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


// Professional Profile Page with Photo and KYC Status
const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '1000px'}}>
      <div className="card" style={{padding: '3rem'}}>
        {/* Header with Photo */}
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          {user?.passportPhoto ? (
            <img 
              src={user.passportPhoto} 
              alt={user.fullName}
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '5px solid var(--primary-navy)',
                marginBottom: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          ) : (
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {user?.fullName?.charAt(0)}
            </div>
          )}
          
          <h1 style={{fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem'}}>
            {user?.fullName}
          </h1>
          
          <p style={{color: '#666', fontSize: '1.1rem', marginBottom: '1rem'}}>{user?.email}</p>
          
          {/* KYC Status Badge */}
          <div style={{marginTop: '1rem'}}>
            {user?.kycStatus === 'verified' && (
              <span style={{
                padding: '0.5rem 1.5rem',
                background: '#10b981',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                ✅ Verified Account
              </span>
            )}
            {user?.kycStatus === 'pending' && (
              <span style={{
                padding: '0.5rem 1.5rem',
                background: '#f0b90b',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                ⏳ KYC Pending Review
              </span>
            )}
            {user?.kycStatus === 'not_submitted' && (
              <Link to="/kyc-verification" style={{
                padding: '0.5rem 1.5rem',
                background: '#ff6b6b',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                ⚠️ Complete KYC Verification
              </Link>
            )}
            {user?.kycStatus === 'rejected' && (
              <span style={{
                padding: '0.5rem 1.5rem',
                background: '#dc3545',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                ❌ KYC Rejected
              </span>
            )}
          </div>
        </div>

        <hr style={{margin: '2rem 0', border: 'none', borderTop: '2px solid #f0f0f0'}} />

        {/* Account Information Grid */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
          <div>
            <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Account Details</h3>
            
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Account Number</label>
              <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-navy)'}}>{user?.accountNumber}</p>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Account Type</label>
              <p style={{fontSize: '1.1rem', color: '#333'}}>{user?.accountType || 'Standard Account'}</p>
            </div>

            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Currency</label>
              <p style={{fontSize: '1.1rem', color: '#333'}}>{user?.accountCurrency || 'USD'}</p>
            </div>

            <div>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Account Status</label>
              <span style={{
                padding: '0.5rem 1rem',
                background: user?.status === 'active' ? '#10b981' : '#dc3545',
                color: 'white',
                borderRadius: '15px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {user?.status === 'active' ? '✓ Active' : '✗ Suspended'}
              </span>
            </div>
          </div>

          <div>
            <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Personal Information</h3>
            
            {user?.phoneNumber && (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Phone Number</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{user.phoneNumber}</p>
              </div>
            )}

            {user?.country && (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Country</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{user.country}</p>
              </div>
            )}

            {user?.occupation && (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Occupation</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{user.occupation}</p>
              </div>
            )}

            {user?.createdAt && (
              <div>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Member Since</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>

        <hr style={{margin: '2rem 0', border: 'none', borderTop: '2px solid #f0f0f0'}} />

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
          <Link to="/dashboard" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>
            Back to Dashboard
          </Link>
          {user?.kycStatus === 'not_submitted' && (
            <Link to="/kyc-verification" className="btn btn-success" style={{padding: '0.75rem 2rem'}}>
              Complete KYC Now
            </Link>
          )}
        </div>
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

  if (user.kycStatus !== 'verified') {
    return (
      <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
        <div className="card">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <h2 style={{color: '#ff6b6b', marginBottom: '1rem'}}>🔒 KYC Verification Required</h2>
            <p style={{marginBottom: '1.5rem'}}>
              {user.kycStatus === 'not_submitted' && 'You need to complete KYC verification before withdrawing.'}
              {user.kycStatus === 'pending' && 'Your KYC documents are under review. Please wait for admin approval.'}
              {user.kycStatus === 'rejected' && 'Your KYC was rejected. Please resubmit with correct documents.'}
            </p>
            {user.kycStatus === 'not_submitted' && (
              <Link to="/kyc-verification" className="btn btn-primary">
                Complete KYC Verification
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
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
    autoComplete="off"
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
    autoComplete="off"
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
              autoComplete="off"
              required
            />
          </div>

            {   }

          <div style={{background: 'var(--light-gray)', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
            <p><strong>Withdrawal Fee:</strong> ${transferType === 'card' ? '10.00' : '5.00'}</p>
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




// Enhanced Admin Dashboard with Full User Details
// Enhanced Admin Dashboard with Fund Feature
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundingUser, setFundingUser] = useState(null);

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

  const handleFundUser = async (user) => {
    setFundingUser(user);
    setShowFundModal(true);
    setFundAmount('');
  };

  const submitFunding = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await apiCall(`/admin/users/${fundingUser._id}/fund`, {
        method: 'PUT',
        body: JSON.stringify({ amount: parseFloat(fundAmount) })
      });
      
      alert(`Successfully funded ${fundingUser.fullName} with $${fundAmount}`);
      setShowFundModal(false);
      setFundAmount('');
      setFundingUser(null);
      fetchData(); // Refresh data
    } catch (error) {
      alert('Error funding user: ' + error.message);
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
    if (window.confirm('⚠️ DELETE USER PERMANENTLY?\n\nThis will:\n- Delete the user account\n- Remove all their data\n- Cannot be undone\n\nAre you absolutely sure?')) {
      try {
        await apiCall(`/admin/users/${userId}`, {
          method: 'DELETE',
        });
        alert('✅ User deleted successfully!');
        fetchData(); // This will refresh and remove user from list
      } catch (error) {
        alert('Error deleting user: ' + error.message);
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

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard fade-in">
      <div className="container" style={{padding: '3rem 0'}}>
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Admin Dashboard</h1>
        
        {/* KYC Review Link */}
        <Link to="/admin/kyc" className="btn btn-primary" style={{marginBottom: '2rem'}}>
          📋 Review KYC Requests
        </Link>

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

        {/* Withdrawal Requests Section - KEEPING AS IS */}
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

        {/* All Users Section - UPDATED WITH FUND BUTTON */}
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>All Users</h2>
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name & Email</th>
                  <th>Account Info</th>
                  <th>Location</th>
                  <th>Employment</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.passportPhoto ? (
                        <img 
                          src={user.passportPhoto} 
                          alt={user.fullName}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => viewUserDetails(user)}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: '#e0e0e0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          👤
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{user.fullName}</strong><br/>
                      <small>{user.email}</small><br/>
                      <small>📞 {user.phoneNumber || 'N/A'}</small>
                    </td>
                    <td>
                      <small>
                        <strong>Acc#:</strong> {user.accountNumber}<br/>
                        <strong>Type:</strong> {user.accountType || 'N/A'}<br/>
                        <strong>Currency:</strong> {user.accountCurrency || 'USD'}
                      </small>
                    </td>
                    <td>
                      <small>
                        {user.city && user.state ? `${user.city}, ${user.state}` : 'N/A'}<br/>
                        {user.country || 'N/A'}<br/>
                        {user.zipCode || ''}
                      </small>
                    </td>
                    <td>
                      <small>
                        <strong>{user.occupation || 'N/A'}</strong><br/>
                        {user.annualIncome || 'N/A'}
                      </small>
                    </td>
                    <td>
                      <strong>{formatCurrency(user.balance)}</strong>
                    </td>
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
                      <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                        <button 
                          onClick={() => handleFundUser(user)}
                          className="btn btn-success"
                          style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                        >
                          💰 Fund User
                        </button>
                        <button 
                          onClick={() => viewUserDetails(user)}
                          className="btn btn-primary"
                          style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                        >
                          View Details
                        </button>
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
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fund User Modal */}
        {showFundModal && fundingUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowFundModal(false)}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{marginBottom: '1.5rem'}}>💰 Fund User Account</h2>
              
              <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
                <p><strong>User:</strong> {fundingUser.fullName}</p>
                <p><strong>Email:</strong> {fundingUser.email}</p>
                <p><strong>Current Balance:</strong> {formatCurrency(fundingUser.balance)}</p>
              </div>

              <div className="form-group">
                <label>Amount to Fund</label>
                <input
                  type="number"
                  className="form-control"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0.01"
                />
              </div>

              {fundAmount && (
                <div style={{background: '#e7f5ff', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
                  <p><strong>New Balance:</strong> {formatCurrency(parseFloat(fundingUser.balance) + parseFloat(fundAmount || 0))}</p>
                </div>
              )}

              <div style={{display: 'flex', gap: '1rem'}}>
                <button 
                  onClick={submitFunding}
                  className="btn btn-success"
                  style={{flex: 1, padding: '0.75rem'}}
                >
                  Confirm Funding
                </button>
                <button 
                  onClick={() => {
                    setShowFundModal(false);
                    setFundAmount('');
                    setFundingUser(null);
                  }}
                  className="btn btn-secondary"
                  style={{flex: 1, padding: '0.75rem'}}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal - KEEP AS IS */}
        {showUserModal && selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setShowUserModal(false)}
          >
            <div 
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h2 style={{margin: 0}}>User Details</h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem'}}>
                {/* Passport Photo */}
                <div>
                  {selectedUser.passportPhoto ? (
                    <img 
                      src={selectedUser.passportPhoto} 
                      alt={selectedUser.fullName}
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                      background: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem'
                    }}>
                      👤
                    </div>
                  )}
                </div>

                {/* User Information */}
                <div>
                  <h3 style={{marginTop: 0, color: 'var(--primary-navy)'}}>Personal Information</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <strong>Full Name:</strong><br/>
                      {selectedUser.fullName}
                    </div>
                    <div>
                      <strong>Email:</strong><br/>
                      {selectedUser.email}
                    </div>
                    <div>
                      <strong>Phone:</strong><br/>
                      {selectedUser.phoneNumber || 'N/A'}
                    </div>
                    <div>
                      <strong>Date of Birth:</strong><br/>
                      {selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Address</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <strong>House Address:</strong><br/>
                      {selectedUser.houseAddress || 'N/A'}
                    </div>
                    <div>
                      <strong>City:</strong><br/>
                      {selectedUser.city || 'N/A'}
                    </div>
                    <div>
                      <strong>State:</strong><br/>
                      {selectedUser.state || 'N/A'}
                    </div>
                    <div>
                      <strong>Zip Code:</strong><br/>
                      {selectedUser.zipCode || 'N/A'}
                    </div>
                    <div>
                      <strong>Country:</strong><br/>
                      {selectedUser.country || 'N/A'}
                    </div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Employment</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <strong>Occupation:</strong><br/>
                      {selectedUser.occupation || 'N/A'}
                    </div>
                    <div>
                      <strong>Annual Income:</strong><br/>
                      {selectedUser.annualIncome || 'N/A'}
                    </div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Banking Information</h3>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <div>
                      <strong>Account Number:</strong><br/>
                      {selectedUser.accountNumber}
                    </div>
                    <div>
                      <strong>Account Type:</strong><br/>
                      {selectedUser.accountType || 'N/A'}
                    </div>
                    <div>
                      <strong>Currency:</strong><br/>
                      {selectedUser.accountCurrency || 'USD'}
                    </div>
                    <div>
                      <strong>Balance:</strong><br/>
                      <strong style={{fontSize: '1.2rem', color: 'green'}}>{formatCurrency(selectedUser.balance)}</strong>
                    </div>
                    <div>
                      <strong>Status:</strong><br/>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        background: selectedUser.status === 'active' ? 'var(--success)' : 'var(--danger)',
                        color: 'white',
                        fontSize: '0.85rem'
                      }}>
                        {selectedUser.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <strong>Joined:</strong><br/>
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{marginTop: '2rem', textAlign: 'right'}}>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="btn btn-secondary"
                  style={{padding: '0.75rem 2rem'}}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// KYC Verification Page
const KYCVerificationPage = () => {
  const [documents, setDocuments] = useState({
    idCardFront: '',
    idCardBack: '',
    proofOfAddress: '',
    selfieWithId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments({ ...documents, [docType]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!documents.idCardFront || !documents.idCardBack || !documents.proofOfAddress || !documents.selfieWithId) {
      setError('Please upload all required documents');
      return;
    }

    setLoading(true);

    try {
      await apiCall('/users/submit-kyc', {
        method: 'POST',
        body: JSON.stringify({ documents }),
      });

      setSuccess('KYC documents submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '900px'}}>
      <div className="card">
        <div style={{background: '#4169e1', color: 'white', padding: '1.5rem', marginBottom: '2rem', borderRadius: '8px', textAlign: 'center'}}>
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>
            🛡️ KYC Verification Required
          </h1>
          <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem'}}>
            Please submit the following documents to verify your identity
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
            {/* ID Card Front */}
            <div>
              <h3 style={{marginBottom: '1rem'}}>📄 ID Card (Front)</h3>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, 'idCardFront')}
                accept="image/*"
                required
              />
              {documents.idCardFront && (
                <img 
                  src={documents.idCardFront} 
                  alt="ID Front" 
                  style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}}
                />
              )}
            </div>

            {/* ID Card Back */}
            <div>
              <h3 style={{marginBottom: '1rem'}}>📄 ID Card (Back)</h3>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, 'idCardBack')}
                accept="image/*"
                required
              />
              {documents.idCardBack && (
                <img 
                  src={documents.idCardBack} 
                  alt="ID Back" 
                  style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}}
                />
              )}
            </div>

            {/* Proof of Address */}
            <div>
              <h3 style={{marginBottom: '1rem'}}>🏠 Proof of Address</h3>
              <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
                Utility bill, bank statement, or government letter
              </p>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, 'proofOfAddress')}
                accept="image/*,application/pdf"
                required
              />
              {documents.proofOfAddress && (
                <img 
                  src={documents.proofOfAddress} 
                  alt="Proof of Address" 
                  style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}}
                />
              )}
            </div>

            {/* Selfie with ID */}
            <div>
              <h3 style={{marginBottom: '1rem'}}>🤳 Selfie with ID</h3>
              <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>
                Hold your ID next to your face
              </p>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleFileChange(e, 'selfieWithId')}
                accept="image/*"
                required
              />
              {documents.selfieWithId && (
                <img 
                  src={documents.selfieWithId} 
                  alt="Selfie" 
                  style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}}
                />
              )}
            </div>
          </div>

          <div style={{background: '#fff3cd', padding: '1rem', borderRadius: '5px', marginBottom: '2rem'}}>
            <strong>⚠️ Important:</strong>
            <ul style={{marginLeft: '1.5rem', marginTop: '0.5rem'}}>
              <li>All documents must be clear and readable</li>
              <li>Your face and ID details must be visible in the selfie</li>
              <li>Documents should be recent (issued within last 3 months)</li>
              <li>Verification typically takes 24-48 hours</li>
            </ul>
          </div>

          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{padding: '0.75rem 2rem'}}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary" style={{padding: '0.75rem 2rem'}}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};


// Admin KYC Review Page
const AdminKYCReviewPage = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCRequests();
  }, []);

  const fetchKYCRequests = async () => {
    try {
      const data = await apiCall('/admin/kyc-requests');
      setKycRequests(data.data);
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (window.confirm('Approve this KYC verification?')) {
      try {
        await apiCall(`/admin/kyc/${userId}/approve`, {
          method: 'PUT'
        });
        alert('KYC approved successfully!');
        fetchKYCRequests();
        setShowModal(false);
      } catch (error) {
        alert('Error approving KYC');
      }
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await apiCall(`/admin/kyc/${userId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason: rejectionReason })
      });
      alert('KYC rejected');
      fetchKYCRequests();
      setShowModal(false);
      setRejectionReason('');
    } catch (error) {
      alert('Error rejecting KYC');
    }
  };

  const viewDocuments = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container fade-in" style={{padding: '3rem 0'}}>
      <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>KYC Verification Requests</h1>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kycRequests.map((user) => (
              <tr key={user._id}>
                <td>
                  <strong>{user.fullName}</strong><br/>
                  <small>{user.accountNumber}</small>
                </td>
                <td>{user.email}</td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '15px',
                    background: 
                      user.kycStatus === 'verified' ? '#10b981' :
                      user.kycStatus === 'pending' ? '#f0b90b' :
                      user.kycStatus === 'rejected' ? '#dc3545' : '#666',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}>
                    {user.kycStatus.toUpperCase()}
                  </span>
                </td>
                <td>{user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    onClick={() => viewDocuments(user)}
                    className="btn btn-primary"
                    style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                  >
                    Review Documents
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {kycRequests.length === 0 && (
          <p style={{textAlign: 'center', padding: '2rem'}}>No KYC requests</p>
        )}
      </div>

      {/* KYC Documents Review Modal */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflowY: 'auto'
        }}
        onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '2rem',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{margin: 0}}>KYC Documents Review - {selectedUser.fullName}</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>

            {/* User Info Summary */}
            <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                <div>
                  <strong>Full Name:</strong><br/>
                  {selectedUser.fullName}
                </div>
                <div>
                  <strong>Email:</strong><br/>
                  {selectedUser.email}
                </div>
                <div>
                  <strong>Phone:</strong><br/>
                  {selectedUser.phoneNumber || 'N/A'}
                </div>
                <div>
                  <strong>Address:</strong><br/>
                  {selectedUser.houseAddress || 'N/A'}
                </div>
                <div>
                  <strong>City, State:</strong><br/>
                  {selectedUser.city}, {selectedUser.state}
                </div>
                <div>
                  <strong>Country:</strong><br/>
                  {selectedUser.country || 'N/A'}
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
              {/* ID Card Front */}
              <div>
                <h3>📄 ID Card (Front)</h3>
                {selectedUser.kycDocuments?.idCardFront ? (
                  <img 
                    src={selectedUser.kycDocuments.idCardFront}
                    alt="ID Front"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.idCardFront, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              {/* ID Card Back */}
              <div>
                <h3>📄 ID Card (Back)</h3>
                {selectedUser.kycDocuments?.idCardBack ? (
                  <img 
                    src={selectedUser.kycDocuments.idCardBack}
                    alt="ID Back"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.idCardBack, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              {/* Proof of Address */}
              <div>
                <h3>🏠 Proof of Address</h3>
                {selectedUser.kycDocuments?.proofOfAddress ? (
                  <img 
                    src={selectedUser.kycDocuments.proofOfAddress}
                    alt="Proof of Address"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.proofOfAddress, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              {/* Selfie with ID */}
              <div>
                <h3>🤳 Selfie with ID</h3>
                {selectedUser.kycDocuments?.selfieWithId ? (
                  <img 
                    src={selectedUser.kycDocuments.selfieWithId}
                    alt="Selfie"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.selfieWithId, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>
            </div>

            {/* Rejection Reason Input */}
            {selectedUser.kycStatus === 'pending' && (
              <div style={{marginBottom: '2rem'}}>
                <label style={{fontWeight: 'bold', marginBottom: '0.5rem', display: 'block'}}>
                  Rejection Reason (if rejecting):
                </label>
                <textarea
                  className="form-control"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows="3"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              {selectedUser.kycStatus === 'pending' && (
                <>
                  <button 
                    onClick={() => handleApprove(selectedUser._id)}
                    className="btn btn-success"
                    style={{padding: '0.75rem 2rem'}}
                  >
                    ✅ Approve KYC
                  </button>
                  <button 
                    onClick={() => handleReject(selectedUser._id)}
                    className="btn btn-danger"
                    style={{padding: '0.75rem 2rem'}}
                  >
                    ❌ Reject KYC
                  </button>
                </>
              )}
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
                style={{padding: '0.75rem 2rem'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/transfer" element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><DepositPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-cards" element={<ProtectedRoute><MyCardsPage /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><WithdrawPage /></ProtectedRoute>} />
            <Route path="/atm-withdraw" element={<ProtectedRoute><ATMWithdrawPage /></ProtectedRoute>} />
            <Route path="/request-card" element={<ProtectedRoute><RequestCardPage /></ProtectedRoute>} />
            <Route path="/pending-withdrawals" element={<ProtectedRoute><PendingWithdrawalsPage /></ProtectedRoute>} />
            <Route path="/kyc-verification" element={<ProtectedRoute><KYCVerificationPage /></ProtectedRoute>} />
            <Route path="/admin/kyc" element={<ProtectedRoute adminOnly><AdminKYCReviewPage /></ProtectedRoute>} />
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


   