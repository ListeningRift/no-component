import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { camelCase, kebabCase, upperFirst } from 'lodash'
import { consola } from 'consola'
import { root, pkgRoot, nocRoot } from '@no-component/build-utils'
import { handleError, read } from '../utils'

interface GenerateComponentInfo {
  camelCaseName: string
  kebabCaseName: string
  pascalCaseName: string
  componentName: string
  isBaseComponent: boolean
  componentIndex: number
}

function getIndexTemplate(info: GenerateComponentInfo) {
  const { camelCaseName, pascalCaseName, componentName } = info
  return `import { withComponentInstall } from '@no-component/utils'

import ${pascalCaseName} from './src/${camelCaseName}.vue'
export type { ${pascalCaseName}Props, ${pascalCaseName}Emits } from './src/${camelCaseName}'
const ${componentName} = withComponentInstall(${pascalCaseName})

export default ${componentName}
`
}

function getVueTemplate(info: GenerateComponentInfo) {
  const { camelCaseName, componentName } = info
  return `<template>
  <div :class="ns.b()"></div>
</template>

<script lang="ts" setup>
import { getNamespace } from '@no-component/utils'

defineOptions({
  name: '${componentName}',
  inheritAttrs: false,
})

const ns = getNamespace('${camelCaseName}')
</script>
`
}

function getTsTemplate(info: GenerateComponentInfo) {
  const { camelCaseName, pascalCaseName } = info
  return `import type { PropType, ExtractPropTypes } from 'vue'

export const ${camelCaseName}Props = {}

export type ${pascalCaseName}Props = ExtractPropTypes<typeof ${camelCaseName}Props>

export const ${camelCaseName}Emits = {}

export type ${pascalCaseName}Emits = typeof ${camelCaseName}Emits
`
}

function getStyleTemplate(info: GenerateComponentInfo) {
  const { kebabCaseName, isBaseComponent } = info
  return `@use '../../${isBaseComponent ? '' : 'base/'}style/bem.scss' as *;
@use '../../${isBaseComponent ? '' : 'base/'}style/function.scss' as *;

@include b(${kebabCaseName}) {}
`
}

function getTestTemplate(info: GenerateComponentInfo) {
  const { pascalCaseName, componentName } = info
  return `import { render, fireEvent } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import ${pascalCaseName} from '..'
import type { ${pascalCaseName}Props } from '..'

describe('<${componentName} />', () => {})
`
}

async function getComponentIndex(info: GenerateComponentInfo) {
  const { componentName, isBaseComponent } = info
  const path = resolve(
    nocRoot,
    isBaseComponent ? 'baseComponents.ts' : 'components.ts'
  )
  const { lines } = await read(path)
  const startIndex = lines.indexOf('export {') + 1
  const endIndex = lines.indexOf('}')
  let componentsList = lines
    .slice(startIndex, endIndex)
    .map(line => line.match(/ {2}(.+),/)?.[1])
  componentsList.push(componentName)
  componentsList = componentsList.sort()
  return componentsList.indexOf(componentName)
}

async function addToComponentIndex(info: GenerateComponentInfo) {
  const { camelCaseName, isBaseComponent, componentIndex } = info
  const { lines, write } = await read(resolve(pkgRoot, 'components/index.ts'))
  const index = isBaseComponent
    ? lines.indexOf('// base components') + 1
    : lines.indexOf('// components') + 1
  lines.splice(
    index + componentIndex,
    0,
    `export * from './${isBaseComponent ? 'base/' : ''}${camelCaseName}'`
  )
  await write(lines)
}

async function addToComponentList(info: GenerateComponentInfo) {
  const { camelCaseName, componentName, isBaseComponent, componentIndex } = info
  const path = resolve(
    nocRoot,
    isBaseComponent ? 'baseComponents.ts' : 'components.ts'
  )
  const { lines, write } = await read(path)
  const importIndex = 0
  const exportIndex = lines.indexOf('export {') + 1

  lines.splice(exportIndex + componentIndex, 0, `  ${componentName},`)
  lines.splice(
    importIndex + componentIndex,
    0,
    `import ${componentName} from '@no-component/components/${
      isBaseComponent ? 'base/' : ''
    }${camelCaseName}'`
  )
  await write(lines)
}

async function addToStyleList(info: GenerateComponentInfo) {
  const { camelCaseName, isBaseComponent, componentIndex } = info
  const { lines, write } = await read(resolve(nocRoot, 'index.scss'))
  const index = isBaseComponent
    ? lines.indexOf('// base components') + 1
    : lines.indexOf('// components') + 1
  lines.splice(
    index + componentIndex,
    0,
    `@use '../components/${
      isBaseComponent ? 'base/' : ''
    }${camelCaseName}/style/${camelCaseName}.scss';`
  )
  await write(lines)
}

async function addToGLobalDts(info: GenerateComponentInfo) {
  const { componentName, componentIndex, isBaseComponent } = info
  const path = resolve(root, 'typings/global.d.ts')
  const { lines, write } = await read(path)
  const index = isBaseComponent
    ? lines.indexOf('    // base components') + 1
    : lines.indexOf('    // components') + 1
  lines.splice(
    index + componentIndex,
    0,
    `    ${componentName}: typeof import('no-component')['${componentName}']`
  )
  await write(lines)
}

async function main() {
  const isBaseComponent = await consola.prompt(
    'Is base component? (default No)',
    {
      type: 'confirm',
      initial: false,
    }
  )
  const name = await consola.prompt('Component name', {
    placeholder: 'Camel case. Don\'t include "Noc" prefix.',
  })
  const camelCaseName = camelCase(name)
  const kebabCaseName = kebabCase(name)

  const componentPath = resolve(
    pkgRoot,
    `components${isBaseComponent ? '/base' : ''}`,
    camelCaseName
  )
  if (existsSync(componentPath)) {
    handleError(new Error('Component already exists.'))
  }

  const info = {
    camelCaseName,
    kebabCaseName,
    pascalCaseName: upperFirst(camelCaseName),
    componentName: `Noc${upperFirst(camelCaseName)}`,
    isBaseComponent,
  } as GenerateComponentInfo
  info.componentIndex = await getComponentIndex(info)
  const srcPath = resolve(componentPath, 'src')
  const stylePath = resolve(componentPath, 'style')
  const testPath = resolve(componentPath, '__tests__')

  consola.start('Start generating component...')
  try {
    consola.info('Creating component directory...')
    await mkdir(componentPath)
    consola.info('Creating component files...')
    await Promise.all([
      mkdir(srcPath),
      mkdir(stylePath),
      mkdir(testPath),
      writeFile(resolve(componentPath, 'index.ts'), getIndexTemplate(info)),
    ])
    consola.info('Creating component templates...')
    await Promise.all([
      writeFile(resolve(srcPath, `${camelCaseName}.vue`), getVueTemplate(info)),
      writeFile(resolve(srcPath, `${camelCaseName}.ts`), getTsTemplate(info)),
      writeFile(
        resolve(stylePath, `${camelCaseName}.scss`),
        getStyleTemplate(info)
      ),
      writeFile(
        resolve(testPath, `${camelCaseName}.test.ts`),
        getTestTemplate(info)
      ),
    ])
    consola.info('Processing component import and export...')
    await Promise.all([
      addToComponentIndex(info),
      addToComponentList(info),
      addToStyleList(info),
      addToGLobalDts(info),
    ])
  } catch (err: any) {
    handleError(err)
  }

  consola.success('Component generated successfully.')
}

main()
