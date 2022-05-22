/* validators.ts */

export type Validator = (subject: any) => boolean

export interface Validator2 {
  errorMessage: string
  validate(subject: any): boolean
}

export class ValidationResult {
  result: boolean
  passed: Validator2[] = []
  failed: Validator2[] = []
}

export function validate(subject: any, ...validators: Validator2[]) {
  let result = new ValidationResult()
  for (let validator of validators) {
    if (!validator.validate(subject)) result.failed.push(validator)
    else result.passed.push(validator)
  }
  return result
}

export function isValid(value: any, ...validators: Validator[]) {
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

export function notEmptyString(subject: any): boolean {
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

export function notEquals(thisname: string): Validator {
  return function (subject: any) {
    return subject !== thisname
  }
}

export function notWhiteSpace(subject: string): boolean {
  return !(subject === null) && !(subject.trim() === '')
}

export function notNull(subject: string): boolean {
  return subject !== null
}

export function matchRegex(pattern: string | RegExp): Validator {
  let regex = new RegExp(pattern)
  return function (subject: any) {
    return regex.test(subject)
  }
}
