import React from 'react';
import './App.css'; // Assuming there's a CSS file for styling

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Main Title</h1>
        <h2 style={{ color: 'green' }}>First Sub-header</h2>
        <h2>Second Sub-header</h2>
      </header>
    </div>
  );
}

export default App;