export const isArray = Array.isArray

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

export const isDate = (value: unknown): value is Date => value instanceof Date

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function'

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'

export const isObject = (value: unknown): value is Record<any, any> =>
  value !== null && typeof value === 'object'

export const isPromise = <T = any>(val: unknown): val is Promise<T> =>
  isObject(val) && isFunction(val.then) && isFunction(val.catch)

export const isString = (value: unknown): value is string =>
  typeof value === 'string'

export const isSymbol = (value: unknown): value is symbol =>
  typeof value === 'symbol'

export const keysOf = <T extends object>(arr: T) =>
  Object.keys(arr) as Array<keyof T>

export type Fn = (...args: any[]) => any
