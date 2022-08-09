import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './src/css/vtv.css'
import View from './src/View'

const App = () => {
  const [treeData1, setTreeData1] = useState({
    name: "root",
    value: 'example',
  })
  const [treeData2, setTreeData2] = useState({
    name: "root",
    value: {
      strings: [
        "1",
        "true",
        "null",
      ],
      "non-strings": [
        1,
        true,
        null,
      ],
    },
    state: {
      _expanded: true,
      strings: {_expanded: true},
      'non-strings': {_expanded: true},
    }
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
