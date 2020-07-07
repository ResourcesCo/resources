import ConsoleError from '../ConsoleError'

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

export interface ErrorInfo {
  message: string
  code?: string
}

export interface ResponseInfo {
  ok: boolean
  body?: any
  status?: number
  headers?: { [key: string]: string }
  error?: ErrorInfo | string
}

export default class Client {
  adapter: 'fetch' | 'ipc'
  baseUrl: string
  headers?: { [key: string]: string }
  env?: { [key: string]: string }

  constructor({ baseUrl, adapter = 'fetch' }: ClientInfo) {
    this.baseUrl = new URL(baseUrl + '/').href
    this.adapter = adapter
  }

  getUrl(url) {
    const resolvedUrl = new URL(url, this.baseUrl).href
    if (resolvedUrl.startsWith(this.baseUrl)) {
      return resolvedUrl
    } else {
      throw new Error('invalid relative URL')
    }
  }

  protected requestWithFetch = async (
    request: RequestInfo
  ): Promise<ResponseInfo> => {
    let fetchInfo: any = {}
    if ('method' in request) {
      fetchInfo.method = request.method
    }
    if (this.headers || 'headers' in request) {
      fetchInfo.headers = { ...this.headers }
      if ('headers' in request) {
        fetchInfo.headers = { ...fetchInfo.headers, ...request.headers }
      }
    }
    if ('body' in request) {
      fetchInfo.body = request.body
    }
    const response = await fetch(request.url, fetchInfo)
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

  protected requestWithIpc = async ({
    url,
    ...params
  }): Promise<ResponseInfo> => {
    if (typeof window !== 'undefined' && 'rco' in window) {
      const response = await window.rco.request(params)
      return response
    } else {
      throw new Error('adapter set to ipc but missing ipc function')
    }
  }

  request = async ({ url, ...params }: RequestInfo): Promise<ResponseInfo> => {
    if (this.adapter === 'fetch') {
      return await this.requestWithFetch({ ...params, url: this.getUrl(url) })
    } else if (this.adapter === 'ipc') {
      return await this.requestWithIpc({ ...params, url: this.getUrl(url) })
    }
  }

  constrain(subpath) {
    return new Client({
      adapter: this.adapter,
      baseUrl: this.getUrl(subpath),
      headers: this.headers,
      env: this.env,
    })
  }
}
