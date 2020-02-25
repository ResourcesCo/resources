const jsonHeaders = headers => {
  const keys = [...headers.keys()]
  keys.sort()
  const result = {}
  for (let key of keys) {
    result[key] = []
  }
  for (let header of headers) {
    const [key, value] = header
    result[key].push(value)
  }
  for (let key of keys) {
    if (result[key].length === 1) {
      result[key] = result[key][0]
    }
  }
  return result
}

export default {
  defaultAction: 'post',
  actions: {
    post: {
      params: [],
      help: 'Make an HTTP POST request',
      async run({ formData, message, parentMessage, ...context }) {
        if (
          formData &&
          formData.action === 'runAction' &&
          formData.actionName === 'send'
        ) {
          const timeout = 5000
          const controller = new AbortController()
          setTimeout(() => controller.abort(), timeout)
          const request = parentMessage.value
          const response = await fetch(request.url, {
            signal: controller.signal,
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(request.body),
          })
          const data = await response.json()
          return {
            type: 'message-command',
            action: 'set',
            path: ['response'],
            value: {
              headers: jsonHeaders(response.headers),
              body: data,
            },
          }
        }
        return {
          type: 'tree',
          name: 'request',
          message,
          value: {
            method: 'post',
            url: '',
            body: {},
            headers: {},
          },
          state: {
            _expanded: true,
            _actions: [{ name: 'send', title: 'Send', primary: true }],
            response: {
              _expanded: true,
              body: {
                _expanded: true,
              },
            },
          },
        }
      },
    },
    get: {
      params: ['url'],
      help: 'Make a GET request',
      async run({ params: { url }, message, formData, parentCommandId }) {
        if (formData) {
          return {
            type: 'form-status',
            treeUpdate: formData,
            parentCommandId,
          }
        } else {
          const timeout = 5000
          try {
            const controller = new AbortController()
            setTimeout(() => controller.abort(), timeout)
            const response = await fetch(url, {
              signal: controller.signal,
            })
            const data = await response.json()
            return {
              type: 'tree',
              name: 'request',
              value: {
                method: 'get',
                url,
                response: {
                  headers: response.headers,
                  body: data,
                },
              },
              state: {
                _expanded: true,
                _showOnly: ['response', 'body'],
                response: {
                  _expanded: true,
                  body: {
                    _expanded: true,
                  },
                },
              },
              message: message,
            }
          } catch (err) {
            return {
              type: 'error',
              text:
                err.name === 'AbortError'
                  ? 'The request timed out.'
                  : err.toString(),
            }
          }
        }
      },
    },
  },
}
