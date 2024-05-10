import { resolve } from 'path'
import { PKG_NAME } from './metadata'

export const root = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(root, 'packages')
export const nocRoot = resolve(pkgRoot, PKG_NAME)
export const nocPkg = resolve(nocRoot, 'package.json')
export const distRoot = resolve(root, 'dist')
export const pkgOutput = resolve(distRoot, PKG_NAME)
export const esmOutput = resolve(pkgOutput, 'esm')
export const cjsOutput = resolve(pkgOutput, 'cjs')
export const typeOutput = resolve(distRoot, 'types')

export const excludesPath = ['node_modules', 'dist', 'repl']
