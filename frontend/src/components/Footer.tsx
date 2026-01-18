import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <p style={copyrightStyle}>© 2023 Your Company. All rights reserved.</p>
        <div style={socialLinksStyle}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Facebook
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Twitter
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '1rem 0',
  textAlign: 'center',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
};

const copyrightStyle: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  fontSize: '0.9rem',
  color: '#6c757d',
};

const socialLinksStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
};

const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'none',
  fontSize: '1rem',
};

export default Footer;