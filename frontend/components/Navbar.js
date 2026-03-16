import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        padding: '1rem 5%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1001
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }} onClick={closeMobileMenu}>
            <span>🏦</span>
            <span>Stamford</span>
          </Link>

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button 
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="mobile-menu-toggle"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>

          {/* Desktop Navigation */}
          <ul className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{
            display: 'flex',
            listStyle: 'none',
            gap: '1.5rem',
            alignItems: 'center',
            margin: 0
          }}>
            {!user ? (
              <>
                <li><Link to="/" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Home</Link></li>
                <li><Link to="/about" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>About</Link></li>
                <li><Link to="/savings" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Savings</Link></li>
                <li><Link to="/current" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Current Account</Link></li>
                <li><Link to="/loans" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Loans</Link></li>
                <li><Link to="/cards" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Cards</Link></li>
                <li><Link to="/contact" style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>Contact</Link></li>
                <li>
                  <Link to="/login" className="btn btn-secondary" style={{padding: '0.5rem 1rem'}} onClick={closeMobileMenu}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="btn btn-primary" style={{padding: '0.5rem 1rem'}} onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} style={{color: 'white', textDecoration: 'none', fontWeight: '500'}} onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span style={{color: 'var(--accent-gold)', fontWeight: '500'}}>
                    Welcome, {user.fullName}
                  </span>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'transparent',
                      border: '2px solid white',
                      color: 'white',
                      padding: '0.5rem 1.5rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          onClick={toggleMobileMenu}
        />
      )}

      <style jsx>{`
        @media (max-width: 968px) {
          .mobile-menu-toggle {
            display: block !important;
          }
          
          .navbar-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--primary-navy);
            flex-direction: column !important;
            gap: 0 !important;
            padding: 4rem 2rem;
            transition: right 0.3s ease;
            z-index: 1000;
            overflow-y: auto;
            align-items: flex-start !important;
          }
          
          .navbar-nav.mobile-open {
            right: 0;
            box-shadow: -5px 0 15px rgba(0,0,0,0.3);
          }
          
          .navbar-nav li {
            width: 100%;
            padding: 1rem 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          
          .navbar-nav li a,
          .navbar-nav li button,
          .navbar-nav li span {
            display: block;
            width: 100%;
            text-align: left;
          }

          .navbar-nav li .btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;