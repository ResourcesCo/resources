export default function camelCase(s) {
  return s.replace(/[- ](\w)/, (s, group1) => group1.toUpperCase())
}
