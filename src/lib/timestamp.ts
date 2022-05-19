/* timestamp.ts */

const defaultOpts: Intl.DateTimeFormatOptions = {
  timeStyle: 'medium',
  hour12: false
}

export function getTimeStamp(opts = defaultOpts): string {
  return new Date(Date.now()).toLocaleTimeString(undefined, opts)
}
