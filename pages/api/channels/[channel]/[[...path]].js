import ConsoleError from '../../../../api/ConsoleError'
import ConsoleWorkspace from '../../../../api/workspace/ConsoleWorkspace'
import LocalFileStore from '../../../../api/storage/LocalFileStore'

export default async function index(req, res) {
  const { channel: channelName, path = [] } = req.query
  const { action, params, parentMessage, formData } = req.body

  const url = '/' + path.map(s => encodeURIComponent(s)).join('/')

  if (process.env.API_AUTH !== 'any') {
    res.status(401).send({ error: 'Access denied.' })
  }

  const workspace = await ConsoleWorkspace.getWorkspace({
    fileStoreClass: LocalFileStore,
    apiOnly: true,
  })
  const channel = await workspace.getChannel(channelName)
  const result = await channel.runApiCommand({
    url,
    action,
    params,
    parentMessage,
    formData,
  })

  res.send(result)
}
