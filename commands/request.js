export default {
  defaultAction: 'post',
  actions: {
    post: {
      params: [],
      help: 'Make an HTTP POST request',
      async run({ formData, formCommandId, message }) {
        if (
          formData &&
          formData.action === 'runAction' &&
          formData.actionName === 'send'
        ) {
          return {
            type: 'message-command',
            treeCommandId: formCommandId,
            action: 'set',
            path: ['response'],
            value: {
              headers: {},
              body: {},
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
      async run({ params: { url }, message, formData, formCommandId }) {
        if (formData) {
          return {
            type: 'form-status',
            treeUpdate: formData,
            formCommandId,
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
