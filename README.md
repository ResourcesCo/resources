# resources.co - a web console

TODO: intro

![brief screencast](https://gh-media.resources.co/resourcesco-butterfly-demo-2.gif)

## web app

It's a Next.js web app. Run `yarn dev` to run the development server or
`yarn build` to build it.

## vtv

`yarn add vtv`

```jsx
import React, { useState } from 'react'
import TreeView from 'vtv'

export default () => {
  const [value, setValue] = useState({ hello: 'world' })
  const [state, setState] = useState(null)
  const onChange = ({ value, state }) => {
    setValue(value)
    setState(state)
  }
  return (
    <TreeView value={value} state={state} onChange={onChange} theme="dark" />
  )
}
```
