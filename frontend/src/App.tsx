import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <GreetingCard />
    </div>
  );
};

const GreetingCard: React.FC = () => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffebcd',
    border: '2px solid #ff69b4',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    color: '#4b0082',
    maxWidth: '300px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  };

  return (
    <div style={cardStyle}>
      <h1>Welcome!</h1>
      <p>Have a great day!</p>
    </div>
  );
};

export default App;