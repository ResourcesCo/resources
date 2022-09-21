import { ErrorInfo } from '../client/Client'

export interface FileStoreResponse {
  ok: boolean
  contentType?: string
  error?: ErrorInfo
  body?: any
}

export interface FileStore {
  get(params: { path: string }): Promise<FileStoreResponse>
  put(params: { path: string, value: any }): Promise<FileStoreResponse>
  delete(params: { path: string }): Promise<FileStoreResponse>
  constrain(subpath: string): FileStore
}

export interface FileStoreConstructor {
  new (params: { path: string }): FileStore
}
