import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import EmbedPage from 'console/components/channel/EmbedPage'

const CodeMirror = dynamic(() => import('components/CodeMirror'), {
  ssr: false,
})

function Embed({}) {
  const router = useRouter()
  const { path } = router.query
  return <EmbedPage storageType="localStorage" path={path} />
}

export default dynamic(() => Promise.resolve(Embed), { ssr: false })
