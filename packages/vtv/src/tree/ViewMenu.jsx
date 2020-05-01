import Menu, { MenuItem } from '../generic/Menu'
import { hasChildren } from '../model/analyze'
import defaultView from '../util/defaultView'

const labels = { tree: 'Tree', table: 'Table', json: 'JSON' }

export default function ViewMenu({
  path,
  value,
  state,
  nodeType,
  stringType,
  mediaType,
  onMessage,
  onViewChanged,
  ...props
}) {
  const setView = view => {
    onMessage({
      path,
      action: 'setView',
      view,
    })
    onViewChanged()
  }
  const { _view: view } = state
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: { offset: { offset: '0, -3' } },
      }}
      {...props}
    >
      <MenuItem checked={view === null}>
        Default ({labels[defaultView({ nodeType, stringType, mediaType })]})
      </MenuItem>
      {['tree', 'table', 'json'].map(key => {
        if (key === 'table' && !hasChildren(value)) {
          return null
        }
        return (
          <MenuItem
            key={key}
            onClick={() => setView(key)}
            checked={view === key}
          >
            {labels[key]}
          </MenuItem>
        )
      })}
    </Menu>
  )
}
