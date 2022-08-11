import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './src/css/vtv.css'
import View from './src/View'

const App = () => {
  const [treeData1, setTreeData1] = useState({
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
    <View
      name={treeData1.name}
      value={treeData1.value}
      state={treeData1.state}
      onChange={setTreeData1}
      onPickId={() => undefined}
      onAction={() => undefined}
      theme="dark"
    />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
, document.getElementById('root') as HTMLElement)
