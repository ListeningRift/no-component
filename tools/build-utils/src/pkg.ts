import { findWorkspacePackages } from '@pnpm/find-workspace-packages'
import { root } from './path'

export const getWorkspacePackages = () => findWorkspacePackages(root)
