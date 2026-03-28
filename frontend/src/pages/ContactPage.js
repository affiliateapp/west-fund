import React from 'react';

const ContactPage = () => (
  <div className="container fade-in" style={{padding: '4rem 0'}}>
    <h1 style={{color: 'var(--primary-navy)', marginBottom: '2rem'}}>Contact Us</h1>
    <div className="card">
      <h2>Get in Touch</h2>
      <p>We're here to help! Reach out to us through any of the following methods:</p>
      
      <div style={{marginTop: '2rem'}}>
        <h3>📞 Phone</h3>
        <p>+34 612 345 678 (24/7 Support)</p>
        
        <h3 style={{marginTop: '1.5rem'}}>✉️ Email</h3>
        <p>support@Stamford.com</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🏢 Address</h3>
        <p>613 Bedford St, United States</p>
        
        <h3 style={{marginTop: '1.5rem'}}>🕒 Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 4:00 PM<br/>Sunday: Closed</p>
      </div>
    </div>
  </div>
);

export default ContactPage;