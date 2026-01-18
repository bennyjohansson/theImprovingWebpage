import React from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  React.useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">{title}</h1>
    </div>
  );
};

// Usage example
const App: React.FC = () => {
  return <PageTitle title="Hello world!" />;
};

export default App;