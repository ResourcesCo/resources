export default function headerCase(str) {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}
