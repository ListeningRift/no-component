export const prefix = 'noc'

const getBEMString = (block: string, element: string, modifier: string) => {
  let cls = `${prefix}-${block}`
  if (element) {
    cls += `__${element}`
  }
  if (modifier) {
    cls += `--${modifier}`
  }
  return cls
}

export const getNamespace = (block: string) => {
  const b = () => getBEMString(block, '', '')
  const e = (element?: string) =>
    element ? getBEMString(block, element, '') : ''
  const m = (modifier?: string) =>
    modifier ? getBEMString(block, '', modifier) : ''
  const em = (element?: string, modifier?: string) =>
    element && modifier ? getBEMString(block, element, modifier) : ''

  return {
    b,
    e,
    m,
    em,
  }
}
