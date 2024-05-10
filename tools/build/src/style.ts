import { resolve } from 'path'
import glob from 'fast-glob'
import { dest, src } from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import gulpIf from 'gulp-if'
import { consola } from 'consola'
import chalk from 'chalk'
import { pkgRoot, esmOutput, cjsOutput } from '@no-component/build-utils'

export const compileStyle = async () => {
  const compiler = gulpSass(dartSass)

  const input = await glob('**/*.scss', {
    cwd: pkgRoot,
    absolute: true,
    onlyFiles: true,
  })

  const isNotEmptyFile = (file: any) => {
    return !(file.isNull() || file.contents.length === 0)
  }

  await Promise.all(
    input.map(path => {
      let relativePath = path
        .replace(/\//g, '\\')
        .replace(pkgRoot, '.')
        .replace(/\\[^\\]+$/, '')

      if (relativePath.includes('no-component')) {
        relativePath = ''
      }

      return src(path)
        .pipe(compiler.sync())
        .pipe(autoprefixer({ cascade: false }))
        .pipe(
          cleanCSS({}, details => {
            if (details.stats.originalSize === 0) return
            consola.log(
              `${chalk.blue(`${details.name}`)}: ${chalk.yellow(
                details.stats.originalSize / 1024
              )} KB -> ${chalk.green(details.stats.minifiedSize / 1024)} KB `
            )
          })
        )
        .pipe(gulpIf(isNotEmptyFile, dest(resolve(esmOutput, relativePath))))
        .pipe(gulpIf(isNotEmptyFile, dest(resolve(cjsOutput, relativePath))))
    })
  )
}
