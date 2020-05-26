import Menu, { MenuItem } from '../generic/Menu'

export default function InsertMenu({
  showAll,
  nodeType,
  parentType,
  path,
  onMessage,
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
      popperProps={{
        placement: 'left-start',
        modifiers: { offset: { offset: '0, -3' } },
      }}
      {...props}
    >
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('above')}>Above</MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('below')}>Below</MenuItem>
      )}
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('append')}>Child (Append)</MenuItem>
      )}
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('prepend')}>Child (Prepend)</MenuItem>
      )}
    </Menu>
  )
}
