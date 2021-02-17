import { db } from 'src/lib/db'
import { requireAuth, getCurrentUser } from 'src/lib/auth'

export const users = () => {
  requireAuth()
  return db.user.findMany()
}

export const User = {
  actions: (_obj, { root }) =>
    db.user.findUnique({ where: { id: root.id } }).actions(),
}

export const currentUser = async () => {
  const authUser = context.currentUser
  if (authUser) {
    const user = await db.user.findUnique({ where: { email: authUser.email } })
    if (user) {
      return { id: user.id, name: user.name, email: user.email }
    } else {
      return { id: null, name: null, email: authUser.email }
    }
  } else {
    return { id: null, name: null, email: null }
  }
}

export const createCurrentUser = async ({ input }) => {
  const authUser = context.currentUser
  const user = await db.user.create({
    data: {
      name: input.name ? input.name : authUser.email,
      email: authUser.email,
      bot: false,
    },
  })
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
