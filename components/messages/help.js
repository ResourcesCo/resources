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
    <div>
      <Example>docs <i>url</i></Example>
      <Details>find api docs for a url</Details>
    </div>
    <div>
      <Example>giphy auth <i>api-key</i></Example>
      <Details>store api key for giphy</Details>
    </div>
    <div>
      <Example>giphy <i>tag</i></Example>
      <Details>show a gif from giphy</Details>
    </div>
    <div>
      <Example>note <i>text</i></Example>
      <Details>print a note</Details>
    </div>
  </div>
}