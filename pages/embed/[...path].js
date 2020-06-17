import dynamic from 'next/dynamic'
import EmbedPage from 'console/components/channel/EmbedPage'

const CodeMirror = dynamic(() => import('components/CodeMirror'), {
  ssr: false,
})

function Embed({ path }) {
  return <EmbedPage storageType="localStorage" path={path} />
}

export default dynamic(() => Promise.resolve(Embed), { ssr: false })
