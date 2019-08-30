import Help from "./help";
import { useState } from 'react'

export default ({type, code, text, url, content, onLoad}) => {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = () => {
    setLoaded(true)
    onLoad()
  }
  const imageStyle = (loaded ?
    {maxHeight: '50vh'} :
    {height: '50vh'})
  if (type === 'help') {
    return <Help />
  } else if (type === 'error') {
    if (code === 'not_found') {
      return <div>Results not found.</div>
    } else {
      return <div>{text || 'Unknown error.'}</div>
    }
  } else if (type === 'link') {
    return <div><a target="_blank" href={url}>{text}</a></div>
  } else if (type === 'text') {
    return <div>
        {text.split("\n").map((s, i) => <div key={i}>{s}</div>)}
    </div>
  } else if (type === 'input') {
    return <div className="input-message">{text.split("\n").map((s, i) => <div key={i}>{s}</div>)}</div>
  } else if (type === 'image') {
    return <img src={url} style={imageStyle} onLoad={() => setTimeout(handleLoaded, 10)} />
  } else {
    return content || null
  }
}
