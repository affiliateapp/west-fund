import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/constants';
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
      const token = localStorage.getItem('token');
      const [balanceRes, transactionsRes] = await Promise.all([
        fetch(`${API_URL}/users/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/users/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);
      
      const balanceData = await balanceRes.json();
      const transactionsData = await transactionsRes.json();
      
      setBalance(balanceData.data.balance);
      setTransactions(transactionsData.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#f5f7fa'}}>
      {/* Mobile Sidebar Toggle Button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleSidebar}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--primary-navy)',
          color: 'white',
          border: 'none',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 998
        }}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div 
        className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: '280px',
          background: 'white',
          padding: '1.5rem 1rem',
          borderRight: '1px solid #e0e0e0',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          transition: 'transform 0.3s ease',
          zIndex: 999
        }}
      >
        {/* Close button for mobile */}
        <button 
          onClick={toggleSidebar}
          style={{
            display: 'none',
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666'
          }}
          className="show-mobile"
        >
          ✕
        </button>

        {/* Logo */}
        <div style={{marginBottom: '1.5rem'}}>
          <h2 style={{color: 'var(--primary-navy)', fontSize: '1.3rem', margin: 0}}>
            Stamford Members Credit Union
          </h2>
        </div>

        {/* Available Balance - COMPACT */}
        <div style={{marginBottom: '1.5rem', padding: '0.75rem', background: '#f8f9fa', borderRadius: '8px'}}>
          <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.3rem'}}>
            AVAILABLE BALANCE
          </p>
          <h1 style={{fontSize: '1.5rem', color: 'var(--primary-navy)', margin: '0.3rem 0'}}>
            {formatCurrency(balance)}
          </h1>
          <p style={{fontSize: '0.85rem', color: '#666', margin: '0.3rem 0'}}>ALL</p>
        </div>

        {/* Action Buttons - COMPACT */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem'}}>
          <Link to="/transfer" className="btn btn-primary" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}} onClick={() => setSidebarOpen(false)}>
            💸 TRANSFER
          </Link>
          <button className="btn btn-danger" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem'}}>
            📄 PAY BILLS
          </button>
          <Link to="/pending-withdrawals" className="btn" style={{width: '100%', padding: '0.5rem', fontSize: '0.85rem', background: '#9c27b0', color: 'white'}} onClick={() => setSidebarOpen(false)}>
            📋 MY WITHDRAWALS
          </Link>
        </div>

        {/* Menu - COMPACT */}
        <div>
          <p style={{fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.75rem'}}>
            MENU
          </p>
          
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: '#e3f2fd',
            borderRadius: '5px',
            marginBottom: '0.4rem',
            textDecoration: 'none',
            color: '#1976d2',
            fontSize: '0.9rem'
          }} onClick={() => setSidebarOpen(false)}>
            <span>📊</span>
            <span style={{fontWeight: 'bold'}}>Dashboard</span>
          </Link>
          
          <Link to="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '5px',
            marginBottom: '0.4rem',
            textDecoration: 'none',
            color: '#666',
            fontSize: '0.9rem'
          }} onClick={() => setSidebarOpen(false)}>
            <span>👤</span>
            <span>My Account</span>
          </Link>
          
          <Link to="/my-cards" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '5px',
            marginBottom: '0.4rem',
            textDecoration: 'none',
            color: '#666',
            fontSize: '0.9rem'
          }} onClick={() => setSidebarOpen(false)}>
            <span>💳</span>
            <span>My Cards</span>
          </Link>
          
          <Link to="/transfer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '5px',
            marginBottom: '0.4rem',
            textDecoration: 'none',
            color: '#666',
            fontSize: '0.9rem'
          }} onClick={() => setSidebarOpen(false)}>
            <span>💰</span>
            <span>Send Money</span>
          </Link>
          
          <Link to="/withdraw" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '5px',
            marginBottom: '0.4rem',
            textDecoration: 'none',
            color: '#666',
            fontSize: '0.9rem'
          }} onClick={() => setSidebarOpen(false)}>
            <span>💸</span>
            <span>Withdraw Funds</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '2rem'
      }}
      className="dashboard-content"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{fontSize: '1.75rem', color: 'var(--primary-navy)', marginBottom: '0.5rem'}}>
              Good Day! {user.fullName}
            </h1>
            <p style={{color: '#666'}}>At a glance summary of your account!</p>
          </div>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            {user.kycStatus === 'not_submitted' && (
              <Link 
                to="/kyc-verification" 
                className="btn"
                style={{
                  background: '#ffc107',
                  color: '#000',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 'bold',
                  border: '2px solid #ff9800'
                }}
              >
                ⚠️ Verify KYC
              </Link>
            )}
            {user.kycStatus === 'verified' && (
              <button 
                className="btn"
                style={{
                  background: '#d4edda',
                  color: '#155724',
                  padding: '0.75rem 1.5rem',
                  fontWeight: 'bold',
                  border: '2px solid #28a745',
                  cursor: 'default'
                }}
                disabled
              >
                ✅ Verified
              </button>
            )}
            <Link to="/deposit" className="btn btn-primary">Deposit →</Link>
            <Link to="/transfer" className="btn btn-danger">Transfer Fund →</Link>
          </div>
        </div>

        {/* Overview Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '15px',
          padding: '2rem',
          marginBottom: '2rem',
          color: 'white',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Last Login</h3>
            <p style={{fontSize: '1rem'}}>{new Date().toLocaleDateString('en-US', { 
              month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true 
            })}</p>
          </div>
          <div>
            <h3 style={{margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9}}>Available balance</h3>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>
              GBP {formatCurrency(balance).replace('$', '')}
            </p>
            <p style={{fontSize: '1.1rem'}}>{user.fullName}</p>
          </div>
          <div className="hide-mobile">
            <h3 style={{margin: '0 0 1rem 0', fontSize: '0.9rem', opacity: 0.9}}>Your IP address</h3>
            <p style={{fontSize: '0.9rem'}}>127.1.1.0</p>
            <p style={{fontSize: '0.9rem'}}>105.112.22.113</p>
          </div>
        </div>

        {/* Charts and Accounts - Mobile Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* EURUSD Chart */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{height: '280px'}}>
              <iframe
                src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22FX%3AEURUSD%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22dateRange%22%3A%226M%22%2C%22colorTheme%22%3A%22dark%22%2C%22trendLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%201)%22%2C%22underLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200.3)%22%2C%22underLineBottomColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22isTransparent%22%3Afalse%2C%22autosize%22%3Afalse%2C%22largeChartUrl%22%3A%22%22%2C%22chartOnly%22%3Afalse%2C%22noTimeScale%22%3Afalse%7D"
                style={{width: '100%', height: '100%', border: 'none', borderRadius: '8px'}}
                title="EURUSD Mini Chart"
              ></iframe>
            </div>
          </div>

          {/* Crypto Currency Account */}
          <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0}}>Crypto Currency Account</h3>
              <Link to="/transfer" style={{color: '#1976d2', textDecoration: 'none'}}>Transfer</Link>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#e0e0e0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                💰
              </div>
              <div>
                <p style={{margin: 0, fontSize: '0.85rem', color: '#666'}}>*****{user.accountNumber?.slice(-5)}</p>
                <p style={{margin: '0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold'}}>
                  {formatCurrency(balance)} ALL
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <h3 style={{marginBottom: '1rem'}}>Recent Transaction Activities</h3>
          {transactions.length === 0 ? (
            <p style={{color: '#666', textAlign: 'center', padding: '2rem'}}>No transactions yet</p>
          ) : (
            <div>
              {transactions.map((txn) => (
                <div key={txn._id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <p style={{margin: 0, fontWeight: 'bold'}}>{txn.description}</p>
                    <p style={{margin: '0.25rem 0', fontSize: '0.85rem', color: '#666'}}>
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p style={{
                    margin: 0,
                    fontWeight: 'bold',
                    color: txn.type === 'credit' ? 'green' : 'red'
                  }}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
          onClick={toggleSidebar}
        />
      )}

      <style jsx>{`
        @media (max-width: 968px) {
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          
          .dashboard-sidebar.mobile-open {
            transform: translateX(0);
          }
          
          .dashboard-content {
            margin-left: 0 !important;
            padding: 1rem !important;
          }
          
          .mobile-sidebar-toggle,
          .show-mobile {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;