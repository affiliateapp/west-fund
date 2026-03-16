import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    if (captchaInput !== captchaCode) {
      setError('Invalid CAPTCHA code. Please try again.');
      generateCaptcha();
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

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

export default LoginPage;