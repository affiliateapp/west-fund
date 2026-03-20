import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/constants';

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
            <select className="form-control" value={cardType} onChange={(e) => setCardType(e.target.value)}>
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
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Request Card'}
            </button>
            <Link to="/my-cards" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCardPage;
