import React from 'react';
import './GreetingCard.css'; // Assuming there's a CSS file for styling

const GreetingCard = () => {
  return (
    <div className="greeting-card">
      <h1 className="greeting-card-title">Welcome!</h1>
      <p className="greeting-card-message">We are delighted to have you here. Enjoy your stay!</p>
    </div>
  );
};

export default GreetingCard;