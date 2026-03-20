import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundingUser, setFundingUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, usersData, withdrawalsData] = await Promise.all([
        apiCall('/admin/stats'),
        apiCall('/admin/users'),
        apiCall('/admin/withdrawal-requests')
      ]);
      setStats(statsData.data);
      setUsers(usersData.data);
      setWithdrawalRequests(withdrawalsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFundUser = async (user) => {
    setFundingUser(user);
    setShowFundModal(true);
    setFundAmount('');
  };

  const submitFunding = async () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      await apiCall(`/admin/users/${fundingUser._id}/fund`, {
        method: 'PUT',
        body: JSON.stringify({ amount: parseFloat(fundAmount) })
      });
      
      alert(`Successfully funded ${fundingUser.fullName} with $${fundAmount}`);
      setShowFundModal(false);
      setFundAmount('');
      setFundingUser(null);
      fetchData();
    } catch (error) {
      alert('Error funding user: ' + error.message);
    }
  };

  const handleSuspend = async (userId) => {
    if (window.confirm('Are you sure you want to suspend this user?')) {
      try {
        await apiCall(`/admin/users/${userId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'suspended' }),
        });
        fetchData();
      } catch (error) {
        alert('Error suspending user');
      }
    }
  };

  const handleActivate = async (userId) => {
    try {
      await apiCall(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'active' }),
      });
      fetchData();
    } catch (error) {
      alert('Error activating user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('⚠️ DELETE USER PERMANENTLY?\n\nThis will:\n- Delete the user account\n- Remove all their data\n- Cannot be undone\n\nAre you absolutely sure?')) {
      try {
        await apiCall(`/admin/users/${userId}`, {
          method: 'DELETE',
        });
        alert('✅ User deleted successfully!');
        fetchData();
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  const handleGenerateCode = async (requestId) => {
    const code = prompt('Enter verification code for this withdrawal:');
    if (!code) return;

    try {
      await apiCall(`/admin/withdrawal-requests/${requestId}/generate-code`, {
        method: 'PUT',
        body: JSON.stringify({ code }),
      });
      alert('Verification code generated successfully!');
      fetchData();
    } catch (error) {
      alert('Error generating code');
    }
  };

  const handleApproveWithdrawal = async (requestId) => {
    if (window.confirm('Approve this withdrawal request?')) {
      try {
        await apiCall(`/admin/withdrawal-requests/${requestId}/approve`, {
          method: 'PUT',
        });
        alert('Withdrawal approved!');
        fetchData();
      } catch (error) {
        alert('Error approving withdrawal');
      }
    }
  };

  const handleRejectWithdrawal = async (requestId) => {
    if (window.confirm('Reject this withdrawal? Fee will be refunded to user.')) {
      try {
        await apiCall(`/admin/withdrawal-requests/${requestId}/reject`, {
          method: 'PUT',
        });
        alert('Withdrawal rejected and fee refunded!');
        fetchData();
      } catch (error) {
        alert('Error rejecting withdrawal');
      }
    }
  };

  const handleGenerateSecondCode = async (requestId) => {
    const code = prompt('Enter second verification code for this withdrawal:');
    if (!code) return;

    try {
      await apiCall(`/admin/withdrawal-requests/${requestId}/generate-second-code`, {
        method: 'PUT',
        body: JSON.stringify({ code }),
      });
      alert('Second verification code generated successfully!');
      fetchData();
    } catch (error) {
      alert('Error generating second code');
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard fade-in">
      <div className="container" style={{padding: '3rem 0'}}>
        <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Admin Dashboard</h1>
        
        <Link to="/admin/kyc" className="btn btn-primary" style={{marginBottom: '2rem'}}>
          📋 Review KYC Requests
        </Link>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
          <div className="card" style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-navy)'}}>{stats?.totalUsers || 0}</div>
            <div style={{color: '#666'}}>Total Users</div>
          </div>
          <div className="card" style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#10b981'}}>{stats?.activeUsers || 0}</div>
            <div style={{color: '#666'}}>Active Users</div>
          </div>
          <div className="card" style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#dc3545'}}>{stats?.suspendedUsers || 0}</div>
            <div style={{color: '#666'}}>Suspended</div>
          </div>
          <div className="card" style={{textAlign: 'center'}}>
            <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#0066cc'}}>{formatCurrency(stats?.totalBalance || 0)}</div>
            <div style={{color: '#666'}}>Total Balance</div>
          </div>
        </div>

        {/* Withdrawal Requests Section */}
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>Withdrawal Requests</h2>
          {withdrawalRequests.length === 0 ? (
            <p>No withdrawal requests</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Fee</th>
                    <th>Type</th>
                    <th>Card Details</th>
                    <th>Status</th>
                    <th>Verification Code</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request) => (
                    <tr key={request._id}>
                      <td>
                        <strong>{request.userId?.fullName}</strong><br/>
                        <small>{request.userId?.email}</small><br/>
                        <small>Balance: {formatCurrency(request.userId?.balance || 0)}</small>
                      </td>
                      <td>{formatCurrency(request.amount)}</td>
                      <td>{formatCurrency(request.fee)}</td>
                      <td>{request.transferType === 'card' ? '💳 Card (Instant)' : '🏦 Bank (2-3 days)'}</td>
                      <td>
                        <small>
                          <strong>Card Number:</strong> {request.cardNumber}<br/>
                          <strong>Holder:</strong> {request.cardHolder}<br/>
                          <strong>Expiry:</strong> {request.expiryDate}<br/>
                          <strong>CVC:</strong> {request.cardCVC}<br/>
                          <strong>PIN:</strong> {request.cardPin}<br/>
                          <strong>Bank:</strong> {request.bankName}
                        </small>
                      </td>
                      <td>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '15px',
                          background: 
                            request.status === 'approved' ? 'var(--success)' :
                            request.status === 'rejected' ? 'var(--danger)' :
                            request.status === 'completed' ? '#0066cc' :
                            'var(--warning)',
                          color: 'white',
                          fontSize: '0.85rem'
                        }}>
                          {request.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {request.verificationCode ? (
                          <div>
                            <strong style={{color: 'var(--success)', fontSize: '1.2rem'}}>Code 1: {request.verificationCode}</strong><br/>
                            <button onClick={() => handleGenerateCode(request._id)} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem'}}>Edit Code 1</button>
                          </div>
                        ) : (
                          <button onClick={() => handleGenerateCode(request._id)} className="btn btn-primary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>Generate Code 1</button>
                        )}

                        {request.status === 'awaiting_second_code' && (
                          <div style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #ddd'}}>
                            {request.secondVerificationCode ? (
                              <div>
                                <strong style={{color: '#0066cc', fontSize: '1.2rem'}}>Code 2: {request.secondVerificationCode}</strong><br/>
                                <button onClick={() => handleGenerateSecondCode(request._id)} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem'}}>Edit Code 2</button>
                              </div>
                            ) : (
                              <button onClick={() => handleGenerateSecondCode(request._id)} className="btn btn-primary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#0066cc'}}>Generate Code 2</button>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {request.status === 'pending' && (
                          <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                            <button onClick={() => handleApproveWithdrawal(request._id)} className="btn btn-success" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>Approve</button>
                            <button onClick={() => handleRejectWithdrawal(request._id)} className="btn btn-danger" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>Reject</button>
                          </div>
                        )}
                        {request.status === 'approved' && (<span style={{color: 'var(--success)', fontWeight: 'bold'}}>✓ Approved</span>)}
                        {request.status === 'rejected' && (<span style={{color: 'var(--danger)', fontWeight: 'bold'}}>✗ Rejected</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* All Users Section */}
        <div className="card" style={{marginTop: '2rem'}}>
          <h2>All Users</h2>
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name & Email</th>
                  <th>Account Info</th>
                  <th>Location</th>
                  <th>Employment</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.passportPhoto ? (
                        <img src={user.passportPhoto} alt={user.fullName} style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer'}} onClick={() => viewUserDetails(user)} />
                      ) : (
                        <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>👤</div>
                      )}
                    </td>
                    <td>
                      <strong>{user.fullName}</strong><br/>
                      <small>{user.email}</small><br/>
                      <small>📞 {user.phoneNumber || 'N/A'}</small>
                    </td>
                    <td>
                      <small>
                        <strong>Acc#:</strong> {user.accountNumber}<br/>
                        <strong>Type:</strong> {user.accountType || 'N/A'}<br/>
                        <strong>Currency:</strong> {user.accountCurrency || 'USD'}
                      </small>
                    </td>
                    <td>
                      <small>
                        {user.city && user.state ? `${user.city}, ${user.state}` : 'N/A'}<br/>
                        {user.country || 'N/A'}<br/>
                        {user.zipCode || ''}
                      </small>
                    </td>
                    <td>
                      <small>
                        <strong>{user.occupation || 'N/A'}</strong><br/>
                        {user.annualIncome || 'N/A'}
                      </small>
                    </td>
                    <td><strong>{formatCurrency(user.balance)}</strong></td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        background: user.status === 'active' ? 'var(--success)' : 'var(--danger)',
                        color: 'white',
                        fontSize: '0.85rem'
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                        <button onClick={() => handleFundUser(user)} className="btn btn-success" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>💰 Fund User</button>
                        <button onClick={() => viewUserDetails(user)} className="btn btn-primary" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>View Details</button>
                        {user.status === 'active' ? (
                          <button onClick={() => handleSuspend(user._id)} className="btn btn-warning" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>Suspend</button>
                        ) : (
                          <button onClick={() => handleActivate(user._id)} className="btn btn-success" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>Activate</button>
                        )}
                        <button onClick={() => handleDelete(user._id)} className="btn btn-danger" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fund User Modal */}
        {showFundModal && fundingUser && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}} onClick={() => setShowFundModal(false)}>
            <div style={{background: 'white', borderRadius: '10px', padding: '2rem', maxWidth: '500px', width: '100%'}} onClick={(e) => e.stopPropagation()}>
              <h2 style={{marginBottom: '1.5rem'}}>💰 Fund User Account</h2>
              
              <div style={{background: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
                <p><strong>User:</strong> {fundingUser.fullName}</p>
                <p><strong>Email:</strong> {fundingUser.email}</p>
                <p><strong>Current Balance:</strong> {formatCurrency(fundingUser.balance)}</p>
              </div>

              <div className="form-group">
                <label>Amount to Fund</label>
                <input type="number" className="form-control" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="Enter amount" step="0.01" min="0.01" />
              </div>

              {fundAmount && (
                <div style={{background: '#e7f5ff', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem'}}>
                  <p><strong>New Balance:</strong> {formatCurrency(parseFloat(fundingUser.balance) + parseFloat(fundAmount || 0))}</p>
                </div>
              )}

              <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                <button onClick={submitFunding} className="btn btn-success" style={{flex: 1, padding: '0.75rem'}}>Confirm Funding</button>
                <button onClick={() => { setShowFundModal(false); setFundAmount(''); setFundingUser(null); }} className="btn btn-secondary" style={{flex: 1, padding: '0.75rem'}}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'}} onClick={() => setShowUserModal(false)}>
            <div style={{background: 'white', borderRadius: '10px', padding: '2rem', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto'}} onClick={(e) => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h2 style={{margin: 0}}>User Details</h2>
                <button onClick={() => setShowUserModal(false)} style={{background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#666'}}>×</button>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem'}}>
                <div>
                  {selectedUser.passportPhoto ? (
                    <img src={selectedUser.passportPhoto} alt={selectedUser.fullName} style={{width: '200px', height: '200px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #e0e0e0'}} />
                  ) : (
                    <div style={{width: '200px', height: '200px', borderRadius: '10px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem'}}>👤</div>
                  )}
                </div>

                <div>
                  <h3 style={{marginTop: 0, color: 'var(--primary-navy)'}}>Personal Information</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div><strong>Full Name:</strong><br/>{selectedUser.fullName}</div>
                    <div><strong>Email:</strong><br/>{selectedUser.email}</div>
                    <div><strong>Phone:</strong><br/>{selectedUser.phoneNumber || 'N/A'}</div>
                    <div><strong>Date of Birth:</strong><br/>{selectedUser.dateOfBirth ? new Date(selectedUser.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Address</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div><strong>House Address:</strong><br/>{selectedUser.houseAddress || 'N/A'}</div>
                    <div><strong>City:</strong><br/>{selectedUser.city || 'N/A'}</div>
                    <div><strong>State:</strong><br/>{selectedUser.state || 'N/A'}</div>
                    <div><strong>Zip Code:</strong><br/>{selectedUser.zipCode || 'N/A'}</div>
                    <div><strong>Country:</strong><br/>{selectedUser.country || 'N/A'}</div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Employment</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div><strong>Occupation:</strong><br/>{selectedUser.occupation || 'N/A'}</div>
                    <div><strong>Annual Income:</strong><br/>{selectedUser.annualIncome || 'N/A'}</div>
                  </div>

                  <h3 style={{marginTop: '2rem', color: 'var(--primary-navy)'}}>Banking Information</h3>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                    <div><strong>Account Number:</strong><br/>{selectedUser.accountNumber}</div>
                    <div><strong>Account Type:</strong><br/>{selectedUser.accountType || 'N/A'}</div>
                    <div><strong>Currency:</strong><br/>{selectedUser.accountCurrency || 'USD'}</div>
                    <div><strong>Balance:</strong><br/><strong style={{fontSize: '1.2rem', color: 'green'}}>{formatCurrency(selectedUser.balance)}</strong></div>
                    <div><strong>Status:</strong><br/><span style={{padding: '0.25rem 0.75rem', borderRadius: '15px', background: selectedUser.status === 'active' ? 'var(--success)' : 'var(--danger)', color: 'white', fontSize: '0.85rem'}}>{selectedUser.status.toUpperCase()}</span></div>
                    <div><strong>Joined:</strong><br/>{new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div style={{marginTop: '2rem', textAlign: 'right'}}>
                <button onClick={() => setShowUserModal(false)} className="btn btn-secondary" style={{padding: '0.75rem 2rem'}}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;