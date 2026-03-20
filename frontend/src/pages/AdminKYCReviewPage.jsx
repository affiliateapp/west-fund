import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';

const AdminKYCReviewPage = () => {
  const [kycRequests, setKycRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYCRequests();
  }, []);

  const fetchKYCRequests = async () => {
    try {
      const data = await apiCall('/admin/kyc-requests');
      setKycRequests(data.data);
    } catch (error) {
      console.error('Error fetching KYC requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    if (window.confirm('Approve this KYC verification?')) {
      try {
        await apiCall(`/admin/kyc/${userId}/approve`, {
          method: 'PUT'
        });
        alert('KYC approved successfully!');
        fetchKYCRequests();
        setShowModal(false);
      } catch (error) {
        alert('Error approving KYC');
      }
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await apiCall(`/admin/kyc/${userId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason: rejectionReason })
      });
      alert('KYC rejected');
      fetchKYCRequests();
      setShowModal(false);
      setRejectionReason('');
    } catch (error) {
      alert('Error rejecting KYC');
    }
  };

  const viewDocuments = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container fade-in" style={{padding: '3rem 0'}}>
      <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>KYC Verification Requests</h1>

      <div className="card">
        <div style={{overflowX: 'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycRequests.map((user) => (
                <tr key={user._id}>
                  <td>
                    <strong>{user.fullName}</strong><br/>
                    <small>{user.accountNumber}</small>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber || 'N/A'}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      background: 
                        user.kycStatus === 'verified' ? '#10b981' :
                        user.kycStatus === 'pending' ? '#f0b90b' :
                        user.kycStatus === 'rejected' ? '#dc3545' : '#666',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}>
                      {user.kycStatus.toUpperCase()}
                    </span>
                  </td>
                  <td>{user.kycSubmittedAt ? new Date(user.kycSubmittedAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => viewDocuments(user)}
                      className="btn btn-primary"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}
                    >
                      Review Documents
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {kycRequests.length === 0 && (
          <p style={{textAlign: 'center', padding: '2rem'}}>No KYC requests</p>
        )}
      </div>

      <div style={{marginTop: '2rem'}}>
        <Link to="/admin" className="btn btn-secondary">Back to Admin Dashboard</Link>
      </div>

      {/* KYC Documents Review Modal */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflowY: 'auto'
        }}
        onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '2rem',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
              <h2 style={{margin: 0}}>KYC Documents Review - {selectedUser.fullName}</h2>
              <button 
                onClick={() => setShowModal(false)}
                style={{background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer'}}
              >
                ×
              </button>
            </div>

            {/* User Info Summary */}
            <div style={{background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                <div><strong>Full Name:</strong><br/>{selectedUser.fullName}</div>
                <div><strong>Email:</strong><br/>{selectedUser.email}</div>
                <div><strong>Phone:</strong><br/>{selectedUser.phoneNumber || 'N/A'}</div>
                <div><strong>Address:</strong><br/>{selectedUser.houseAddress || 'N/A'}</div>
                <div><strong>City, State:</strong><br/>{selectedUser.city}, {selectedUser.state}</div>
                <div><strong>Country:</strong><br/>{selectedUser.country || 'N/A'}</div>
              </div>
            </div>

            {/* Documents Grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
              <div>
                <h3>📄 ID Card (Front)</h3>
                {selectedUser.kycDocuments?.idCardFront ? (
                  <img 
                    src={selectedUser.kycDocuments.idCardFront}
                    alt="ID Front"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.idCardFront, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              <div>
                <h3>📄 ID Card (Back)</h3>
                {selectedUser.kycDocuments?.idCardBack ? (
                  <img 
                    src={selectedUser.kycDocuments.idCardBack}
                    alt="ID Back"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.idCardBack, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              <div>
                <h3>🏠 Proof of Address</h3>
                {selectedUser.kycDocuments?.proofOfAddress ? (
                  <img 
                    src={selectedUser.kycDocuments.proofOfAddress}
                    alt="Proof of Address"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.proofOfAddress, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>

              <div>
                <h3>🤳 Selfie with ID</h3>
                {selectedUser.kycDocuments?.selfieWithId ? (
                  <img 
                    src={selectedUser.kycDocuments.selfieWithId}
                    alt="Selfie"
                    style={{width: '100%', borderRadius: '8px', border: '2px solid #e0e0e0', cursor: 'pointer'}}
                    onClick={() => window.open(selectedUser.kycDocuments.selfieWithId, '_blank')}
                  />
                ) : (
                  <p style={{color: '#999'}}>Not provided</p>
                )}
              </div>
            </div>

            {/* Rejection Reason Input */}
            {selectedUser.kycStatus === 'pending' && (
              <div style={{marginBottom: '2rem'}}>
                <label style={{fontWeight: 'bold', marginBottom: '0.5rem', display: 'block'}}>
                  Rejection Reason (if rejecting):
                </label>
                <textarea
                  className="form-control"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows="3"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
              {selectedUser.kycStatus === 'pending' && (
                <>
                  <button 
                    onClick={() => handleApprove(selectedUser._id)}
                    className="btn btn-success"
                    style={{padding: '0.75rem 2rem'}}
                  >
                    ✅ Approve KYC
                  </button>
                  <button 
                    onClick={() => handleReject(selectedUser._id)}
                    className="btn btn-danger"
                    style={{padding: '0.75rem 2rem'}}
                  >
                    ❌ Reject KYC
                  </button>
                </>
              )}
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
                style={{padding: '0.75rem 2rem'}}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKYCReviewPage;
