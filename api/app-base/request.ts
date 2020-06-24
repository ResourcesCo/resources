import fetch from 'isomorphic-unfetch'

export default async function request({
  url,
  method,
  headers,
  body,
}: {
  url: string
  method: string
  headers: { [key: string]: string }
  body?: any
}): Promise<{ ok: boolean }> {
  const bodyParam = body
    ? { body: typeof body === 'string' ? body : JSON.stringify(body) }
    : {}
  const res = await fetch(url, {
    method,
    headers,
    ...bodyParam,
  })
  return { ok: res.ok }
}
