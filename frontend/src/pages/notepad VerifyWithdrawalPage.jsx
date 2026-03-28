import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../utils/constants';

const VerifyWithdrawalPage = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [requestId, setRequestId] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get requestId from navigation state
    if (location.state?.requestId) {
      setRequestId(location.state.requestId);
      setStep(location.state.currentStep || 1);
    } else {
      // No request ID, redirect to dashboard
      navigate('/dashboard');
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/verify-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          requestId,
          code
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.needsNextCode) {
          // Move to next code
          setStep(data.currentStep + 1);
          setCode('');
          setError('');
          alert(data.message);
        } else {
          // All codes verified - withdrawal complete!
          alert('🎉 ' + data.message);
          navigate('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Error verifying code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '600px'}}>
      <div className="card">
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: 'var(--primary-navy)', marginBottom: '1rem'}}>
            🔐 Withdrawal Verification
          </h1>
          <div style={{
            background: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '3rem',
              margin: '0.5rem 0',
              color: 'var(--primary-navy)'
            }}>
              Code {step} of 6
            </h2>
            <div style={{
              width: '100%',
              background: '#ddd',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '1rem'
            }}>
              <div style={{
                width: `${(step / 6) * 100}%`,
                background: 'var(--primary-navy)',
                height: '100%',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            color: '#856404',
            textAlign: 'center'
          }}>
            <strong>⚠️ Important:</strong> Enter the verification code {step} provided by admin to proceed with your withdrawal.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{marginBottom: '1.5rem'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{fontSize: '1.1rem', fontWeight: 'bold'}}>
              Verification Code {step}
            </label>
            <input
              type="text"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`Enter code ${step} from admin`}
              style={{
                fontSize: '1.5rem',
                textAlign: 'center',
                letterSpacing: '0.3rem',
                padding: '1rem'
              }}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              marginBottom: '1rem'
            }}
          >
            {loading ? 'Verifying...' : `✓ Verify Code ${step}`}
          </button>

          <button
            type="button"
            onClick={() => navigate('/pending-withdrawals')}
            className="btn btn-secondary"
            style={{width: '100%'}}
          >
            View All Withdrawal Requests
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <p style={{margin: '0.5rem 0'}}>
            <strong>How it works:</strong>
          </p>
          <ol style={{marginLeft: '1.5rem', marginBottom: 0}}>
            <li>Admin reviews your withdrawal request</li>
            <li>Admin generates and sends you code {step}</li>
            <li>Enter the code above to proceed</li>
            <li>Repeat for all 6 verification codes</li>
            <li>After code 6, your withdrawal is complete!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default VerifyWithdrawalPage;