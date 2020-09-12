import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import EmbedPage from '../../console/components/channel/EmbedPage'
import { useState } from 'react'
import ConsoleChannel from 'api/channel/ConsoleChannel'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'

const CodeMirror = dynamic(() => import('../../components/CodeMirror'), {
  ssr: false,
})

function Embed({}) {
  const router = useRouter()
  const [workspace, setWorkspace] = useState<ConsoleWorkspace>(undefined)
  const [channel, setChannel] = useState<ConsoleChannel>(undefined)
  const { path } = router.query
  if (!Array.isArray(path)) {
    return null
  }
  return channel && workspace ? (
    <EmbedPage
      storageType="localStorage"
      path={path}
      workspace={workspace}
      channel={channel}
    />
  ) : null
}

export default dynamic(() => Promise.resolve(Embed), { ssr: false })
