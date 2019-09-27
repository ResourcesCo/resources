import { useState } from 'react'

export default ({data, keyField, link = 'html_url', title, theme, pickPrefix='', onPickId}) => {
  const [pageSize, setPageSize] = useState(5)
  return <div>
    {
      data.slice(0, pageSize).map(record => {
        const titleEl = record[title] ? record[title] : <i>(empty)</i>
        const url = link && record[link]
        return (
          <div key={record[keyField]}>
            <button className="id" onClick={() => onPickId(`${pickPrefix}${record[keyField]}`)}>{record[keyField]}</button>
            {' '}
            {
              url ? <a target="_blank" href={url}>{titleEl}</a> : titleEl
            }
          </div>
        )
      })
    }
    {data.length > pageSize && <button className="action" onClick={() => setPageSize(pageSize + 5)}>show more</button>}
    {pageSize > 5 && <button className="action" onClick={() => setPageSize(pageSize - 5)}>show less</button>}
    <style jsx>{`
      button {
        cursor: pointer;
        background-color: ${theme.bubble1};
        border-radius: 9999px;
        outline: none;
      }

      button.id {
        padding: 3px;
      }

      button.action {
        padding: 4px 12px;
      }
    `}</style>
  </div>
}
