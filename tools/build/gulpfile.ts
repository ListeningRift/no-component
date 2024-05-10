import { copyFile, mkdir } from 'fs/promises'
import { resolve } from 'path'
import { parallel, series, task } from 'gulp'
import { sync as delSync } from 'rimraf'
import { distRoot, pkgOutput, root } from '@no-component/build-utils'
import {
  buildModules,
  changeDtsDir,
  compileStyle,
  generateDts,
  generatePkg,
} from './src'
import type { TaskFunction } from 'undertaker'

task('clean', async () => {
  delSync([distRoot])
})
task('createOutput', async () => {
  await mkdir(pkgOutput, { recursive: true })
})
task('bundleModule', () => buildModules())
task('generateDts', () => generateDts())
task('changeDtsDir', () => changeDtsDir())
task('generatePkg', () => generatePkg())
task('compileStyle', () => compileStyle())
task('copyFile', async () => {
  await copyFile(
    resolve(root, 'typings/global.d.ts'),
    resolve(pkgOutput, 'global.d.ts')
  )
})

export default series(
  'clean',
  'createOutput',
  parallel('bundleModule', 'generateDts', 'generatePkg'),
  parallel('changeDtsDir', 'compileStyle', 'copyFile')
) as TaskFunction
