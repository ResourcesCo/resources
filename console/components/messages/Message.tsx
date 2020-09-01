import React, { useState, FunctionComponent, ComponentType } from 'react'
import Tree from './Tree'
import Embed from './Embed'
import Loader from 'react-loader-spinner'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Theme } from 'vtv'
import { State } from 'vtv-model'

interface MessageViewProps {
  loading?: boolean
  name?: string
  value?: object
  state?: State
  type: string
  code?: any
  text?: string
  url?: string
  codeMirrorComponent?: ComponentType
  onPickId: Function
  onSubmitForm: Function
  onMessage: Function
  isNew?: boolean
  path?: string
  commandId?: string
  theme: Theme
}

const MessageView: FunctionComponent<MessageViewProps> = ({
  loading,
  name,
  value,
  state,
  type,
  code,
  text,
  url,
  codeMirrorComponent,
  onPickId,
  onSubmitForm,
  onMessage,
  isNew,
  path,
  commandId,
  theme,
}) => {
  if (type === 'tree') {
    return <Tree name={name} value={value} state={state} theme={theme} />
  } else if (type === 'embed') {
    return <Embed path={path} commandId={commandId} />
  } else if (type === 'error') {
    if (code === 'not_found') {
      return <div style={{ margin: 5 }}>Results not found.</div>
    } else {
      return <div style={{ margin: 5 }}>{text || 'Unknown error.'}</div>
    }
  } else if (type === 'link') {
    return (
      <div style={{ margin: 5 }}>
        <a target="_blank" href={url}>
          {text}
        </a>
      </div>
    )
  } else if (type === 'text' || (type === 'form-status' && text)) {
    return (
      <div style={{ margin: 5 }}>
        {(text || '').split('\n').map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    )
  } else if (type === 'input') {
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
                  height={12}
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
            line-height: 1.5;
          }
          .input-message:hover .input-link {
            display: inline;
          }
        `}</style>
      </div>
    )
  } else if (type === 'image') {
    const imageStyle = { maxHeight: '50vh' }
    return <img src={url} style={{ ...imageStyle, margin: 5 }} />
  } else {
    return null
  }
}

export default MessageView
