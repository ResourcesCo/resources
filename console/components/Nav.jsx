export default function Nav({ onSelectExample, theme }) {
  return (
    <div className="nav">
      <a href="https://resources.co/" target="_blank">
        <img src="/images/touch-icon.png" className="logo" />
      </a>
      <h1>
        <a href="https://resources.co/" target="_blank">
          Resources.co
        </a>
      </h1>
      <div className="content">
        <select
          value=""
          onChange={({ target: { value } }) =>
            value !== '' && onSelectExample(value)
          }
        >
          <option value="">Examples</option>
          <option value="help">help</option>
          <option value="/request :get https://pokeapi.co/api/v2/pokemon/bulbasaur">
            pokeapi.co - bulbasaur
          </option>
          <option value="/request :get https://api.github.com/repos/zeit/next.js/commits">
            github - next.js commits
          </option>
          <option value="/request :post https://httpbin.org/post">
            post to httpbin
          </option>
        </select>
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
          margin-top: -5px;
        }
        div.nav h1 a {
          text-decoration: none;
        }
        div.nav div.content {
          padding: 5px 10px;
          text-align: right;
          flex-grow: 1;
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
