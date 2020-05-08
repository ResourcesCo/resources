class ConsoleError extends Error {
  constructor(message, data, ...args) {
    super(message, ...args)
    const { status } = data || {}
    this.data = { error: message, ...data, status: status || 500 }
    Error.captureStackTrace(this, ConsoleError)
  }
}

export default ConsoleError
