import { db } from 'src/lib/db'

export const actions = () => {
  return db.action.findMany()
}

export const Action = {
  profile: (_obj, { root }) =>
    db.action.findUnique({ where: { id: root.id } }).profile(),
  page: (_obj, { root }) =>
    db.action.findUnique({ where: { id: root.id } }).page(),
}
