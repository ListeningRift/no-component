import { resolve } from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { camelCase, upperFirst } from 'lodash'
import { consola } from 'consola'
import { pkgRoot } from '@no-component/build-utils'
import { handleError, read } from '../utils'

interface GenerateComposableInfo {
  composableName: string
  composableIndex: number
}

function getComposableTemplate(info: GenerateComposableInfo) {
  const { composableName } = info
  return `export const ${composableName} = () => {}
`
}

async function getComposableIndex(info: GenerateComposableInfo) {
  const { composableName } = info
  const path = resolve(pkgRoot, 'composables/index.ts')
  const { lines } = await read(path)
  let composablesList = lines.map(
    line => line.match(/export \* from '\.\/(.+)'/)?.[1]
  )
  composablesList.push(composableName)
  composablesList = composablesList.sort()
  return composablesList.indexOf(composableName)
}

async function addToComponentIndex(info: GenerateComposableInfo) {
  const { composableName, composableIndex } = info
  const { lines, write } = await read(resolve(pkgRoot, 'composables/index.ts'))
  lines.splice(composableIndex, 0, `export * from './${composableName}'`)
  await write(lines)
}

async function main() {
  const name = await consola.prompt('Composable name', {
    placeholder: 'Camel case. Don\'t include "use" prefix.',
  })
  const composableName = `use${upperFirst(camelCase(name))}`

  const info = {
    composableName,
  } as GenerateComposableInfo
  info.composableIndex = await getComposableIndex(info)
  const composablesPath = resolve(pkgRoot, `composables/${composableName}`)

  consola.start('Start generating composable...')
  try {
    consola.info('Creating composable directory...')
    await mkdir(composablesPath)
    consola.info('Creating composable files...')
    await writeFile(
      resolve(composablesPath, 'index.ts'),
      getComposableTemplate(info)
    )
    consola.info('Processing composable import and export...')
    await addToComponentIndex(info)
  } catch (err: any) {
    handleError(err)
  }

  consola.success('Composable generated successfully.')
}

main()
