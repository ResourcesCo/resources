import { useRef, useEffect, useCallback } from 'react'

export default function Embed({ path, commandId, theme }) {
  const embedBaseUrl =
    process.env.NEXT_PUBLIC_EMBED_BASE_URL || process.env.EMBED_BASE_URL_DEFAULT
  const ref = useRef()
  const handleMessage = useCallback(({ data: { source, payload } }) => {
    if (source === `/messages/${commandId}/reply`) {
      console.log('received response back', payload)
    }
  })
  const handleFrameLoaded = useCallback(() => {
    if (ref.current) {
      ref.current.contentWindow.postMessage(
        { source: `/messages/${commandId}`, payload: { path } },
        embedBaseUrl
      )
    }
  })
  useEffect(() => {
    if (ref.current) {
      window.addEventListener('message', handleMessage)
      ref.current.addEventListener('load', handleFrameLoaded)
      return () => {
        window.removeEventListener('message', handleMessage)
        ref.current.removeEventListener('load', handleFrameLoaded)
      }
    }
  }, [])
  return (
    /*window.location.href.startsWith(embedBaseUrl) ? null :*/ <div>
      <iframe
        ref={ref}
        sandbox="allow-scripts allow-same-origin"
        src={`${embedBaseUrl}/embed${path}`}
      />
      <style jsx>{`
        iframe {
          border: 0;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
