class ConsoleError extends Error {
  data: any

  constructor(message, data: any = {}) {
    super(message)
    const { status } = data || {}
    this.data = { error: message, ...data, status: status || 500 }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConsoleError)
    }
  }
}

export default ConsoleError
