import React, { useEffect, useState } from 'react';
import { LiveProvider, LiveError, LivePreview } from 'react-live';

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
          return (
            <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Suggestion #{suggestion.id}:
                </span>
                <p className="text-sm text-gray-600 mt-1">{suggestion.content}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                  <div className="mb-4">
                    <div className="text-5xl mb-3 text-center">🎨</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                      {suggestion.component_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Component deployed and rendered live!
                    </p>
                  </div>
                  
                  {/* Live component rendering */}
                  <div className="bg-white p-4 rounded border-2 border-green-300 mb-4">
                    <p className="text-xs text-green-700 font-semibold mb-2">✨ Live Component:</p>
                    <LiveProvider code={suggestion.generated_code || ''} scope={{ React }}>
                      <div className="bg-gray-50 p-4 rounded">
                        <LivePreview />
                        <LiveError className="text-red-600 text-sm mt-2" />
                      </div>
                    </LiveProvider>
                  </div>
                  
                  {/* Code preview */}
                  <details className="bg-white p-4 rounded border border-gray-200">
                    <summary className="text-xs text-gray-700 font-medium cursor-pointer">
                      📄 View Source Code
                    </summary>
                    <pre className="text-xs overflow-x-auto bg-gray-50 p-2 rounded mt-2">
                      <code>{suggestion.generated_code}</code>
                    </pre>
                  </details>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentGallery;
