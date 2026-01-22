```jsx
import React from 'react';
import SuggestionForm from './components/SuggestionForm';
import SuggestionList from './components/SuggestionList';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      {/* Main header with updated style */}
      <header className="main-header" style={{ color: 'blue' }}>
        <h1>Welcome to Our Web Application</h1>
      </header>
      <SuggestionForm />
      <SuggestionList />
      <Footer />
    </div>
  );
}

export default App;
```