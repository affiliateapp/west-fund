import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          🏦 Stamford Members Credit Union
        </Link>
        <ul className="navbar-nav">
          {!user ? (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/savings">Savings</Link></li>
              <li><Link to="/current">Current Account</Link></li>
              <li><Link to="/loans">Loans</Link></li>
              <li><Link to="/cards">Cards</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/login" className="btn btn-secondary">Login</Link></li>
              <li><Link to="/signup" className="btn btn-primary">Sign Up</Link></li>
            </>
          ) : (
            <>
              <li><Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link></li>
              <li><span style={{color: 'var(--accent-gold)'}}>Welcome, {user.fullName}</span></li>
              <li><button onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;