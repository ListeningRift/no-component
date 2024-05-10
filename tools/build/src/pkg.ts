import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import {
  PKG_NAME,
  getWorkspacePackages,
  pkgOutput,
} from '@no-component/build-utils'

export const generatePkg = async () => {
  const pkgs = Object.fromEntries(
    (await getWorkspacePackages()).map(pkg => [pkg.manifest.name!, pkg])
  )
  const indexPkg = pkgs['@no-component/index'].manifest

  Object.assign(indexPkg, {
    name: PKG_NAME,
    main: 'cjs/index.js',
    module: 'esm/index.mjs',
    types: 'esm/index.d.ts',
    exports: {
      '.': {
        types: './esm/index.d.ts',
        import: './esm/index.mjs',
        require: './cjs/index.js',
      },
      './esm': './esm/index.mjs',
      './cjs': './cjs/index.js',
      './esm/*.mjs': './esm/*.mjs',
      './esm/*': './esm/*',
      './cjs/*.js': './cjs/*.js',
      './cjs/*': './cjs/*',
      './*': './*',
    },
  })

  await writeFile(
    resolve(pkgOutput, 'package.json'),
    JSON.stringify(indexPkg, null, 2)
  )
}
