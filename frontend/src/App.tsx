import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div id="home">
        <h1>Home Page</h1>
        <p>Welcome to the home page!</p>
      </div>
      <div id="about">
        <h1>About Page</h1>
        <p>Learn more about us here.</p>
      </div>
      <div id="contact">
        <h1>Contact Page</h1>
        <p>Get in touch with us.</p>
      </div>
    </div>
  );
}

export default App;