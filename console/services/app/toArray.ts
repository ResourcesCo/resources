export default function toArray(value: any | any[]): any[] {
  return Array.isArray(value) ? value : [value]
}
