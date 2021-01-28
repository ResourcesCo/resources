import dynamic from 'next/dynamic'
import ChannelViewPage from '../console/components/channel/ChannelViewPage'

function Home() {
  return (
    <ChannelViewPage
      storageType="localStorage"
    />
  )
}

export default Home
