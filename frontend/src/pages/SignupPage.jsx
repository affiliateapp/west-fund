import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/api';

const SignupPage = () => {
  const [formData, setFormData] = useState({
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
    occupation: '',
    annualIncome: '',
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
          <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Personal Details</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" name="firstName" className="form-control" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" name="middleName" className="form-control" placeholder="Optional" value={formData.middleName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" className="form-control" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <h4 style={{marginTop: '2rem', marginBottom: '1rem'}}>Address</h4>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Country *</label>
              <select name="country" className="form-control" value={formData.country} onChange={handleChange} required>
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
              <input type="text" name="state" className="form-control" placeholder="Select State" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" className="form-control" placeholder="City" value={formData.city} onChange={handleChange} required />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Zip Code *</label>
              <input type="text" name="zipCode" className="form-control" placeholder="zipcode/postal code" value={formData.zipCode} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dateOfBirth" className="form-control" value={formData.dateOfBirth} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>House Address *</label>
              <input type="text" name="houseAddress" className="form-control" placeholder="House address" value={formData.houseAddress} onChange={handleChange} required />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="phoneNumber" className="form-control" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <h3 style={{color: 'var(--primary-navy)', marginTop: '2rem', marginBottom: '1.5rem'}}>Employment Information</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Occupation *</label>
              <select name="occupation" className="form-control" value={formData.occupation} onChange={handleChange} required>
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
              <select name="annualIncome" className="form-control" value={formData.annualIncome} onChange={handleChange} required>
                <option value="">Select Salary Range</option>
                <option value="Under $25,000">Under $25,000</option>
                <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                <option value="Over $100,000">Over $100,000</option>
              </select>
            </div>
          </div>

          <h3 style={{color: 'var(--primary-navy)', marginTop: '2rem', marginBottom: '1.5rem'}}>Banking Details</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
            <div className="form-group">
              <label>Account Type *</label>
              <select name="accountType" className="form-control" value={formData.accountType} onChange={handleChange} required>
                <option value="">Please select Account Type</option>
                <option value="Savings">Savings Account</option>
                <option value="Checking">Checking Account</option>
                <option value="Business">Business Account</option>
              </select>
            </div>
            <div className="form-group">
              <label>Account Currency *</label>
              <select name="accountCurrency" className="form-control" value={formData.accountCurrency} onChange={handleChange} required>
                <option value="USD">America (United States) Dollars – USD</option>
                <option value="GBP">British Pounds – GBP</option>
                <option value="EUR">Euro – EUR</option>
                <option value="CAD">Canadian Dollars – CAD</option>
              </select>
            </div>
            <div className="form-group">
              <label>2FA PIN *</label>
              <input type="password" name="twoFactorPin" className="form-control" placeholder="••••" value={formData.twoFactorPin} onChange={handleChange} maxLength="4" required />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem'}}>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Passport Photograph *</label>
              <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" required />
              {formData.passportPhoto && (
                <img src={formData.passportPhoto} alt="Preview" style={{width: '100px', height: '100px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '5px'}} />
              )}
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
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

export default SignupPage;
