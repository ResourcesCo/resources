import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

export default function InsertMenu({
  nodeType,
  parentType,
  path,
  context: { onMessage },
  context,
  ...props
}) {
  const insert = position => {
    onMessage({
      path,
      action: 'insert',
      position,
    })
  }
  return (
    <Menu
      onClose={() => null}
      context={context}
      {...props}
    >
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('append')}>Append</MenuItem>
      )}
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('prepend')}>Prepend</MenuItem>
      )}
      {path.length > 0 && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('below')}>After</MenuItem>
      )}
      {path.length > 0 && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('above')}>Before</MenuItem>
      )}
    </Menu>
  )
}
