import ConsoleWorkspace from '@resources/console/services/workspace/ConsoleWorkspace'

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
