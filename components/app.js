import { useState, useEffect } from 'react';
import Head from '../components/head'
import Nav from '../components/nav'
import Chat from '../components/chat'

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

const App = ({popup}) => {
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
  const theme = {
    foreground: '#eee',
    background: '#222427',
    inputBorder: 'rgb(51, 51, 51)',
    selectionBackground: 'cyan',
    selectionColor: '#eee',
  }
  return (
    <div>
      <Head title="Home" />
      <Nav theme={theme} />
      <Chat onFocusChange={handleFocusChange} />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
          background-color: ${theme.background};
        }

        html, body, textarea, svg {
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
          color: cyan;
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

export default App
