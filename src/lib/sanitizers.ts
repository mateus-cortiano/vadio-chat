/*sanitizer.ts*/

export type Sanitizer<T> = (subject: T) => T

export function sanitizeString(
  subject: string,
  ...sanitizers: Sanitizer<string>[]
): string {
  for (let sanitizer of sanitizers) subject = sanitizer(subject)
  return subject
}

/* Sanitizers */

export function trimString(subject: string) {
  return subject.trim()
}

export function maxLength(length: number): Sanitizer<string> {
  return function (subject: string) {
    return subject.substring(0, length)
  }
}
