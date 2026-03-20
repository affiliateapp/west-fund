import React from 'react';
import { Link } from 'react-router-dom';

const CurrentAccountPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Current Account</h1>
    <div className="card">
      <h2>Your Everyday Banking Partner</h2>
      <p>Perfect for managing your daily transactions with ease and convenience.</p>
      
      <h2 style={{marginTop: '2rem'}}>Features</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Unlimited transactions</li>
        <li>Free debit card</li>
        <li>Online bill payment</li>
        <li>Mobile banking</li>
        <li>Overdraft protection</li>
      </ul>
      
      <div style={{marginTop: '2rem'}}>
        <Link to="/signup" className="btn btn-primary">Open Current Account</Link>
      </div>
    </div>
  </div>
);

export default CurrentAccountPage;
