import { match } from 'path-to-regexp'
import ConsoleWorkspace from './api/workspace/ConsoleWorkspace'
import ConsoleError from './api/ConsoleError'
import LocalFileStore from './api/storage/LocalFileStore'

const matchFiles = match('/api/files/:path*')
const matchChannels = match('/api/channels/:channel/:path*')

export default class Ipc {
  constructor(public app, public ipcMain) {
    ipcMain.on('rco.request', async (event, messageId, request) => {
      const response = await this.requestWithApi(request)
      event.reply('rco.response', messageId, response)
    })
  }

  async requestWithApi({ url: fullUrl, method, body }) {
    let url = new URL(fullUrl, 'https://workspace.local/').pathname
    let matched = matchFiles(url)
    if (matched && matched.params) {
      const fileRes = await this.handleFileRequest({
        path:
          '/' +
          matched.params['path'].map(s => encodeURIComponent(s)).join('/'),
        method,
        body,
      })
      return { status: 200, body: fileRes }
    }
    matched = matchChannels(url)
    if (matched && matched.params) {
      const res = await this.handleChannelRequest({
        channel: matched.params['channel'],
        path: matched.params['path'] || [],
        body,
      })
      return res
    }
    return { status: 404, body: { error: 'Not found' } }
  }

  async handleFileRequest(req) {
    try {
      const path = req.path
      const workspace = await ConsoleWorkspace.getWorkspace({
        fileStoreClass: LocalFileStore,
        localPath: this.app.getPath('userData') + '/workspace',
      })
      let responseBody
      if (req.method === 'GET') {
        responseBody = await workspace.fileStore.get({ path })
      } else if (req.method === 'PUT') {
        if (
          !(req.body && typeof req.body === 'object' && 'value' in req.body)
        ) {
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
      return responseBody
    } catch (err) {
      if (err instanceof ConsoleError) {
        return {
          ok: false,
          status: err.data.status,
          body: err.data,
        }
      } else {
        throw err
      }
    }
  }

  async handleChannelRequest({ channel: channelName, path, body }) {
    const { action, params, parentMessage, formData } = body

    const url = '/' + path.map(s => encodeURIComponent(s)).join('/')

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

    return {
      status: 200,
      body: result,
    }
  }
}
