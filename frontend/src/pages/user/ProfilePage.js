import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="container fade-in" style={{padding: '4rem 0', maxWidth: '1000px'}}>
      <div className="card" style={{padding: '3rem'}}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          {user?.passportPhoto ? (
            <img src={user.passportPhoto} alt={user.fullName} style={{width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid var(--primary-navy)', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}} />
          ) : (
            <div style={{width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>{user?.fullName?.charAt(0)}</div>
          )}
          <h1 style={{fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem'}}>{user?.fullName}</h1>
          <p style={{color: '#666', fontSize: '1.1rem', marginBottom: '1rem'}}>{user?.email}</p>
          <div style={{marginTop: '1rem'}}>
            {user?.kycStatus === 'verified' && (<span style={{padding: '0.5rem 1.5rem', background: '#10b981', color: 'white', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold'}}>✅ Verified Account</span>)}
            {user?.kycStatus === 'pending' && (<span style={{padding: '0.5rem 1.5rem', background: '#f0b90b', color: 'white', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold'}}>⏳ KYC Pending Review</span>)}
            {user?.kycStatus === 'not_submitted' && (<Link to="/kyc-verification" style={{padding: '0.5rem 1.5rem', background: '#ff6b6b', color: 'white', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block'}}>⚠️ Complete KYC Verification</Link>)}
          </div>
        </div>
        <hr style={{margin: '2rem 0', border: 'none', borderTop: '2px solid #f0f0f0'}} />
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          <div>
            <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Account Details</h3>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Account Number</label>
              <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-navy)'}}>{user?.accountNumber}</p>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Account Type</label>
              <p style={{fontSize: '1.1rem', color: '#333'}}>{user?.accountType || 'Standard Account'}</p>
            </div>
          </div>
          <div>
            <h3 style={{color: 'var(--primary-navy)', marginBottom: '1.5rem'}}>Personal Information</h3>
            {user?.phoneNumber && (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Phone Number</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{user.phoneNumber}</p>
              </div>
            )}
            {user?.country && (
              <div style={{marginBottom: '1.5rem'}}>
                <label style={{display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Country</label>
                <p style={{fontSize: '1.1rem', color: '#333'}}>{user.country}</p>
              </div>
            )}
          </div>
        </div>
        <hr style={{margin: '2rem 0', border: 'none', borderTop: '2px solid #f0f0f0'}} />
        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/dashboard" className="btn btn-primary" style={{padding: '0.75rem 2rem'}}>Back to Dashboard</Link>
          {user?.kycStatus === 'not_submitted' && (<Link to="/kyc-verification" className="btn btn-success" style={{padding: '0.75rem 2rem'}}>Complete KYC Now</Link>)}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;