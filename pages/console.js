import { ChannelView } from '@resources/console'

export default () => {
  return (
    <>
      <ChannelView storageType="localStorage" />
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
