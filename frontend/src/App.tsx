import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <div className={darkTheme ? 'app dark-theme' : 'app'}>
      <header className="app-header">
        <h1>Welcome to the Self-Improving Web App</h1>
        <button onClick={toggleTheme}>
          Toggle {darkTheme ? 'Light' : 'Dark'} Theme
        </button>
      </header>
      {/* Other components and content go here */}
    </div>
  );
};

export default App;