import { useState, useEffect, useRef } from 'react'
import Head from './Head'
import Nav from './Nav'
import { ChannelView, getTheme } from '@resources/console'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

const infoForDevices = {
  default: {
    toolbarHeight: 0,
    keyboardHeight: 0,
  },
  ios: {
    toolbarHeight: 150,
    keyboardHeight: 333,
  },
}

const AppView = ({ popup, selectedTheme, onThemeChange, store }) => {
  const mounted = useRef()
  const [device, setDevice] = useState('default')
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    if (mounted.current) {
      if (typeof window !== 'undefined') {
        const iOS =
          /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
          !window.MSStream
        if (iOS) {
          setDevice('ios')
        }
      }
    }
  })

  const handleFocusChange = focus => {
    if (mounted.current) {
      setKeyboardOpen(focus)
      setTimeout(() => {
        if (device === 'ios' && typeof window !== 'undefined') {
          window.document.body.scrollTop = 0
        }
      }, 30)
    }
  }

  const theme = getTheme(selectedTheme)
  const deviceInfo = infoForDevices[device]
  const heightOffset =
    deviceInfo.toolbarHeight + (keyboardOpen ? deviceInfo.keyboardHeight : 0)

  return (
    <div ref={mounted}>
      <Head title="Resources.co" />
      <ChannelView
        navComponent={Nav}
        onFocusChange={handleFocusChange}
        theme={theme}
        onThemeChange={onThemeChange}
        store={store}
      />

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html {
          font-size: 80%;
        }

        html,
        body {
          background-color: ${theme.background};
        }

        html,
        body,
        textarea,
        svg,
        button {
          color: ${theme.foreground};
        }

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
          height: calc(100vh - ${heightOffset}px);
          height: calc(-webkit-fill-available - ${heightOffset}px);
        }
      `}</style>
    </div>
  )
}

export default AppView
