import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/constants';

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
              {user.kycStatus === 'pending' && 'Your KYC documents are under review.'}
            </p>
            {user.kycStatus === 'not_submitted' && (<Link to="/kyc-verification" className="btn btn-primary">Complete KYC Verification</Link>)}
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
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}`},
        body: JSON.stringify({amount: parseFloat(amount), transferType, cardNumber, cardHolder, expiryDate, bankName, cardCVC, cardPin})
      });
      const data = await response.json();
      if (data.success) {
        alert('Withdrawal request submitted!');
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
          <div className="form-group"><label>Amount</label><input type="number" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="1" required /></div>
          <div className="form-group"><label>Transfer Type</label><select className="form-control" value={transferType} onChange={(e) => setTransferType(e.target.value)}><option value="card">💳 Card Transfer (Instant - Fee: $10)</option><option value="bank">🏦 Bank Account (2-3 days - Fee: $5)</option></select></div>
          <div className="form-group"><label>Card Number</label><input type="text" className="form-control" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" autoComplete="off" required /></div>
          <div className="form-group"><label>Card Holder Name</label><input type="text" className="form-control" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="John Doe" autoComplete="off" required /></div>
          <div className="form-group"><label>Expiry Date</label><input type="text" className="form-control" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="MM/YY" autoComplete="off" required /></div>
          <div className="form-group"><label>Card CVC</label><input type="text" className="form-control" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} placeholder="123" maxLength="3" autoComplete="off" required /></div>
          <div className="form-group"><label>Card PIN</label><input type="password" className="form-control" value={cardPin} onChange={(e) => setCardPin(e.target.value)} placeholder="****" maxLength="4" autoComplete="off" required /></div>
          <div className="form-group"><label>Bank Name</label><input type="text" className="form-control" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Chase Bank" autoComplete="off" required /></div>
          <div style={{background: 'var(--light-gray)', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
            <p><strong>Withdrawal Fee:</strong> ${transferType === 'card' ? '10.00' : '5.00'}</p>
            <p><strong>You will receive:</strong> ${amount ? (parseFloat(amount)).toFixed(2) : '0.00'}</p>
            <p><strong>Total deducted:</strong> ${amount ? (parseFloat(amount) + (transferType === 'card' ? 10 : 5)).toFixed(2) : '0.00'}</p>
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Submit Withdrawal Request'}</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;