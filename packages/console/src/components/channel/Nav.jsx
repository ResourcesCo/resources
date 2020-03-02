import React from 'react'

export default function Nav({ onSelectExample, theme }) {
  return (
    <div className="nav">
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
      <style jsx>{`
        div.nav {
          background-color: ${theme.background};
        }
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
      `}</style>
    </div>
  )
}
