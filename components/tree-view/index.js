import { useState } from 'react'
import ExpandButton from './expand-button'
import LabelButton from './label-button'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
}

const testHasChildren = value => {
  if (isObject(value)) {
    return Object.keys(value).length > 0
  } else if (Array.isArray(value)) {
    return value.length > 0
  } else {
    return false
  }
}

const TreeView = ({name, value, theme}) => {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = testHasChildren(value)
  return <>
    <div>
      <ExpandButton hasChildren={hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      <LabelButton theme={theme}>{name}</LabelButton>
      <span className="inline-details">
        {isObject(value) && (hasChildren ? <em>({Object.keys(value).length} items)</em> : '{}')}
        {Array.isArray(value) && (hasChildren ? <em>({Object.keys(value).length} items)</em> : '[]')}
        {typeof value === 'string' && value}
        {value === null && <em>null</em>}
        {typeof value !== 'string' && typeof value !== 'object' && <em>{JSON.stringify(value)}</em>}
      </span>
      <style jsx>{`
        .inline-details {
          margin-left: 10px;
        }
      `}</style>
    </div>
    {
      expanded && (isObject(value) || Array.isArray(value)) && <div className="children">
        {
          Object.keys(value).map(key => (
            <TreeView key={key} name={key} value={value[key]} theme={theme} />
          ))
        }
        <style jsx>{`
          .children {
            padding-left: 10px;
          }
        `}</style>
      </div>
    }
  </>
}

export default TreeView
