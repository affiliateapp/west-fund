import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/api';

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

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
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
          <h1 style={{margin: 0, fontSize: '1.5rem'}}>🛡️ KYC Verification Required</h1>
          <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem'}}>Please submit the following documents to verify your identity</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
            <div>
              <h3 style={{marginBottom: '1rem'}}>📄 ID Card (Front)</h3>
              <input type="file" className="form-control" onChange={(e) => handleFileChange(e, 'idCardFront')} accept="image/*" required />
              {documents.idCardFront && (
                <img src={documents.idCardFront} alt="ID Front" style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}} />
              )}
            </div>

            <div>
              <h3 style={{marginBottom: '1rem'}}>📄 ID Card (Back)</h3>
              <input type="file" className="form-control" onChange={(e) => handleFileChange(e, 'idCardBack')} accept="image/*" required />
              {documents.idCardBack && (
                <img src={documents.idCardBack} alt="ID Back" style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}} />
              )}
            </div>

            <div>
              <h3 style={{marginBottom: '1rem'}}>🏠 Proof of Address</h3>
              <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>Utility bill, bank statement, or government letter</p>
              <input type="file" className="form-control" onChange={(e) => handleFileChange(e, 'proofOfAddress')} accept="image/*,application/pdf" required />
              {documents.proofOfAddress && (
                <img src={documents.proofOfAddress} alt="Proof of Address" style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}} />
              )}
            </div>

            <div>
              <h3 style={{marginBottom: '1rem'}}>🤳 Selfie with ID</h3>
              <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>Hold your ID next to your face</p>
              <input type="file" className="form-control" onChange={(e) => handleFileChange(e, 'selfieWithId')} accept="image/*" required />
              {documents.selfieWithId && (
                <img src={documents.selfieWithId} alt="Selfie" style={{width: '100%', marginTop: '1rem', borderRadius: '5px', border: '2px solid #e0e0e0'}} />
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

          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{padding: '0.75rem 2rem'}}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary" style={{padding: '0.75rem 2rem'}}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KYCVerificationPage;
