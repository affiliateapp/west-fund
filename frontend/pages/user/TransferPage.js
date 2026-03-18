import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/api';

const TransferPage = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [step, setStep] = useState(1);
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
              <Link to="/kyc-verification" className="btn btn-primary">Complete KYC Verification</Link>
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
      <div style={{background: '#f8f9fa', padding: '0.5rem', marginBottom: '1rem', overflow: 'hidden', borderRadius: '5px', fontSize: '0.85rem'}}>
        <div style={{display: 'flex', gap: '2rem', animation: 'scroll 20s linear infinite'}}>
          <span>GBP/CAD = <strong style={{color: 'green'}}>1.81309 ▲</strong></span>
          <span>GBP/USD = <strong style={{color: 'green'}}>1.33603 ▲</strong></span>
          <span>GBP/NZD = <strong style={{color: 'red'}}>2.25888 ▼</strong></span>
        </div>
      </div>

      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: '#2ecc71', fontSize: '2rem', marginBottom: '0.5rem'}}>PAY FOR GOODS AND SERVICES</h1>
          <h2 style={{color: 'var(--primary-navy)', fontSize: '1.5rem'}}>Stamford Members Credit Online Banking Transfer</h2>
        </div>

        <div style={{display: 'flex', gap: '0', marginBottom: '2rem', background: '#4169e1', borderRadius: '5px', overflow: 'hidden'}}>
          <button onClick={() => { setActiveTab('send'); setStep(1); }} style={{flex: 1, padding: '1rem', background: activeTab === 'send' ? '#2952cc' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>💸 Send Money</button>
          <button onClick={() => setActiveTab('recipient')} style={{flex: 1, padding: '1rem', background: activeTab === 'recipient' ? '#2952cc' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>📋 Add a Recipient</button>
          <button onClick={() => setActiveTab('history')} style={{flex: 1, padding: '1rem', background: activeTab === 'history' ? '#2952cc' : 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>🔄 History</button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {activeTab === 'send' && step === 1 && (
          <form onSubmit={handleContinueStep1}>
            <div className="form-group">
              <label>Select Account</label>
              <select name="selectedAccount" className="form-control" value={formData.selectedAccount} onChange={handleChange} required>
                <option value="crypto-all">💰 Crypto Currency Account (ALL)</option>
                <option value="gbp">£ GBP Account</option>
              </select>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{fontWeight: 'bold', marginBottom: '0.5rem', display: 'block'}}>Amount to Transfer</label>
              <div style={{display: 'flex', gap: '1rem'}}>
                <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} step="0.01" min="5" required style={{flex: 1}} />
                <span style={{padding: '0.5rem 1rem', background: 'var(--light-gray)', borderRadius: '5px', display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>GBP</span>
              </div>
              <div style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem'}}>Minimum: 5.00 GBP</div>
            </div>
            <button type="submit" className="btn btn-primary" style={{width: '100%'}}>Continue to next step</button>
          </form>
        )}

        {activeTab === 'send' && step === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select a Recipient</label>
              <select name="recipientAccountNumber" className="form-control" value={formData.recipientAccountNumber} onChange={handleChange} required>
                <option value="">No recipient has been added</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description (Reason)</label>
              <input type="text" name="description" className="form-control" value={formData.description} onChange={handleChange} />
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{flex: 1}}>Back</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{flex: 1}}>{loading ? 'Processing...' : 'Continue'}</button>
            </div>
          </form>
        )}

        {activeTab === 'recipient' && (
          <div style={{padding: '2rem', textAlign: 'center'}}><h3>Add a New Recipient</h3></div>
        )}

        {activeTab === 'history' && (
          <div style={{padding: '2rem', textAlign: 'center'}}><h3>Transfer History</h3></div>
        )}
      </div>
    </div>
  );
};

export default TransferPage;