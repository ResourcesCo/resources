import { plural } from '../utils'

const getHeaders = (api_token, post = false) => {
  return {
    Authorization: `Bearer ${api_token}`,
    ...(post ? { 'Content-Type': 'application/json' } : {}),
  }
}

const request = async ({
  api_token,
  url,
  resourceType,
  keyField = 'gid',
  itemUrl,
}) => {
  const headers = getHeaders(api_token)
  const res = await fetch(url, { headers })
  const data = await res.json()
  if (res.ok && Array.isArray(data.data)) {
    if (data.data.length > 0) {
      return {
        type: 'data',
        data: itemUrl
          ? data.data.map(item => ({ html_url: itemUrl(item), ...item }))
          : data.data,
        keyField,
        title: 'name',
      }
    } else {
      return { type: 'text', text: `No ${plural(resourceType)} found` }
    }
  } else {
    return { type: 'text', text: `Error getting ${plural(resourceType)}` }
  }
}

const getTaskUrl = task => {
  return `https://app.asana.com/0/${task.projects[0].gid}/${task.gid}`
}

export default {
  filters: {
    before({ action: { name }, env: { api_token } }) {
      if (name !== 'auth' && !api_token) {
        return {
          type: 'error',
          text: 'No API token given. Run "help" for info.',
        }
      }
    },
  },
  actions: {
    auth: {
      params: ['api_token'],
      help: 'store api token for Asana',
      run({ params: { api_token } }) {
        return [
          { type: 'env', value: { api_token } },
          { type: 'text', text: 'Saved!' },
        ]
      },
    },
    workspaces: {
      params: [],
      help: 'show Asana workspaces',
      async run({ env: { api_token } }) {
        return await request({
          api_token,
          url: 'https://app.asana.com/api/1.0/workspaces',
          resourceType: 'workspace',
        })
      },
    },
    projects: {
      params: ['workspace'],
      help: 'show Asana projects',
      async run({ params: { workspace }, env: { api_token } }) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/workspaces/${workspace}/projects`,
          resourceType: 'project',
        })
      },
    },
    sections: {
      params: ['project'],
      help: 'show sections in an Asana project',
      async run({ params: { project }, env: { api_token } }) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/projects/${project}/sections`,
          resourceType: 'section',
        })
      },
    },
    project_tasks: {
      params: ['project'],
      help: 'show Asana tasks by project',
      async run({ params: { project }, env: { api_token } }) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/tasks?completed_since=now&project=${project}`,
          resourceType: 'task',
          itemUrl: getTaskUrl,
        })
      },
    },
    section_tasks: {
      params: ['section'],
      help: 'show Asana tasks by section',
      async run({ params: { section }, env: { api_token } }) {
        return await request({
          api_token,
          url: `https://app.asana.com/api/1.0/tasks?completed_since=now&section=${section}&opt_expand=memberships`,
          resourceType: 'task',
          itemUrl: getTaskUrl,
        })
      },
    },
    complete: {
      params: ['task'],
      help: 'mark an Asana task complete',
      async run({ params: { task }, env: { api_token } }) {
        const headers = getHeaders(api_token, true)
        const url = `https://app.asana.com/api/1.0/tasks/${task}`
        const res = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ data: { completed: true } }),
        })
        if (res.ok) {
          return { type: 'text', text: `Task marked complete` }
        } else {
          return { type: 'text', text: `Error marking task complete` }
        }
      },
    },
    comment: {
      params: ['task'],
      help: 'add a comment to an Asana task',
      async run({
        params: { task },
        env: { api_token },
        message,
        formData,
        parentCommandId,
      }) {
        if (formData) {
          const headers = getHeaders(api_token, true)
          const url = `https://app.asana.com/api/1.0/tasks/${task}/stories`
          const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ data: { text: formData.text } }),
          })
          if (res.ok) {
            return {
              type: 'form-status',
              text: `Comment added!`,
              success: true,
              parentCommandId,
            }
          } else {
            return {
              type: 'form-status',
              text: `Error adding comment`,
              error: true,
              parentCommandId,
            }
          }
        } else {
          return {
            type: 'form',
            message,
            fields: [{ name: 'text', type: 'textarea' }],
          }
        }
      },
    },
  },
}
