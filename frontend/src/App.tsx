import React from 'react';

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      <div>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Facebook</a> | 
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Twitter</a> | 
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={linkStyle}>Instagram</a>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px',
  backgroundColor: '#f1f1f1',
  position: 'fixed',
  left: '0',
  bottom: '0',
  width: '100%',
};

const linkStyle: React.CSSProperties = {
  margin: '0 10px',
  textDecoration: 'none',
  color: '#000',
};

// Main App Component
const App: React.FC = () => {
  return (
    <div>
      {/* Other components and content would be here */}
      <Footer />
    </div>
  );
};

export default App;