export function utoa(data: string): string {
  return window.btoa(encodeURIComponent(data))
}

export function atou(base64: string): string {
  return decodeURIComponent(window.atob(base64))
}
