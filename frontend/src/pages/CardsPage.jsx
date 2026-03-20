import React from 'react';

const CardsPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Credit & Debit Cards</h1>
    <div className="grid">
      <div className="card">
        <h2>💎 Premium Credit Card</h2>
        <p>Exclusive benefits for our valued customers</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>5% cashback on all purchases</li>
          <li>No annual fee first year</li>
          <li>Travel insurance included</li>
          <li>Airport lounge access</li>
        </ul>
      </div>
      <div className="card">
        <h2>💳 Standard Debit Card</h2>
        <p>Perfect for everyday spending</p>
        <ul style={{marginLeft: '2rem'}}>
          <li>Zero liability protection</li>
          <li>ATM fee reimbursement</li>
          <li>Contactless payments</li>
          <li>Real-time notifications</li>
        </ul>
      </div>
    </div>
  </div>
);

export default CardsPage;
