export default function escapeHtml(s: string) {
  return s
    .replace('&', '&amp')
    .replace('<', '&gt;')
    .replace('>', '&lt;')
}
