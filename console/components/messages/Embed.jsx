export default function Embed({ path, theme }) {
  return (
    <div>
      <iframe src={`/embed${path}`} />
      <style jsx>{`
        iframe {
          border: 0;
          width: 100%;
        }
      `}</style>
    </div>
  )
}
