import { plural } from '../utils'

class Asana {
  auth({api_token, store}) {
    store.env.ASANA_API_TOKEN = api_token
    store.save()
    return {type: 'text', text: 'Saved!'}
  }

  headers(api_token, post=false) {
    return {
      'Authorization': `Bearer ${api_token}`,
      ...(post ? {'Content-Type': 'application/json'} : {}),
    }
  }

  async request({api_token, url, resourceType}) {
    if (!api_token) {
      return {type: 'text', text: 'No API token given. Run "help" for info.'}
    }
    const headers = this.headers(api_token)
    const res = await fetch(url, {headers})
    const data = await res.json()
    if (res.ok && Array.isArray(data.data)) {
      if (data.data.length > 0) {
        return {
          type: 'data',
          data: data.data,
          keyField: 'gid',
          title: 'name',
        }
      } else {
        return {type: 'text', text: `No ${plural(resourceType)} found`}
      }
    } else {
      return {type: 'text', text: `Error getting ${resourceType}`}
    }
  }

  async workspaces({api_token}) {
    return await this.request({
      api_token,
      url: 'https://app.asana.com/api/1.0/workspaces',
      resourceType: 'workspace',
    })
  }

  async projects({api_token, workspace}) {
    return await this.request({
      api_token,
      url: `https://app.asana.com/api/1.0/workspaces/${workspace}/projects`,
      resourceType: 'project',
    })
  }

  async tasks({api_token, project}) {
    return await this.request({
      api_token,
      url: `https://app.asana.com/api/1.0/projects/${project}/tasks`,
      resourceType: 'project',
    })
  }

  async complete({api_token, task}) {
    if (!api_token) {
      return {type: 'text', text: 'No API token given. Run "help" for info.'}
    }
    const headers = this.headers(api_token, true)
    const url = `https://app.asana.com/api/1.0/tasks/${task}`
    const res = await fetch(url, {method: 'PUT', headers, body: JSON.stringify({data: {completed: true}})})
    if (res.ok) {
      return {type: 'text', text: `Task marked complete`}
    } else {
      return {type: 'text', text: `Error marking task complete`}
    }
  }

  run = async ({args, store}) => {
    const subCommand = args[0]
    if (subCommand === 'auth' && args.length === 2) {
      const api_token = args[1]
      return this.auth({api_token, store})
    } else {
      const api_token = store.env.ASANA_API_TOKEN
      if (subCommand === 'workspaces' && args.length === 1) {
        return await this.workspaces({api_token})
      } else if (subCommand === 'projects' && args.length === 2) {
        const workspace = args[1]
        return await this.projects({api_token, workspace})
      } else if (subCommand === 'tasks' && args.length === 2) {
        const project = args[1]
        return await this.tasks({api_token, project})
      } else if (subCommand === 'complete' && args.length === 2) {
        const task = args[1]
        return await this.complete({api_token, task})
      }  else {
        return {type: 'text', text: 'Command not found.'}
      }
    }
  }
}

const asana = new Asana()

export default {
  run: asana.run,
  help: [
    {
      subCommand: 'auth',
      args: ['api-token'],
      details: 'store api token for Asana',
    },
    {
      subCommand: 'workspaces',
      args: [],
      details: 'show Asana workspaces',
    },
    {
      subCommand: 'projects',
      args: ['workspace'],
      details: 'show Asana projects',
    },
    {
      subCommand: 'tasks',
      args: ['workspace'],
      details: 'show Asana projects',
    },
    {
      subCommand: 'complete',
      args: ['task'],
      details: 'mark an Asana task complete',
    },
  ]
}
