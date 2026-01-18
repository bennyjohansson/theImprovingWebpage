import React from 'react';

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2023 Your Company Name</p>
      <div>
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
    </footer>
  );
};

// App Component
const App: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Web Application</h1>
      {/* Other components and content go here */}
      <Footer />
    </div>
  );
};

// Styles
const footerStyle: React.CSSProperties = {
  backgroundColor: '#f1f1f1',
  textAlign: 'center',
  padding: '10px 0',
  position: 'fixed',
  bottom: 0,
  width: '100%',
};

const linkStyle: React.CSSProperties = {
  margin: '0 10px',
  textDecoration: 'none',
  color: 'blue',
};

export default App;