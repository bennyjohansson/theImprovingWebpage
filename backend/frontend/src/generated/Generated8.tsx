import React from 'react';

interface PageProps {
  title: string;
}

const Page: React.FC<PageProps> = ({ title }) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Page;

// Usage example
// <Page title="Hello world!" />