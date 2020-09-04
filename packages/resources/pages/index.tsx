import dynamic from 'next/dynamic'
import ChannelViewPage from 'console/components/channel/ChannelViewPage'

const CodeMirror = dynamic(() => import('components/CodeMirror'), {
  ssr: false,
})

function Home() {
  return (
    <ChannelViewPage
      codeMirrorComponent={CodeMirror}
      storageType="localStorage"
    />
  )
}

export default Home
