export default ({data, keyField, link = 'html_url', title, theme, pickPrefix='', onPickId}) => {
  return <div>
    {
      data.map(record => {
        const titleEl = record[title] ? record[title] : <i>(empty)</i>
        const url = link && record[link]
        return (
          <div key={record[keyField]}>
            <button onClick={() => onPickId(`${pickPrefix}${record[keyField]}`)}>{record[keyField]}</button>
            {' '}
            {
              url ? <a target="_blank" href={url}>{titleEl}</a> : titleEl
            }
          </div>
        )
      })
    }
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        padding: 3px;
        outline: none;
      }
    `}</style>
  </div>
}
