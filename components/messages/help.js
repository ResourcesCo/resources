import { commandHelp } from '../../commands'

const Example = ({ children }) => {
  return <div>
    {children}
  </div>
}

const Details = ({ children }) => {
  return <div>
    {children}
    <style jsx>{`
        div {
          padding-left: 30px;
          font-size: 80%;
          color: #ccc;
        }
      `}</style>

  </div>
}

export default () => {
  return <div>
    {
      commandHelp.map(({command, subCommand, args = [], details}, i) => {
        return <div key={i}>
          <Example>{command} {subCommand} {args.map((arg, i) => <i key={i}>{arg}{' '}</i>)}</Example>
          <Details>{details}</Details>
        </div>
      })
    }
  </div>
}
