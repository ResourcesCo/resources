export default function Embed({ path, theme }) {
  return (
    <div>
      <iframe
        sandbox="allow-scripts allow-same-origin"
        src={`${process.env.NEXT_PUBLIC_EMBED_BASE_URL}/embed${path}`}
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
