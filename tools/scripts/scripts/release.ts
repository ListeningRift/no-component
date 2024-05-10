import { execSync } from 'child_process'
import { consola } from 'consola'
import { getWorkspacePackages } from '@no-component/build-utils'
import { handleError } from '../utils'
import type { Project } from '@pnpm/find-workspace-packages'

async function handleVersion(versionType: string, preReleaseVersion: string) {
  const pkgs = Object.fromEntries(
    (await getWorkspacePackages()).map(pkg => [pkg.manifest.name!, pkg])
  )

  const indexPkg = pkgs['@no-component/index']
  const rootPkg = pkgs['@no-component/root']
  const currentVersion = indexPkg.manifest.version
  const mainVersion = currentVersion
    ?.split('-')[0]
    ?.split('.')
    .map(number => Number(number))
  const curPreReleaseVersion = currentVersion?.split('-')[1]
  const curPreReleaseVersionLabel = curPreReleaseVersion?.split('.')[0]
  const curPreReleaseVersionNumber = Number(curPreReleaseVersion?.split('.')[1])
  let newVersion = ''

  const writeVersion = async (project: Project) => {
    await project.writeProjectManifest({
      ...project.manifest,
      version: newVersion,
    } as any)
  }

  consola.start('Start updating version...')

  try {
    switch (versionType) {
      case 'major':
        newVersion = `${mainVersion![0] + 1}.0.0`
        break
      case 'minor':
        newVersion = `${mainVersion![0]}.${mainVersion![1] + 1}.0`
        break
      case 'patch':
        newVersion = `${mainVersion![0]}.${mainVersion![1]}.${
          mainVersion![2] + 1
        }`
        break
      case 'pre-release':
        if (curPreReleaseVersionLabel === preReleaseVersion) {
          newVersion = `${mainVersion!.join(
            '.'
          )}-${curPreReleaseVersionLabel}.${curPreReleaseVersionNumber + 1}`
        } else {
          newVersion = `${mainVersion!.join('.')}-${preReleaseVersion}.1`
        }
        break
      default:
        throw new Error('Invalid version type')
    }
    consola.info(`New version: ${newVersion}`)

    await writeVersion(indexPkg)
    await writeVersion(rootPkg)
    consola.success(`Update version successfully!`)
  } catch (err: any) {
    handleError(err)
  }
  return newVersion
}

function commitRelease(version: string) {
  consola.start('Start committing...')
  try {
    execSync('git add .')
    execSync(`git commit -m release: ${version}`)
    consola.success(`Committed successfully!`)
  } catch (err: any) {
    handleError(err)
  }
}

async function tag(tag: string) {
  consola.start('Start tagging...')
  try {
    execSync(`git tag ${tag}`)
    execSync(`git push origin ${tag}`)
    execSync(`git push origin main:main`)
    consola.success(`Tagged as ${tag}`)
  } catch (e: any) {
    handleError(e)
  }
}

async function main() {
  const versionType = (await consola.prompt('Pick the version type.', {
    type: 'select',
    options: [
      {
        value: 'major',
        label: 'major',
        hint: 'Breaking changes',
      },
      {
        value: 'minor',
        label: 'minor',
        hint: 'New features',
      },
      {
        value: 'patch',
        label: 'patch',
        hint: 'Bug fixes',
      },
      {
        value: 'pre-release',
        label: 'pre-release',
        hint: 'Pre-release version',
      },
    ],
  })) as unknown as string

  let preReleaseVersion = ''
  if (versionType === 'pre-release') {
    preReleaseVersion = (await consola.prompt(
      'Pick the pre-release version type',
      {
        type: 'select',
        options: ['alpha', 'beta'],
      }
    )) as unknown as string
  }

  const newVersion = await handleVersion(versionType, preReleaseVersion)
  commitRelease(newVersion)
  await tag(newVersion)
}

main()
