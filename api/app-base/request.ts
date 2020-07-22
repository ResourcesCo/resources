import fetch from 'isomorphic-unfetch'
import headerCase from './util/string/headerCase'

export function ok(response) {
  return response.status >= 200 && response.status < 300
}

function jsonHeaders(headers) {
  const result = {}
  for (const [_key, value] of headers) {
    const key = headerCase(_key)
    if (key in result) {
      if (!Array.isArray(result[key])) {
        result[key] = [result[key]]
      }
      result[key].push(value)
    } else {
      result[key] = value
    }
  }
  const sortedResult = {}
  const keys = Object.keys(result)
  keys.sort()
  for (const key of keys) {
    sortedResult[key] = result[key]
  }
  return sortedResult
}

function titleCaseHeaders(headers) {
  const result = {}
  for (let key of Object.keys(headers)) {
    result[headerCase(key)] = headers[key]
  }
  return result
}

async function jsonBody(res) {
  if (/\bjson\b/i.test(res.headers.get('Content-Type'))) {
    return await res.json()
  } else {
    return await res.text()
  }
}

export interface RequestInfo {
  url: string
  method: string
  headers?: { [key: string]: string }
  body?: any
}

export interface ResponseInfo {
  status: number
  headers: {
    [key: string]: string | string[]
  }
  body: any
}

export default async function request({
  url,
  method,
  headers,
  body,
}: RequestInfo): Promise<ResponseInfo> {
  const fetchData: any = {}
  if (method) {
    fetchData.method = method
  }
  if (headers) {
    fetchData.headers = {
      ...(body &&
        typeof body !== 'string' && { 'Content-Type': 'application/json' }),
      ...(headers && titleCaseHeaders(headers)),
    }
  }
  if (body) {
    fetchData.body = typeof body === 'string' ? body : JSON.stringify(body)
  }
  const res = await fetch(url, fetchData)
  const responseBody = await jsonBody(res)
  return {
    status: res.status,
    headers: jsonHeaders(res.headers),
    body: responseBody,
  }
}
