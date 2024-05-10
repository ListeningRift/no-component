import { readFile, writeFile } from 'fs/promises'

export async function read(path: string) {
  const file = await readFile(path, 'utf-8')
  const eol = file.includes('\r\n') ? '\r\n' : '\n'
  const lines = file.split(eol)

  return {
    lines,
    write: async (lines: string[]) => {
      await writeFile(path, lines.join(eol))
    },
  }
}
