import React from 'react';

const LoansPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Loans</h1>
    <div className="grid">
      <div className="card">
        <h2>🏠 Home Loans</h2>
        <p>Rates starting from 3.5% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Up to 30 years term</li>
          <li>Low down payment options</li>
          <li>Fast approval</li>
        </ul>
      </div>
      <div className="card">
        <h2> Auto Loans</h2>
        <p>Rates starting from 4.5% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>New and used vehicles</li>
          <li>Flexible payment terms</li>
          <li>Same-day approval</li>
        </ul>
      </div>
      <div className="card">
        <h2>💼 Personal Loans</h2>
        <p>Rates starting from 5.99% APR</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Up to $50,000</li>
          <li>No collateral needed</li>
          <li>Quick funding</li>
        </ul>
      </div>
    </div>
  </div>
);

export default LoansPage;