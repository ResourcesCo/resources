import { useRef } from 'react'
import { getState } from './state'
import { hasChildren } from './analyze'
import useClickOutside from './use-click-outside'

export default ({ onPickId, name, value, path, state, commandId, onSubmitForm, onClose, theme }) => {
  const ref = useRef(null)
  useClickOutside(ref, onClose)
  const isArray = Array.isArray(value)
  const viewType = getState(state)._viewType || 'tree'

  const setViewType = viewType => {
    onSubmitForm({
      message: '_tree update',
      commandId,
      formData: {
        path,
        state: { ...state, _viewType: viewType, _expanded: true }
      }
    })
    onClose()
  }

  const pickId = () => {
    onPickId(name)
    onClose()
  }

  const copyValue = () => {
    window.Clipboard.writeText(JSON.stringify(value))
  }

  return <div className="outer" ref={ref}>
    <div className="inner">
      {
        ['tree', 'table', 'json'].map(key => {
          if (key === viewType) {
            return null
          }
          if (key === 'table' && !hasChildren(value)) {
            return null
          }
          return <div key={key}><button onClick={() => setViewType(key)}>View as {key}</button></div>
        })
      }
      <div><button onClick={pickId}>Paste into console</button></div>
    </div>
    <style jsx>{`
      div {
        background: none;
      }
      .outer {
        position: relative;
        left: 0;
        top: 0;
      }
      .inner {
        position: absolute;
        top: 100%;
        top: calc(100% + 5px);
        left: 12px;
        width: 5cm;
        background-color: ${theme.menuBackground};
        padding: 0 5px;
        border-radius: 5px;
      }
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0 0 8px;
        margin: 0;
        outline: none;
      }
    `}</style>
  </div>
}
