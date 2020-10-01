import { NextApiRequest, NextApiResponse, PageConfig } from 'next'
import { isObject } from 'lodash'
import ConsoleError from 'api/ConsoleError'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import LocalFileStore from 'api/storage/LocalFileStore'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { name, path: pathArray },
  } = req

  if (!Array.isArray(pathArray)) {
    throw new Error('Path must be an array')
  }

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

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: '100mb'
    }
  }
}
