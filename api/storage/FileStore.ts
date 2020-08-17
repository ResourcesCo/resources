import { ErrorInfo } from '../client/Client'

export interface FileStoreResponse {
  ok: boolean
  contentType?: string
  error?: ErrorInfo
  body?: any
}

export interface FileStore {
  get({ path: string }): Promise<FileStoreResponse>
  put({ path: string, value: any }): Promise<FileStoreResponse>
  delete({ path: string }): Promise<FileStoreResponse>
  constrain(subpath: string): FileStore
}

export interface FileStoreConstructor {
  new ({ path: string }): FileStore
}
