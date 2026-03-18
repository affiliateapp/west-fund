import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="disclaimer">
        It's easy to answer your query online. Visit our Help page to find out how.
      </div>
      <div className="footer-content">
        <div>
          <h3>Stamford</h3>
          <p>Your trusted partner in financial services</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul style={{listStyle: 'none'}}>
            <li><Link to="/about" style={{color: 'white'}}>About Us</Link></li>
            <li><Link to="/contact" style={{color: 'white'}}>Contact</Link></li>
            <li><Link to="/savings" style={{color: 'white'}}>Savings</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Email: infoStamford.com</p>
          <p>Phone: 1-800-Stamford</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Stamford. All rights reserved. | Stamford Banking System</p>
      </div>
    </div>
  </footer>
);

export default Footer;