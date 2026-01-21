```tsx
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Main Header</h1>
      </header>
    </div>
  );
};

export default App;
```

App.css:
```css
.App-header h1 {
  color: blue;
  font-size: 18px;
}
```