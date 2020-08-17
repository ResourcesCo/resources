export default function camelCase(s: string) {
  return s.replace(/[- ](\w)/, (s, group1) => group1.toUpperCase())
}
