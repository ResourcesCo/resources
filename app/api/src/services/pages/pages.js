import { db } from 'src/lib/db'

export const pages = () => {
  return db.page.findMany()
}

export const Page = {
  actions: (_obj, { root }) =>
    db.page.findUnique({ where: { id: root.id } }).actions(),
}
