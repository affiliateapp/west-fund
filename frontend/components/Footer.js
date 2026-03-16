import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#1e3c72',
      color: 'white',
      padding: '3rem 5%',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{marginBottom: '1rem'}}>West Fund</h3>
          <p style={{color: '#ccc', fontSize: '0.9rem'}}>
            Your trusted partner in modern banking. Secure, fast, and reliable financial services.
          </p>
        </div>

        <div>
          <h4 style={{marginBottom: '1rem'}}>Quick Links</h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>About Us</a>
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>Services</a>
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>Contact</a>
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>FAQs</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{marginBottom: '1rem'}}>Legal</h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>Privacy Policy</a>
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>Terms of Service</a>
            </li>
            <li style={{marginBottom: '0.5rem'}}>
              <a href="#" style={{color: '#ccc', textDecoration: 'none'}}>Security</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{marginBottom: '1rem'}}>Contact Us</h4>
          <p style={{color: '#ccc', fontSize: '0.9rem'}}>
            📧 support@westfund.com<br />
            📞 +1 (555) 123-4567<br />
            📍 123 Banking Street, NY 10001
          </p>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '2rem',
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#ccc'
      }}>
        <p>&copy; {new Date().getFullYear()} West Fund. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;