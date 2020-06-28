import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import ConsoleChannel from 'api/channel/ConsoleChannel'
import LocalFileStore from 'api/storage/LocalFileStore'

export default async function index(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send({})
  } else {
    const workspace = ConsoleWorkspace.getWorkspace({
      ...req.body,
      fileStoreClass: LocalFileStore,
    })
    const workspaceConfig = await workspace.getClientConfig(req.body)
    return res.status(200).send({
      workspaceConfig,
    })
  }
}
