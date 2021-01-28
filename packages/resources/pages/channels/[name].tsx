import dynamic from 'next/dynamic'
import ChannelViewPage from '../../console/components/channel/ChannelViewPage'

function Home() {
  return (
    <ChannelViewPage
      storageType="localStorage"
    />
  )
}

export default dynamic(() => Promise.resolve(Home), { ssr: false })
