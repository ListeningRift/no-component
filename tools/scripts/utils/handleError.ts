import { consola } from 'consola'

export const handleError = (error: Error) => {
  consola.error(error)
  process.exit(1)
}
