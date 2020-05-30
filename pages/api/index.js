import ConsoleWorkspace from 'console/services/workspace/ConsoleWorkspace'
import ConsoleChannel from 'console/services/channel/ConsoleChannel'
import LocalFileStore from 'console/services/storage/LocalFileStore'

ConsoleWorkspace.LocalFileStore = LocalFileStore
ConsoleChannel.LocalFileStore = LocalFileStore

export default async function index(req, res) {
  if (req.method === 'GET') {
    return res.status(200).send({})
  } else {
    const workspace = ConsoleWorkspace.getWorkspace()
    const workspaceConfig = await workspace.getClientConfig({
      apiBaseUrl: req.body.apiBaseUrl,
    })
    return res.status(200).send({
      workspaceConfig,
    })
  }
}
