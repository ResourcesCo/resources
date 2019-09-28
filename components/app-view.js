import { useState, useEffect } from 'react';
import Head from './head'
import Nav from './nav'
import Chat from './chat'
import themes from '../themes'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const infoForDevices = {
  default: {
    toolbarHeight: 0,
    keyboardHeight: 0,
  },
  ios: {
    toolbarHeight: 119,
    keyboardHeight: 333,
  }
}

const AppView = ({popup, selectedTheme, onThemeChange}) => {
  const [device, setDevice] = useState('default')
  const [keyboardOpen, setKeyboardOpen] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const iOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream
      if (iOS) {
        setDevice('ios')
      }
    }
  })

  const handleFocusChange = focus => {
    setKeyboardOpen(focus)
    setTimeout(() => {
      if (device === 'ios' && typeof window !== 'undefined') {
        window.document.body.scrollTop = 0
      }
    }, 30)
  }

  const deviceInfo = infoForDevices[device];
  const theme = themes[selectedTheme]
  return (
    <div>
      <Head title="Home" />
      <Nav theme={theme} />
      <Chat onFocusChange={handleFocusChange} theme={theme} onThemeChange={onThemeChange} />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
          background-color: ${theme.background};
        }

        html, body, textarea, svg, button {
          color: ${theme.foreground};
        }

        ${popup && `html, body {
          min-width: 450px;
          min-height: 600px;
        }`}

        textarea, button {
          border: 1px solid ${theme.inputBorder};
        }

        ::selection {
          color: ${theme.selectionColor};
          background: ${theme.selectionBackground};
        }

        a {
          color: ${theme.linkColor};
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
          height: calc(100vh - ${deviceInfo.toolbarHeight + (keyboardOpen ? deviceInfo.keyboardHeight : 0)}px);
        }
      `}</style>
    </div>
  )
}

export default AppView
