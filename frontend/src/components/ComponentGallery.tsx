import React, { useEffect, useState } from 'react';

interface Suggestion {
  id: number;
  content: string;
  status: string;
  generated_code: string | null;
  deployed: boolean;
  component_name: string | null;
  created_at: string;
}

const ComponentGallery: React.FC = () => {
  const [deployed, setDeployed] = useState<Suggestion[]>([]);
  const [components, setComponents] = useState<{ [key: string]: React.ComponentType }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeployedComponents();
    const interval = setInterval(fetchDeployedComponents, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDeployedComponents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/suggestions/deployed/list');
      if (!response.ok) throw new Error('Failed to fetch deployed components');
      
      const data = await response.json();
      setDeployed(data);
      
      // Dynamically import deployed components
      for (const suggestion of data) {
        if (suggestion.component_name && !components[suggestion.component_name]) {
          try {
            const module = await import(`../generated/${suggestion.component_name}.tsx`);
            setComponents(prev => ({
              ...prev,
              [suggestion.component_name!]: module.default
            }));
          } catch (err) {
            console.error(`Failed to load component ${suggestion.component_name}:`, err);
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deployed components:', err);
      setError(err instanceof Error ? err.message : 'Failed to load components');
      setLoading(false);
    }
  };

  if (loading && deployed.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Components</h2>
        <p className="text-gray-600">Loading deployed components...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Components</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (deployed.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Live Components</h2>
        <p className="text-gray-600">No components deployed yet. Deploy an approved suggestion to see it here!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Live Components</h2>
      
      <div className="space-y-6">
        {deployed.map((suggestion) => {
          const Component = components[suggestion.component_name!];
          
          return (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Suggestion #{suggestion.id}:
                </span>
                <p className="text-sm text-gray-600 mt-1">{suggestion.content}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                {Component ? (
                  <div className="bg-gray-50 p-4 rounded">
                    <Component />
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded text-yellow-800 text-sm">
                    Component loading... (refresh the page if it doesn't appear)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentGallery;
