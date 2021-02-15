import { db } from 'src/lib/db'

export const profiles = () => {
  return db.profile.findMany()
}

export const Profile = {
  actions: (_obj, { root }) =>
    db.profile.findUnique({ where: { id: root.id } }).actions(),
}
