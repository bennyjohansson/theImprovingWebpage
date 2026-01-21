```typescript
import React from 'react';
import './App.css'; // Assuming you have a CSS file for styling

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-header">Welcome to My App</h1>
      </header>
    </div>
  );
};

export default App;
```

```css
/* Assuming in the same directory or imported from App.css */
.main-header {
  color: purple;
}
```