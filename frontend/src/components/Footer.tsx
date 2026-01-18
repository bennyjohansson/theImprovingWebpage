import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={textContainerStyle}>
        <p style={textStyle}>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
      <div style={socialLinksContainerStyle}>
        <a href="https://www.facebook.com" style={linkStyle} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        <a href="https://www.twitter.com" style={linkStyle} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href="https://www.instagram.com" style={linkStyle} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  textAlign: 'center',
  borderTop: '1px solid #e7e7e7',
};

const textContainerStyle: React.CSSProperties = {
  marginBottom: '10px',
};

const textStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  color: '#6c757d',
};

const socialLinksContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const linkStyle: React.CSSProperties = {
  color: '#007bff',
  textDecoration: 'none',
  fontSize: '14px',
};

export default Footer;
