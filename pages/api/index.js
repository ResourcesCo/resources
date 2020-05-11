import ConsoleWorkspace from '@resources/console/services/workspace/ConsoleWorkspace'

export default async function index(req, res) {
  const workspace = ConsoleWorkspace.getWorkspace()
  const workspaceConfig = await workspace.getClientConfig()
  res.status(200).send({
    workspaceConfig,
  })
}
