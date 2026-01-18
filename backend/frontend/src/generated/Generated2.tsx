import React from 'react';

interface HeadlineProps {
  text: string;
  className?: string;
}

const Headline: React.FC<HeadlineProps> = ({ text, className = '' }) => {
  return (
    <h1 className={`text-4xl font-bold text-center text-gray-800 my-4 ${className}`}>
      {text}
    </h1>
  );
};

export default Headline;