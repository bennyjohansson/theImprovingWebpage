```typescript
import React from 'react';

const SubHeader: React.FC = ({ children }) => {
  return (
    <h2 style={{ fontWeight: 'bold' }}>
      {children}
    </h2>
  );
};

export default SubHeader;
```