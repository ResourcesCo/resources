export default function Nav({ onSelectExample, theme }) {
  return (
    <div className="nav">
      <img src="/images/touch-icon.png" className="logo" />
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
          <option value="request get https://api.github.com/repos/zeit/next.js/commits">
            github - next.js commits
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
        div.nav,
        div.nav * {
          background: ${theme.background};
          color: ${theme.foreground};
          font-family: ${theme.fontFamily};
          margin: 0;
          padding: 0;
        }
        div.nav {
          display: flex;
          align-items: center;
          padding: 5px;
        }
        div.nav img.logo {
          height: 32px;
          padding-left: 1px;
        }
        div.nav h1 {
          padding-left: 8px;
          font-size: 26px;
        }
        div.nav div.content {
          padding: 5px 10px;
          text-align: right;
          flex-grow: 1;
        }
        div.nav div.links {
          padding-right: 5px;
        }
        div.nav a {
          color: ${theme.linkColor};
          text-decoration: none;
        }
        @media (max-width: 575.98px) {
          .links {
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
