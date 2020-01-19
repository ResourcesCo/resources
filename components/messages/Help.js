const Example = ({ children }) => {
  return <div>
    {children}
  </div>
}

const Details = ({ children, theme }) => {
  return <div>
    {children}
    <style jsx>{`
        div {
          padding-left: 30px;
          font-size: 80%;
          color: ${theme.lightTextColor};
        }
      `}</style>

  </div>
}

export default ({theme, help}) => {
  return <div>
    {
      (help || []).map(({command, subCommand, args = [], details}, i) => {
        return <div key={i}>
          <Example>{command} {subCommand} {args.map((arg, i) => <i key={i}>{arg}{' '}</i>)}</Example>
          <Details theme={theme}>{details}</Details>
        </div>
      })
    }
  </div>
}
