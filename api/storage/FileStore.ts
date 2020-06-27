export interface FileStoreResponse {
  ok: boolean
  contentType?: string
  error?: any
  body?: any
}

export interface FileStore {
  get({ path: string }): Promise<FileStoreResponse>
  put({ path: string, value: any }): Promise<FileStoreResponse>
  delete({ path: string }): Promise<FileStoreResponse>
}

export interface FileStoreConstructor {
  new ({ path: string }): FileStore
}
