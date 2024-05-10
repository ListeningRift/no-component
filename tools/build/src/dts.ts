import { dest, src } from 'gulp'
import { sync as delSync } from 'rimraf'
import { cjsOutput, esmOutput, typeOutput } from '@no-component/build-utils'
import { run } from './run'

export const generateDts = async () => {
  await run('vue-tsc -p tsconfig.dts.json')
}

export const changeDtsDir = async () => {
  await src(`${typeOutput}/packages/no-component/*.d.ts`)
    .pipe(dest(`${typeOutput}/packages`))
    .on('end', async () => {
      delSync([`${typeOutput}/packages/no-component`])
      await src(`${typeOutput}/packages/**/*.d.ts`)
        .pipe(dest(`${cjsOutput}`))
        .pipe(dest(`${esmOutput}`))
    })
}
