import { useState } from 'react'
import Nav from '../components/Nav'
import { ChannelView, getTheme } from '@resources/console'

export default () => {
  const [themeName, setThemeName] = useState('dark')
  const theme = getTheme(themeName)
  return (
    <>
      <ChannelView
        navComponent={Nav}
        storageType="localStorage"
        theme={theme}
        onThemeChange={name => setThemeName(name)}
      />
      <style jsx global>{`
        html,
        body,
        body > div {
          margin: 0;
          padding: 0;
          height: 100%;
          box-sizing: border-box;
        }
        #__next-prerender-indicator {
          display: none;
        }
      `}</style>
    </>
  )
}
