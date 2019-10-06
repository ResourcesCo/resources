import { plural } from '../utils'

const getHeaders = (api_token, post=false) => {
  return {
    'Authorization': `Bearer ${api_token}`,
    ...(post ? {'Content-Type': 'application/json'} : {}),
  }
}

const request = async ({api_token, url, resourceType, keyField='gid', itemUrl}) => {
  const headers = getHeaders(api_token)
  const res = await fetch(url, {headers})
  const data = await res.json()
  if (res.ok && Array.isArray(data.data)) {
    if (data.data.length > 0) {
      return {
        type: 'data',
        data: (itemUrl
          ? data.data.map(item => ({html_url: itemUrl(item), ...item}))
          : data.data),
        keyField,
        title: 'name',
      }
    } else {
      return {type: 'text', text: `No ${plural(resourceType)} found`}
    }
  } else {
    return {type: 'text', text: `Error getting ${plural(resourceType)}`}
  }
}

const getTaskUrl = task => {
  return `https://app.asana.com/0/${task.projects[0].gid}/${task.gid}`
}

export default {
  help: 'Run `asana help` for more info.',
  async run({root, args, store, message, formData = null, formCommandId = null}) {
    if (args.length === 0) {
      return {type: 'text', text: 'No asana command given. Run `asana help` for info on Asana commands.'}
    }
    const subCommandName = args[0]
    const subCommandArgList = args.slice(1)
    const subCommand = root.commands[subCommandName.replace('-', '_')]
    const subCommandArgs = {}

    if (subCommandArgList.length !== subCommand.args.length) {
      return {type: 'text', text: 'Invalid number of arguments.'}
    }
    for (let i=0; i < subCommand.args.length; i++) {
      subCommandArgs[subCommand.args[i]] = subCommandArgList[i]
    }

    const context = {store, root, message, formData, formCommandId}
    if (subCommand !== 'auth') {
      const api_token = store.env.ASANA_API_TOKEN
      if (!api_token) {
        return {type: 'text', text: 'No API token given. Run "help" for info.'}
      }
      context.api_token = api_token
    }
    return await subCommand.run(subCommandArgs, context)
  },
  commands: {
    help: {
      args: [],
      help: 'show help for Asana commands',
      run(_, {root}) {
        const help = []
        for (let key of Object.keys(root.commands)) {
          const command = key.replace('_', '-')
          const cmd = root.commands[key]
          help.push({args: cmd.args, details: cmd.help, command})
        }
        return {type: 'help', help}
      }
    },
    auth: {
      args: ['api-token'],
      help: 'store api token for Asana',
      run({api_token}, {store}) {
        store.env.ASANA_API_TOKEN = api_token
        store.save()
        return {type: 'text', text: 'Saved!'}
      },
    },
    workspaces: {
      args: [],
      help: 'show Asana workspaces',
      async run(_, {api_token}) {
        return await request({
          api_token,
          url: 'https://app.asana.com/api/1.0/workspaces',
          resourceType: 'workspace',
        })
      },
    },
    projects: {
      args: ['workspace'],
      help: 'show Asana projects',
      async run({workspace}, {api_token}) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/workspaces/${workspace}/projects`,
          resourceType: 'project',
        })
      },
    },
    sections: {
      args: ['project'],
      help: 'show sections in an Asana project',
      async run({project}, {api_token}) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/projects/${project}/sections`,
          resourceType: 'section',
        })
      },
    },
    project_tasks: {
      args: ['project'],
      help: 'show Asana tasks by project',
      async run({project}, {api_token}) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/tasks?project=${project}&opt_expand=projects.gid&completed_since=now`,
          resourceType: 'task',
          itemUrl: getTaskUrl,
        })
      },
    },
    section_tasks: {
      args: ['section'],
      help: 'show Asana tasks by section',
      async run({section}, {api_token}) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/tasks?section=${section}&opt_expand=projects.gid&completed_since=now`,
          resourceType: 'task',
          itemUrl: getTaskUrl,
        })
      },
    },
    complete: {
      args: ['task'],
      help: 'mark an Asana task complete',
      async run({task}, {api_token}) {
        const headers = getHeaders(api_token, true)
        const url = `https://app.asana.com/api/1.0/tasks/${task}`
        const res = await fetch(url, {method: 'PUT', headers, body: JSON.stringify({data: {completed: true}})})
        if (res.ok) {
          return {type: 'text', text: `Task marked complete`}
        } else {
          return {type: 'text', text: `Error marking task complete`}
        }
      },
    },
    comment: {
      args: ['task'],
      help: 'add a comment to an Asana task',
      async run({task}, {api_token, message, formData, formCommandId}) {
        if (formData) {
          const headers = getHeaders(api_token, true)
          const url = `https://app.asana.com/api/1.0/tasks/${task}/stories`
          const res = await fetch(url, {method: 'POST', headers, body: JSON.stringify({data: {text: formData.text}})})
          if (res.ok) {
            return {type: 'form-status', text: `Comment added!`, success: true, formCommandId}
          } else {
            return {type: 'form-status', text: `Error adding comment`, error: true, formCommandId}
          }
        } else {
          return {type: 'form', message, fields: [{name: 'text', type: 'textarea'}]}
        }
      }
    },
  },
}
