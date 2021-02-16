import { db } from 'src/lib/db'

export const actions = () => {
  return db.action.findMany()
}

export const Action = {
  user: (_obj, { root }) =>
    db.action.findUnique({ where: { id: root.id } }).user(),
  page: (_obj, { root }) =>
    db.action.findUnique({ where: { id: root.id } }).page(),
}
