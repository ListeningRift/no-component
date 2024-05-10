import { resolve } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { camelCase, upperFirst } from 'lodash'
import { consola } from 'consola'
import { pkgRoot } from '@no-component/build-utils'
import { handleError, read } from '../utils'

interface GenerateDirectiveInfo {
  camelCaseName: string
  directiveName: string
  directiveIndex: number
}

async function getDirectiveIndex(info: GenerateDirectiveInfo) {
  const { directiveName } = info
  const path = resolve(pkgRoot, 'composables/index.ts')
  const { lines } = await read(path)
  let directivesList = lines.map(
    line => line.match(/export { (.+) } from '\.\/.+'/)?.[1]
  )
  directivesList.push(directiveName)
  directivesList = directivesList.sort()
  return directivesList.indexOf(directiveName)
}

function getDirectiveTemplate(info: GenerateDirectiveInfo) {
  const { directiveName } = info
  return `import type { DirectiveBinding, ObjectDirective } from 'vue'

export const ${directiveName}: ObjectDirective = {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {},
}
`
}

async function addToDirectiveIndex(info: GenerateDirectiveInfo) {
  const { camelCaseName, directiveName, directiveIndex } = info
  const { lines, write } = await read(resolve(pkgRoot, 'directives/index.ts'))
  lines.splice(
    directiveIndex,
    0,
    `export { ${directiveName} } from './${camelCaseName}'`
  )
  await write(lines)
}

async function main() {
  const name = await consola.prompt('Directive name', {
    placeholder: 'Camel case. Don\'t include "v" prefix.',
  })
  const camelCaseName = camelCase(name)
  const directiveName = upperFirst(camelCase(name))

  const info = {
    camelCaseName,
    directiveName,
  } as GenerateDirectiveInfo
  info.directiveIndex = await getDirectiveIndex(info)

  const directivesPath = resolve(pkgRoot, `directives/${camelCaseName}`)
  consola.start('Start generating directive...')
  try {
    consola.info('Creating directive directory...')
    await mkdir(directivesPath)
    consola.info('Creating directive files...')
    await writeFile(
      resolve(directivesPath, 'index.ts'),
      getDirectiveTemplate(info)
    )
    consola.info('Processing directive import and export...')
    await addToDirectiveIndex(info)
  } catch (error: any) {
    handleError(error)
  }

  consola.success('Directive generated successfully.')
}

main()
