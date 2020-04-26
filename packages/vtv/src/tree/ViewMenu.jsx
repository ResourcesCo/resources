import Menu, { MenuItem } from '../generic/Menu'
import { hasChildren } from '../model/analyze'

const labels = { tree: 'Tree', table: 'Table' }

export default function InsertMenu({
  path,
  value,
  state,
  onMessage,
  onViewChanged,
  ...props
}) {
  const setViewType = viewType => {
    onMessage({
      path,
      state: { _viewType: viewType, _expanded: true },
    })
    onViewChanged()
  }
  const { _viewType: viewType } = state
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: { offset: { offset: '0, -3' } },
      }}
      {...props}
    >
      {['tree', 'table'].map(key => {
        if (key === 'table' && !hasChildren(value)) {
          return null
        }
        return (
          <MenuItem
            key={key}
            onClick={() => setViewType(key)}
            checked={key === viewType}
          >
            {labels[key]}
          </MenuItem>
        )
      })}
    </Menu>
  )
}
