/* timestamp.ts */

export const default_time_opts: Intl.DateTimeFormatOptions = {
  timeStyle: 'medium',
  hour12: false
}

export const short_time_opts: Intl.DateTimeFormatOptions = {
  timeStyle: 'short',
  hour12: false
}

export function get_now_timestring(opts = default_time_opts): string {
  return new Date(Date.now()).toLocaleTimeString(undefined, opts)
}

export function get_locale_timestring(
  timestamp: string | number | Date,
  opts = default_time_opts
): string {
  return new Date(timestamp).toLocaleTimeString(undefined, opts)
}
