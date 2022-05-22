/* validators.ts */

export type Validator = (subject: any) => boolean

export interface Validator2 {
  errorMessage: string
  validate(subject: any): boolean
}

export class ValidationResult {
  passed: boolean
  err?: string
}

export function validate(
  subject: any,
  ...validators: Validator2[]
): ValidationResult {
  for (let validator of validators) {
    if (!validator.validate(subject))
      return { passed: false, err: validator.errorMessage }
  }
  return { passed: true }
}

export function is_valid(value: any, ...validators: Validator[]) {
  for (let validator of validators) if (!validator(value)) return false
  return true
}

/* Input Validators */

export const notEmptyString2 = {
  errorMessage: 'String is empty',
  validate: function (subject: any) {
    return subject !== ''
  }
}

export function not_empty_str(subject: any): boolean {
  return subject !== ''
}

export function notEquals2(thisname: string) {
  return {
    errorMessage: `String can't be equal to ${thisname}`,
    validate: function (subject: any) {
      return subject !== thisname
    }
  }
}

export function not_equals(thisname: string): Validator {
  return function (subject: any) {
    return subject !== thisname
  }
}

export const notWhiteSpace2 = {
  errorMessage: `String is whitespace`,
  validate: function (subject: any) {
    return subject.trim() !== ''
  }
}

export function not_whitespace(subject: string): boolean {
  return !(subject === null) && !(subject.trim() === '')
}

export const notNull2 = {
  errorMessage: `String is null`,
  validate: function (subject: any) {
    return subject !== null
  }
}

export function not_null(subject: string): boolean {
  return subject !== null
}

export function matchRegex2(pattern: string | RegExp): Validator2 {
  let regex = new RegExp(pattern)
  return {
    errorMessage: `String didn't match regex pattern ${pattern}`,
    validate: function (subject: any) {
      return regex.test(subject)
    }
  }
}

export function match_regex(pattern: string | RegExp): Validator {
  let regex = new RegExp(pattern)
  return function (subject: any) {
    return regex.test(subject)
  }
}
