import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const KYCStatusPage = () => {
  const { user } = useAuth();

  const getStatusBadge = () => {
    switch(user.kycStatus) {
      case 'verified':
        return {
          color: '#d4edda',
          border: '#28a745',
          text: '#155724',
          title: 'VERIFIED',
          message: 'Your KYC has been approved. You have full access to all features.'
        };
      case 'pending':
        return {
          color: '#fff3cd',
          border: '#ffc107',
          text: '#856404',
          title: 'PENDING REVIEW',
          message: 'Your KYC documents are under review. This usually takes 24-48 hours.'
        };
      case 'rejected':
        return {
          color: '#f8d7da',
          border: '#dc3545',
          text: '#721c24',
          title: 'REJECTED',
          message: 'Your KYC was rejected. Please resubmit with correct documents.'
        };
      default:
        return {
          color: '#fff3cd',
          border: '#ff9800',
          text: '#856404',
          title: 'NOT SUBMITTED',
          message: 'You need to complete KYC verification to access all features.'
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '800px'}}>
      <div className="card">
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem', fontSize: '1.75rem'}}>
          KYC Verification Status
        </h1>

        {/* Status Badge */}
        <div style={{
          background: status.color,
          border: `3px solid ${status.border}`,
          padding: '2.5rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.75rem 2rem',
            background: status.border,
            color: 'white',
            borderRadius: '8px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '1.5rem'
          }}>
            {status.title}
          </div>
          <p style={{
            color: status.text,
            fontSize: '1.1rem',
            margin: 0,
            fontWeight: '500'
          }}>
            {status.message}
          </p>
        </div>

        {/* User Information */}
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{marginBottom: '1rem', color: 'var(--primary-navy)'}}>Account Details</h3>
          <div style={{display: 'grid', gap: '0.75rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #dee2e6'}}>
              <span style={{color: '#666', fontWeight: '500'}}>Full Name:</span>
              <strong>{user.fullName}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #dee2e6'}}>
              <span style={{color: '#666', fontWeight: '500'}}>Email:</span>
              <strong>{user.email}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #dee2e6'}}>
              <span style={{color: '#666', fontWeight: '500'}}>Account Number:</span>
              <strong>{user.accountNumber}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
              <span style={{color: '#666', fontWeight: '500'}}>KYC Status:</span>
              <strong style={{color: status.border}}>{status.title}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem'}}>
          {user.kycStatus === 'not_submitted' && (
            <Link to="/kyc-verification" className="btn btn-primary" style={{flex: 1, minWidth: '200px'}}>
              Submit KYC Documents
            </Link>
          )}
          
          {user.kycStatus === 'rejected' && (
            <Link to="/kyc-verification" className="btn btn-warning" style={{flex: 1, minWidth: '200px'}}>
              Resubmit KYC Documents
            </Link>
          )}

          {user.kycStatus === 'pending' && (
            <button className="btn" style={{flex: 1, minWidth: '200px', background: '#6c757d', color: 'white'}} disabled>
              Awaiting Review
            </button>
          )}

          <Link to="/dashboard" className="btn btn-secondary" style={{minWidth: '150px'}}>
            Back to Dashboard
          </Link>
        </div>

        {/* Help Section */}
        <div style={{
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h3 style={{color: 'var(--primary-navy)', marginBottom: '1rem', fontSize: '1.25rem'}}>
            Need Assistance?
          </h3>
          <p style={{marginBottom: '1rem', color: '#666', lineHeight: '1.6'}}>
            If you have questions about your KYC status or need assistance with the verification process, our support team is here to help.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KYCStatusPage;