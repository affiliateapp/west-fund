import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="fade-in">
    <div className="hero">
      <div className="container">
        <h1>Banking Made Simple</h1>
        <p>Experience the future of digital banking with Stamford</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary">Open Account</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
    </div>

    <div className="container" style={{padding: '4rem 0'}}>
      <h2 style={{textAlign: 'center', marginBottom: '3rem', color: 'var(--primary-navy)'}}>Our Services</h2>
      <div className="grid">
        <div className="card">
          <h2>💰 Savings Account</h2>
          <p>Earn competitive interest rates on your savings with our flexible savings accounts.</p>
          <Link to="/savings" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>💳 Current Account</h2>
          <p>Manage your daily transactions with ease using our current account services.</p>
          <Link to="/current" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>🏠 Loans</h2>
          <p>Get competitive loan rates for your home, car, or personal needs.</p>
          <Link to="/loans" className="btn btn-primary">Learn More</Link>
        </div>
        <div className="card">
          <h2>💳 Cards</h2>
          <p>Credit and debit cards with rewards and benefits tailored to you.</p>
          <Link to="/cards" className="btn btn-primary">Learn More</Link>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;
