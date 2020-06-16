import dynamic from 'next/dynamic'
import ChannelView from 'console/components/channel/ChannelView'

const CodeMirror = dynamic(() => import('../components/CodeMirror'), {
  ssr: false,
})

function Home() {
  return (
    <ChannelView codeMirrorComponent={CodeMirror} storageType="localStorage" />
  )
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
