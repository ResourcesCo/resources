import Help from './Help'
import Data from './Data'
import DataTree from './DataTree'
import Form from './Form'
import TreeView from 'vtv'
import { useState } from 'react'
import Loader from 'react-loader-spinner'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ type, code, text, url, content, theme, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = () => {
    const { onLoad } = props
    setLoaded(true)
    onLoad()
  }
  if (type === 'help') {
    const { help } = props
    return <Help theme={theme} help={help} />
  } else if (type === 'error') {
    if (code === 'not_found') {
      return (
        <div style={{ marginLeft: 5, marginRight: 5 }}>Results not found.</div>
      )
    } else {
      return (
        <div style={{ marginLeft: 5, marginRight: 5 }}>
          {text || 'Unknown error.'}
        </div>
      )
    }
  } else if (type === 'link') {
    return (
      <div>
        <a target="_blank" href={url}>
          {text}
        </a>
      </div>
    )
  } else if (type === 'text' || (type === 'form-status' && text)) {
    return (
      <div>
        {(text || '').split('\n').map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    )
  } else if (type === 'code') {
    return <pre style={{ fontFamily: 'monospace' }}>{text}</pre>
  } else if (type === 'input') {
    const { onPickId, commandId, loading } = props
    const lines = text.split('\n')
    return (
      <div className="input-message">
        {lines.map((s, i) => (
          <div key={i}>
            {s}
            {i === lines.length - 1 && (
              <span
                onClick={() => onPickId(commandId)}
                className="input-link"
                style={{ cursor: 'pointer', paddingLeft: 4 }}
              >
                <FontAwesomeIcon size="xs" icon={faLink} />
              </span>
            )}
            {i === lines.length - 1 && loading && (
              <div style={{ display: 'inline-block', paddingLeft: 5 }}>
                <Loader
                  type="ThreeDots"
                  color={theme.inputColor}
                  height={15}
                  width={20}
                />
              </div>
            )}
          </div>
        ))}
        <style jsx>{`
          .input-link {
            display: none;
          }
          .input-message {
            margin-left: 5px;
          }
          .input-message:hover .input-link {
            display: inline;
          }
        `}</style>
      </div>
    )
  } else if (type === 'image') {
    const imageStyle = loaded ? { maxHeight: '50vh' } : { height: '50vh' }
    return (
      <img
        src={url}
        style={{ ...imageStyle, marginLeft: 5 }}
        onLoad={() => setTimeout(handleLoaded, 10)}
      />
    )
  } else if (type === 'data') {
    const { data, keyField, title, link, pickPrefix, onPickId } = props
    return (
      <Data
        data={data}
        keyField={keyField}
        title={title}
        link={link}
        theme={theme}
        onPickId={onPickId}
        pickPrefix={pickPrefix}
      />
    )
  } else if (type === 'form') {
    const { fields, isNew, message, commandId, onSubmitForm } = props
    return (
      <Form
        fields={fields}
        theme={theme}
        isNew={isNew}
        message={message}
        commandId={commandId}
        onSubmitForm={onSubmitForm}
      />
    )
  } else if (type === 'tree') {
    const { name, value, state, onMessage, commandId, onPickId } = props

    const onChange = ({ name, value, state }) => {
      onMessage({
        type: 'tree-update',
        name,
        value,
        state,
        treeCommandId: commandId,
      })
    }

    return (
      <div>
        <TreeView
          name={name}
          value={value}
          state={state}
          theme={theme}
          onChange={onChange}
          onPickId={onPickId}
        />
        <style jsx>{`
          div {
            margin: 5px 0;
          }
        `}</style>
      </div>
    )
  } else {
    return null
  }
}
