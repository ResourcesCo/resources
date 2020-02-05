const Example = ({ children }) => {
  return <div>{children}</div>
}

const Details = ({ children, theme }) => {
  return (
    <div>
      {children}
      <style jsx>{`
        div {
          padding-left: 30px;
          font-size: 80%;
          color: ${theme.lightTextColor};
        }
      `}</style>
    </div>
  )
}

export default ({ theme, help }) => {
  return (
    <div style={{ margin: 5 }}>
      {(help || []).map(({ command, subCommand, params = [], details }, i) => {
        return (
          <div key={i}>
            <Example>
              {command} {subCommand}{' '}
              {params.map((param, i) => (
                <i key={i}>{param} </i>
              ))}
            </Example>
            <Details theme={theme}>{details}</Details>
          </div>
        )
      })}
    </div>
  )
}
