import ConsoleError from '@resources/console/ConsoleError'
import ConsoleWorkspace from '@resources/console/services/workspace/ConsoleWorkspace'

export default async (req, res) => {
  const {
    query: { name, path: pathArray },
  } = req
  const path = pathArray.join('/')

  try {
    const workspace = ConsoleWorkspace.getWorkspace('./')
    const channel = await workspace.getChannel(name)
    let responseBody
    if (req.method === 'GET') {
      responseBody = await channel.files.get({ path })
    } else if (req.method === 'PUT') {
      responseBody = await channel.files.put({ ...req.body, path })
    } else if (req.method === 'DELETE') {
      responseBody = await channel.files.del(path)
    } else {
      throw new ConsoleError('Invalid method for path', { status: 400 })
    }
    res.status(200).json(responseBody)
  } catch (err) {
    if (err instanceof ConsoleError) {
      res.status(err.data.status).send(err.data)
    } else {
      throw err
    }
  }
}
