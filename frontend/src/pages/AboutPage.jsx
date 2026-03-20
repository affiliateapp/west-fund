import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>About Stamford</h1>
    <div className="card">
      <h2>Our Story</h2>
      <p>y</p>
      
      <h2 style={{marginTop: '2rem'}}>Our Mission</h2>
      <p>To empower individuals and businesses with innovative financial solutions that help them achieve their goals and secure their financial future.</p>
      
      <h2 style={{marginTop: '2rem'}}>Why Choose Stamford Members Credit Union?</h2>
      <ul style={{marginLeft: '2rem'}}>
        <li>Competitive interest rates</li>
        <li>24/7 online banking</li>
        <li>Advanced security features</li>
        <li>Personalized customer service</li>
        <li>Mobile banking app</li>
      </ul>
    </div>
  </div>
);

export default AboutPage;
