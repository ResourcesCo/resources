export default function escapeHtml(s) {
  return s
    .replace('&', '&amp')
    .replace('<', '&gt;')
    .replace('>', '&lt;')
}
