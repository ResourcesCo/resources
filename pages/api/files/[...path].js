import ConsoleError from 'api/ConsoleError'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import ConsoleChannel from 'api/channel/ConsoleChannel'
import LocalFileStore from 'api/storage/LocalFileStore'
import { isObject } from 'vtv/model/analyze'

export default async (req, res) => {
  const {
    query: { name, path: pathArray },
  } = req
  const path = pathArray.join('/')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const workspace = await ConsoleWorkspace.getWorkspace({
      fileStoreClass: LocalFileStore,
    })
    let responseBody
    if (req.method === 'GET') {
      responseBody = await workspace.fileStore.get({ path })
    } else if (req.method === 'PUT') {
      if (!(isObject(req.body) && 'value' in req.body)) {
        throw new ConsoleError('Content must be JSON object with value key', {
          status: 422,
        })
      }
      responseBody = await workspace.fileStore.put({ ...req.body, path })
    } else if (req.method === 'DELETE') {
      responseBody = await workspace.fileStore.delete({ path })
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
