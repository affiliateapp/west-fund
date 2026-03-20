import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiCall } from '../utils/api';

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
            <input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0.01" required />
          </div>
          <div className="form-group">
            <label>Description (Optional)</label>
            <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Processing...' : 'Deposit'}</button>
            <Link to="/dashboard" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositPage;
