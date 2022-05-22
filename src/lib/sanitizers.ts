/*sanitizer.ts*/

export type Sanitizer<T> = (subject: T) => T

export function sanitize_str(
  subject: string,
  ...sanitizers: Sanitizer<string>[]
): string {
  for (let sanitizer of sanitizers) subject = sanitizer(subject)
  return subject
}

/* Sanitizers */

export function trim_str(subject: string) {
  return subject.trim()
}

export function max_len(length: number): Sanitizer<string> {
  return function (subject: string) {
    return subject.substring(0, length)
  }
}
