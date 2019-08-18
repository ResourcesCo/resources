import Help from "./help";

export default ({type, code, text, url, content}) => {
  if (type === 'help') {
    return <Help />
  } else if (type === 'error') {
    if (code === 'not_found') {
      return <p>Results not found.</p>
    } else {
      return <p>{text || 'Unknown error.'}</p>
    }
  } else if (type === 'link') {
    return <p><a target="_blank" href={url}>{text}</a></p>
  } else if (type === 'text') {
    return <p>
        {text.split("\n").map(s => <div>{s}</div>)}
    </p>
  } else if (type === 'input') {
    return <div className="input-message">{text.split("\n").map((s, i) => <div key={i}>{s}</div>)}</div>
  } else if (type === 'image') {
    return <img src={url} style={{maxWidth: '100%'}} />
  } else {
    return content
  }
}