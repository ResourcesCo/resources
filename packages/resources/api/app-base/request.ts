import fetch from 'isomorphic-unfetch'
import headerCase from './util/string/headerCase'
import { produce } from 'immer'
import { joinPath } from 'vtv-model'

export function ok(response) {
  return response.status >= 200 && response.status < 300
}

function replaceEnvInString(str, env) {
  let result = str
  for (const [envKey, value] of Object.entries(env)) {
    result = result.replace(
      value,
      () => '${ ' + joinPath(['env', envKey]) + ' }'
    )
  }
  return result
}

export function replaceEnv(request, env) {
  return produce(request, (request) => {
    request.url = replaceEnvInString(request.url, env)
    const headers = request.headers
    if (headers) {
      for (const key of Object.keys(headers)) {
        headers[key] = replaceEnvInString(headers[key], env)
      }
    }
  })
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
    try {
      return await res.json()
    } catch (err) {
      return await res.text()
    }
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

export interface ErrorInfo {
  error: string
}

export type ResponseOrError = ResponseInfo | ErrorInfo

export default async function request({
  url,
  method,
  headers,
  body,
}: RequestInfo): Promise<ResponseOrError> {
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
  let res
  try {
    res = await fetch(url, fetchData)
  } catch (err) {
    return {
      error: err.toString(),
    }
  }
  const responseBody = await jsonBody(res)
  return {
    status: res.status,
    headers: jsonHeaders(res.headers),
    body: responseBody,
  }
}
