import { resolve } from 'path'
import { build } from 'vite'
import Vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'
import glob from 'fast-glob'
import {
  excludesPath,
  nocPkg,
  nocRoot,
  pkgOutput,
  pkgRoot,
} from '@no-component/build-utils'

export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const manifest = require(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}

export const generateExternal = async () => {
  const { dependencies, peerDependencies } = getPackageDependencies(nocPkg)

  return (id: string) => {
    const packages: string[] = peerDependencies
    packages.push('@vue', ...dependencies)

    return [...new Set(packages)].some(
      pkg => id === pkg || id.startsWith(`${pkg}/`)
    )
  }
}

export const generatePaths = () => {
  const paths = [['lodash-es', 'lodash']]

  return (id: string) => {
    for (const [oldPath, newPath] of paths) {
      if (id.startsWith(oldPath)) {
        return id.replace(oldPath, newPath)
      }
    }

    return ''
  }
}

export const buildModules = async () => {
  const input = (
    await glob('**/index.ts', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  ).filter(file => !excludesPath.some((path: string) => file.includes(path)))

  await build({
    define: {
      __NODE_ENV__: JSON.stringify('production'),
    },
    build: {
      lib: {
        entry: input,
      },
      rollupOptions: {
        output: [
          {
            format: 'esm',
            dir: resolve(pkgOutput, 'esm'),
            preserveModules: true,
            preserveModulesRoot: nocRoot,
            entryFileNames: `[name].mjs`,
          },
          {
            format: 'cjs',
            dir: resolve(pkgOutput, 'cjs'),
            exports: 'named',
            paths: generatePaths(),
            preserveModules: true,
            preserveModulesRoot: nocRoot,
            entryFileNames: `[name].js`,
          },
        ],
        external: await generateExternal(),
        treeshake: false,
      },
    },
    plugins: [
      Vue({
        isProduction: true,
      }),
      DefineOptions(),
    ],
  })
}
