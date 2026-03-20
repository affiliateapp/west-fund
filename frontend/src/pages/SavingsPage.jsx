import React from 'react';
import { Link } from 'react-router-dom';

const SavingsPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Savings Account</h1>
    <div className="card">
      <h2>Grow Your Money</h2>
      <p>Our savings accounts offer competitive interest rates to help your money grow.</p>
      
      <h2 style={{marginTop: '2rem'}}>Features</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Up to 4.5% APY</li>
        <li>No monthly maintenance fees</li>
        <li>Easy online access</li>
        <li>Automatic savings plans</li>
        <li>FDIC insured</li>
      </ul>
      
      <div style={{marginTop: '2rem'}}>
        <Link to="/signup" className="btn btn-primary">Open Savings Account</Link>
      </div>
    </div>
  </div>
);

export default SavingsPage;
