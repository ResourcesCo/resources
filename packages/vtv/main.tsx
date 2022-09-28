import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './src/css/vtv.css';
import View from './src/';

const App = () => {
  const [treeData1, setTreeData1] = useState<any>({
    name: "root",
    value: {
      name: 'Test',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
      },
    },
  })

  return (
    <div>
      <View
        name={treeData1.name}
        value={treeData1.value}
        state={treeData1.state}
        onChange={setTreeData1}
        onPickId={() => undefined}
        onAction={() => undefined}
        theme="dark"
      />
    </div>
  )
}

const root = createRoot(document.getElementById('root') as Element);
root.render(<React.StrictMode>
  <App />
</React.StrictMode>);
