import { useState, useEffect } from 'react';
import Head from './Head'
import Chat from './Chat'
import themes from '../themes'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const AppView = ({popup, selectedTheme, onThemeChange}) => {
  const theme = themes[selectedTheme]
  return (
    <div>
      <Head title="Home" />
      <Chat theme={theme} onThemeChange={onThemeChange} />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
          background-color: ${theme.background};
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        html {
          font-size: 80%;
        }

        html, body, textarea, svg, button {
          color: ${theme.foreground};
        }

        ${popup && `html, body {
          min-width: 450px;
          min-height: 600px;
        }`}

        ::selection {
          color: ${theme.selectionColor};
          background: ${theme.selectionBackground};
        }

        a {
          color: ${theme.linkColor};
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        #__next-prerender-indicator {
          display: none;
        }
      `}</style>
      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          height: 100vh;
          height: -webkit-fill-available;
        }
      `}</style>
    </div>
  )
}

export default AppView
