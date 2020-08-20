import ConsoleError from '../../../../api/ConsoleError'
import ConsoleWorkspace from '../../../../api/workspace/ConsoleWorkspace'
import LocalFileStore from '../../../../api/storage/LocalFileStore'

export default async function index(req, res) {
  const { channel: channelName, path = [] } = req.query
  const { action, params, formData } = req.body

  const workspace = await ConsoleWorkspace.getWorkspace({
    fileStoreClass: LocalFileStore,
    apiOnly: true,
  })
  const channel = await workspace.getChannel(channelName)
  const result = await channel.runApiCommand({ path, action, params, formData })

  res.send(result)
}
