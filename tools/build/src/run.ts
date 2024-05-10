import { spawn } from 'child_process'
import chalk from 'chalk'
import { consola } from 'consola'
import { root } from '@no-component/build-utils'

export const run = async (command: string) =>
  new Promise<void>((resolve, reject) => {
    const [cmd, ...args] = command.split(' ')
    consola.info(`\nrunning: ${chalk.blue(command)}\n`)
    const app = spawn(cmd, args, {
      cwd: root,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    const onProcessExit = () => app.kill('SIGHUP')

    app.on('close', code => {
      process.removeListener('exit', onProcessExit)

      if (code === 0) resolve()
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        )
    })
    process.on('exit', onProcessExit)
  })
