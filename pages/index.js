import dynamic from 'next/dynamic'
import ChannelViewPage from 'console/components/channel/ChannelViewPage'

const CodeMirror = dynamic(() => import('components/CodeMirror'), {
  ssr: false,
})

function Home() {
  return (
    <ChannelViewPage
      page="channel"
      codeMirrorComponent={CodeMirror}
      storageType="localStorage"
    />
  )
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
