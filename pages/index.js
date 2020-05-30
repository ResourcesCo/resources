import { useState } from 'react'
import dynamic from 'next/dynamic'
import Nav from '../components/Nav'
import Head from '../components/Head'
import ChannelView from 'console/components/channel/ChannelView'
import { getTheme } from 'console/themes'

const CodeMirror = dynamic(() => import('../components/CodeMirror'), {
  ssr: false,
})

export default function Home() {
  const [themeName, setThemeName] = useState('dark')
  const theme = getTheme(themeName)
  return (
    <>
      <ChannelView
        navComponent={Nav}
        codeMirrorComponent={CodeMirror}
        storageType="localStorage"
        theme={theme}
        onThemeChange={name => setThemeName(name)}
      />
      <Head title="Resources.co" />
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
