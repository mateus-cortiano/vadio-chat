/* timestamp.ts */

export const defaultOpts: Intl.DateTimeFormatOptions = {
  timeStyle: 'medium',
  hour12: false
}

export const shortTimeOpts: Intl.DateTimeFormatOptions = {
  timeStyle: 'short',
  hour12: false
}

export function getNowTimeString(opts = defaultOpts): string {
  return new Date(Date.now()).toLocaleTimeString(undefined, opts)
}

export function getLocaleTimeString(
  timestamp: string | number | Date,
  opts = defaultOpts
): string {
  return new Date(timestamp).toLocaleTimeString(undefined, opts)
}
