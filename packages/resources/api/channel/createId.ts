import { nanoid } from 'nanoid'
export default function createId() {
  // default charset; same as python's urlsafe_b64encode
  // 16 characters, 12 bytes, same as MongoDB
  // see https://github.com/zandaqo/objectid64
  return nanoid(16)
}
