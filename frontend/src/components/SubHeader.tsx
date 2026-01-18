```tsx
import React from 'react';
import './SubHeader.css'; // Assuming there's a CSS file for styling

const SubHeader: React.FC<{ text: string }> = ({ text }) => {
  return <h2 className="sub-header">{text}</h2>;
};

export default SubHeader;
```

Assuming you have a CSS file named `SubHeader.css` to style the sub-header with bold font, you can add the following CSS rule:

```css
.sub-header {
  font-weight: bold;
}
```