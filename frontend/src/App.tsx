```javascript
import React from 'react';
import SuggestionForm from './SuggestionForm';
import SuggestionList from './SuggestionList';
import Footer from './Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <header style={{ color: 'blue' }} className="App-header">
        {/* Remove any conflicting classes like text-gray-600 if present */}
        <h1>Welcome to the Self-Improving Web Application</h1>
      </header>
      <main>
        <SuggestionForm />
        <SuggestionList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
```