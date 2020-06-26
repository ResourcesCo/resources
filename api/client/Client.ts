declare global {
  interface Window {
    rco: any
  }
}

export interface ClientInfo {
  adapter: 'fetch' | 'ipc'
  baseUrl: string
  headers?: { [key: string]: string }
  env?: { [key: string]: string }
}

export interface RequestInfo {
  url: string
  method?: string
  headers?: { [key: string]: string }
  body?: any
}

export interface ResponseInfo {
  ok: boolean
  body?: any
  status?: number
  headers?: { [key: string]: string }
  error?: any
}

export default class Client {
  adapter: 'fetch' | 'ipc'
  baseUrl: string
  headers?: { [key: string]: string }
  env?: { [key: string]: string }

  constructor({ baseUrl, adapter = 'fetch' }: ClientInfo) {
    this.baseUrl = baseUrl
    this.adapter = adapter
  }

  requestWithFetch = async ({
    url,
    ...params
  }: RequestInfo): Promise<ResponseInfo> => {
    let fetchInfo: any = {}
    if ('method' in params) {
      fetchInfo.method = params.method
    }
    if (this.headers || 'headers' in params) {
      fetchInfo.headers = { ...this.headers }
      if ('headers' in params) {
        fetchInfo.headers = { ...fetchInfo.headers, ...params.headers }
      }
    }
    if ('body' in params) {
      fetchInfo.body = params.body
    }
    const response = await fetch(`${this.baseUrl}${url}`, fetchInfo)
    const body = await response.json()
    const headers = {}
    for (const [key, value] of response.headers.entries()) {
      if (!(key in headers)) {
        headers[key] = value
      }
    }
    return {
      ok: response.ok,
      status: response.status,
      headers,
      body,
    }
  }

  requestWithIpc = async (params: RequestInfo): Promise<ResponseInfo> => {
    if (typeof window !== 'undefined' && 'rco' in window) {
      const response = await window.rco.request(params)
      console.log({ request: params, response })
      return response
    } else {
      throw new Error('adapter set to ipc but missing ipc function')
    }
  }

  request = async (params: RequestInfo): Promise<ResponseInfo> => {
    if (this.adapter === 'fetch') {
      return await this.requestWithFetch(params)
    } else if (this.adapter === 'ipc') {
      return await this.requestWithIpc(params)
    }
  }
}
