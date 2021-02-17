import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

export const pages = () => {
  requireAuth()
  return db.page.findMany()
}

export const Page = {
  actions: (_obj, { root }) =>
    db.page.findUnique({ where: { id: root.id } }).actions(),
}

export const createPage = async ({ input }) => {
  requireAuth()
  const authUser = context.currentUser
  let user = await db.user.findUnique({ where: { email: authUser.email } })
  if (!user) {
    user = await db.user.create({
      data: {
        name: input.name ? input.name : authUser.email,
        email: authUser.email,
        bot: false,
      },
    })
  }
  const page = await db.page.create({
    data: {
      ...input,
      metadata: {},
      computed: {},
    }
  })
  await db.action.create({
    data: {
      userId: user.id,
      pageId: page.id,
      name: page.name,
      path: page.path,
      type: 'create',
      body: page.body,
      metadata: {},
      computed: {},
    }
  })
  return page
}
