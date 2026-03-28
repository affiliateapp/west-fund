import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [balanceData, transactionsData] = await Promise.all([
        apiCall('/users/balance'),
        apiCall('/users/transactions'),
      ]);
      setBalance(balanceData.data.balance);
      setTransactions(transactionsData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#f5f7fa', position: 'relative'}}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
        style={{width: '280px', background: 'white', padding: '1.5rem 1rem', borderRight: '1px solid #e0e0e0', position: 'fixed', height: '100vh', overflowY: 'auto', zIndex: 999, transition: 'transform 0.3s ease'}}
      >
        <div style={{marginBottom: '1.5rem'}}>
          <h2 style={{color: 'var(--primary-navy)', fontSize: '1.3rem', margin: 0}}>Stamford Members Credit Union</h2>
        </div>

        {/* Available Balance */}
        <div style={{marginBottom: '1.5rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px'}}>
          <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem'}}>AVAILABLE BALANCE</p>
          <h1 style={{fontSize: '1.5rem', color: 'var(--primary-navy)', margin: '0.3rem 0'}}>{formatCurrency(balance)}</h1>
          <p style={{fontSize: '0.85rem', color: '#666', margin: '0.3rem 0'}}>ALL</p>
        </div>

        {/* Action Buttons */}

        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
          <Link to="/deposit" className="btn btn-primary" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>💰 DEPOSIT</Link>
          <Link to="/transfer" className="btn btn-primary" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>💸 TRANSFER</Link>
          <Link to="/withdraw" className="btn btn-success" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>💸 WITHDRAW</Link>
          <Link to="/pending-withdrawals" className="btn" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem', background: '#9c27b0', color: 'white'}}>📋 MY WITHDRAWALS</Link>
          <Link to="/kyc-status" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#666', fontSize: '0.9rem'}}>
            <span style={{fontWeight: 'bold', fontSize: '1rem'}}>ID</span><span>KYC Status</span>
          </Link>
        </div>

        {/* Menu */}
        <div>
          <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.75rem'}}>MENU</p>
          <Link to="/dashboard" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: '#e3f2fd', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#1976d2', fontSize: '0.9rem'}}>
            <span>📊</span><span style={{fontWeight: 'bold'}}>Dashboard</span>
          </Link>
          <Link to="/profile" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#666', fontSize: '0.9rem'}}>
            <span>👤</span><span>My Account</span>
          </Link>
          <Link to="/my-cards" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#666', fontSize: '0.9rem'}}>
            <span>💳</span><span>My Cards</span>
          </Link>
          <Link to="/transfer" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#666', fontSize: '0.9rem'}}>
            <span>💰</span><span>Send Money</span>
          </Link>
          <Link to="/withdraw" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '5px', marginBottom: '0.4rem', textDecoration: 'none', color: '#666', fontSize: '0.9rem'}}>
            <span>💸</span><span>Withdraw Funds</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
     <div className="dashboard-main-content" style={{flex: 1, padding: '2rem'}}>
        {/* Header */}
        <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 style={{fontSize: '1.75rem', color: 'var(--primary-navy)', marginBottom: '0.5rem'}}>Good Day! {user.fullName}</h1>
            <p style={{color: '#666'}}>At a glance summary of your account!</p>
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {user.kycStatus === 'not_submitted' && (
              <Link to="/kyc-verification" className="btn" style={{background: '#ffc107', color: '#000', padding: '0.75rem 1.5rem', fontWeight: 'bold', border: '2px solid #ff9800'}}>⚠️ Verify KYC</Link>
            )}
            {user.kycStatus === 'pending' && (
              <button className="btn" style={{background: '#fff3cd', color: '#856404', padding: '0.75rem 1.5rem', fontWeight: 'bold', border: '2px solid #ffc107', cursor: 'default'}} disabled>⏳ KYC Pending</button>
            )}
            
              
            
          </div>
        </div>

        {/* Overview Card */}
        <div className="overview-card" style={{background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', borderRadius: '15px', padding: '2rem', marginBottom: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem'}}>
          <div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Last Login</h3>
            <p style={{fontSize: '1rem'}}>{new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
          </div>
          <div>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9}}>Available balance</h3>
            <p style={{fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0'}}>GBP {formatCurrency(balance).replace('$', '')}</p>
            <p style={{fontSize: '1.1rem'}}>{user.fullName}</p>
          </div>
          <div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Your IP address</h3>
            <p style={{fontSize: '0.9rem'}}>127.1.1.0</p>
            <p style={{fontSize: '0.9rem'}}>105.112.22.113</p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem'}}>
          {/* EURUSD Chart */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '2rem'}}>
            <div style={{height: '280px'}}>
              <iframe src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22FX%3AEURUSD%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22dateRange%22%3A%226M%22%2C%22colorTheme%22%3A%22dark%22%2C%22trendLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%201)%22%2C%22underLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200.3)%22%2C%22underLineBottomColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22isTransparent%22%3Afalse%2C%22autosize%22%3Afalse%2C%22largeChartUrl%22%3A%22%22%2C%22chartOnly%22%3Afalse%2C%22noTimeScale%22%3Afalse%7D" style={{width: '100%', height: '100%', border: 'none', borderRadius: '8px'}} title="EURUSD Mini Chart"></iframe>
            </div>
          </div>

          {/* Crypto Account */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>Crypto Currency Account</h3>
              <Link to="/transfer" style={{color: '#1976d2', textDecoration: 'none'}}>Transfer Fund</Link>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{width: '40px', height: '40px', background: '#e0e0e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>💰</div>
              <div>
                <p style={{margin: 0, fontSize: '0.85rem', color: '#666'}}>*****{user.accountNumber.slice(-5)}</p>
                <p style={{margin: '0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold'}}>{formatCurrency(balance)} ALL</p>
              </div>
            </div>
          </div>

          {/* Loans */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>Loans and lines of credit</h3>
              <button onClick={() => {}} style={{background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0, textDecoration: 'none'}}>Pay bills</button>
            </div>
            <div style={{display: 'flex', gap: '2rem'}}>
              <div>
                <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>💼 Business Support L...</p>
                <p style={{fontSize: '1.25rem', fontWeight: 'bold'}}>0 GBP</p>
              </div>
              <div>
                <p style={{fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem'}}>📊 FICO Credit Score</p>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>300</p>
                  <div style={{width: '12px', height: '12px', background: '#f44336', borderRadius: '50%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions & Balance Flow */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
          {/* Recent Transactions */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom: '1rem'}}>Recent Transaction Activities</h3>
            {transactions.length === 0 ? (
              <p style={{color: '#666', textAlign: 'center', padding: '2rem'}}>No transactions yet</p>
            ) : (
              <div>
                {transactions.map((txn) => (
                  <div key={txn._id} style={{padding: '1rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                      <p style={{margin: 0, fontWeight: 'bold'}}>{txn.description}</p>
                      <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#666'}}>{new Date(txn.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p style={{margin: 0, fontWeight: 'bold', color: txn.type === 'credit' ? 'green' : 'red'}}>
                      {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Balance Flow */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <h3 style={{marginBottom: '1rem'}}>Balance Flow</h3>
            <div style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <p style={{color: '#666'}}>Chart visualization coming soon...</p>
            </div>
            <div style={{display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#4caf50', borderRadius: '50%'}}></div>
                <span style={{fontSize: '0.9rem'}}>Credit</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <div style={{width: '12px', height: '12px', background: '#f44336', borderRadius: '50%'}}></div>
                <span style={{fontSize: '0.9rem'}}>Debit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div style={{background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginTop: '2rem', textAlign: 'center'}}>
          <h3 style={{marginBottom: '1rem'}}>We are here to help you!</h3>
          <p style={{color: '#666', marginBottom: '1.5rem'}}>Ask a question or file a support ticket, manage request, report an issues. Our team support team will get back to you by email.</p>
          <button className="btn btn-primary">Get Support Now</button>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mobile-sidebar-toggle"
        style={{
          display: 'none',
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--primary-navy)',
          color: 'white',
          border: 'none',
          width: '50px',
          height: '50px',
          borderRadius: '8px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 997
        }}
      >
        ☰
      </button>
    </div>
  );
};

export default Dashboard;