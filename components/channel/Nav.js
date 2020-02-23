export default function Nav({ onSelectExample, theme }) {
  return (
    <div className="nav">
      <img src="static/touch-icon.png" className="logo" />
      <h1>Resources.co</h1>
      <div className="content">
        <select
          value=""
          onChange={({ target: { value } }) =>
            value !== '' && onSelectExample(value)
          }
        >
          <option value="">Examples</option>
          <option value="help">help</option>
          <option value="request get https://pokeapi.co/api/v2/pokemon/bulbasaur">
            pokeapi.co - bulbasaur
          </option>
        </select>
      </div>
      <div className="links">
        <a href="https://github.com/resourcesco/resources" target="_blank">
          GitHub
        </a>{' '}
        <span className="divider">•</span>{' '}
        <a href="https://instagram.com/resources.co" target="_blank">
          Instagram
        </a>{' '}
        <span className="divider">•</span>{' '}
        <a href="https://twitter.com/ResourcesCo" target="_blank">
          Twitter
        </a>
      </div>
      <style jsx>{`
        div.nav {
          display: flex;
          align-items: center;
          padding: 5px;
        }
        img.logo {
          padding-left: 4px;
          height: 32px;
        }
        h1 {
          padding-left: 8px;
        }
        div.content {
          padding: 10px;
          text-align: right;
          flex-grow: 1;
        }
        div.links {
          padding-right: 5px;
        }
        @media (max-width: 575.98px) {
          select {
            display: none;
          }
          .divider {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
