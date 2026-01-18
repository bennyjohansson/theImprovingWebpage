import React from 'react';

interface WelcomeTitleProps {
  title: string;
  subtitle?: string;
}

const WelcomeTitle: React.FC<WelcomeTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <h2 className="text-xl font-medium">{subtitle}</h2>}
    </div>
  );
};

export default WelcomeTitle;