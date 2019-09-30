import Help from "./help"
import Data from './data'
import Form from './form'
import { useState } from 'react'
import Loader from 'react-loader-spinner'

export default ({type, code, text, url, content, theme, ...props}) => {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = () => {
    const { onLoad } = props
    setLoaded(true)
    onLoad()
  }
  if (type === 'help') {
    return <Help theme={theme} />
  } else if (type === 'error') {
    if (code === 'not_found') {
      return <div>Results not found.</div>
    } else {
      return <div>{text || 'Unknown error.'}</div>
    }
  } else if (type === 'link') {
    return <div><a target="_blank" href={url}>{text}</a></div>
  } else if (type === 'text' || (type === 'form-status' && text)) {
    return <div>
        {text.split("\n").map((s, i) => <div key={i}>{s}</div>)}
    </div>
  } else if (type === 'input') {
    const { loading } = props
    const lines = text.split("\n")
    return <div className="input-message">
      {lines.map((s, i) => <div key={i}>
        {s}{i === (lines.length - 1) && loading && <div style={{display: 'inline-block', paddingLeft: 5}}><Loader type="ThreeDots" color={theme.inputColor} height={15} width={20} /></div>}
      </div>)}
    </div>
  } else if (type === 'image') {
    const imageStyle = (loaded ?
      {maxHeight: '50vh'} :
      {height: '50vh'})
    return <img src={url} style={imageStyle} onLoad={() => setTimeout(handleLoaded, 10)} />
  } else if (type === 'data') {
    const { data, keyField, title, link, pickPrefix, onPickId } = props
    return <Data
      data={data}
      keyField={keyField}
      title={title}
      link={link}
      theme={theme}
      onPickId={onPickId}
      pickPrefix={pickPrefix}
    />
  } else if (type === 'form') {
    const { fields, message, commandId, isNew, onSubmitForm } = props
    return <Form
      fields={fields}
      message={message}
      commandId={commandId}
      theme={theme}
      isNew={isNew}
      onSubmitForm={onSubmitForm}
    />
  } else {
    return null
  }
}
