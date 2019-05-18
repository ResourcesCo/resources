import React from 'react'

const Nav = () => (
  <nav>
    <h1>resources<span>co</span></h1>

    <style jsx>{`
      :global(body) {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
      }

      nav {
        background-color: #005030;
      }

      h1 {
        text-align: center;
        margin: 0;
        padding: 5px 15px;
        color: gold;
        font-size: 32px;
      }

      h1 span {
        font-size: 10px;
        border: 1px solid gold;
        padding: 4px 3px;
        margin-top: -20px;
        text-transform: uppercase;
        border-radius: 5px;
        margin-left: 4px;
        font-weight: normal;
        position: relative;
        top: -5px;
      }
    `}</style>
  </nav>
)

export default Nav
