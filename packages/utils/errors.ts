export class NocError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NocError'
  }
}

export const error = (msg: string, source?: string) => {
  throw new NocError(source ? `[${source}] ${msg}` : msg)
}

export const warn = (msg: string, source?: string) => {
  // eslint-disable-next-line no-console
  console.warn(source ? `[${source}] ${msg}` : msg)
}
