export { getPaths, splitPath, joinPath } from './analyze'
export { parseCommand } from './parse'
export { updateTree, removeTemporaryState, getChildState } from './state'

type EditingNameType = boolean | 'new'

interface Action {
  name: string
  title?: string
  primary?: boolean
  show?: string
}

interface Attachments {
  open: boolean
}

export interface State {
  _expanded?: boolean
  _showOnly?: string[]
  _editingName?: EditingNameType
  _actions?: Action[]
  _hidden?: boolean
  _view?: string | null
  _attachments?: Attachments
  [key: string]:
    | State
    | boolean
    | string[]
    | EditingNameType
    | Action[]
    | string
    | Attachments
    | null
}
