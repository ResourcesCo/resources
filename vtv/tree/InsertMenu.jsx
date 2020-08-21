import Menu, { MenuItem } from '../generic/Menu'

export default function InsertMenu({
  showAll,
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
      popperProps={{
        placement: 'left-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('append')}>Append</MenuItem>
      )}
      {['object', 'array'].includes(nodeType) && (
        <MenuItem onClick={() => insert('prepend')}>Prepend</MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('below')}>After</MenuItem>
      )}
      {!showAll && ['object', 'array'].includes(parentType) && (
        <MenuItem onClick={() => insert('above')}>Before</MenuItem>
      )}
    </Menu>
  )
}
