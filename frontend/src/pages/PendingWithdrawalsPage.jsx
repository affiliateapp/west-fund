import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';

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
      setRequests(data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
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
          <Link to="/withdraw" className="btn btn-primary">Make a Withdrawal</Link>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
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
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default PendingWithdrawalsPage;
