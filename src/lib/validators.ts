/* validators.ts */

export type Validator = (subject: any) => boolean

export function assert(value: any, ...validators: Validator[]) {
  for (let validator of validators)
    if (!validator(value)) throw new ValidationError(value, validator)
}

export function isValid(value: any, ...validators: Validator[]) {
  for (let validator of validators) if (!validator(value)) return false
  return true
}

export function assertSetter(...validators: Validator[]) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const setter = descriptor.set

    descriptor.set = function (this: any, value: any) {
      assert(value, ...validators)
      setter.call(this, value)
    }
  }
}

class ValidationError extends Error {
  name = 'ValidationError'

  constructor(
    value: string,
    validator: Validator,
    property?: string,
    instance?: object
  ) {
    super(
      `${validator.name}: '${value}' is not valid for '${instance.constructor.name}.${property}'`
    )
  }
}

/* IP Address Validators */

const IPV4Regex = new RegExp(
  '^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9]).){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$'
)

const IPV6Regex = new RegExp(
  '(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))'
)

export function isIPV4Address(subject: string): boolean {
  return IPV4Regex.test(subject)
}

export function isIPV6Address(subject: string): boolean {
  return IPV6Regex.test(subject)
}

export function isIPAddress(subject: string): boolean {
  return isIPV4Address(subject) || isIPV6Address(subject)
}

/* TCP Port Validators */

const MIN_TCP_PORT = 0
const MAX_TCP_PORT = 65535

export function isTCPPort(subject: any): boolean {
  return (
    typeof subject === 'number' &&
    subject >= MIN_TCP_PORT &&
    subject <= MAX_TCP_PORT
  )
}

/* Input Validators */

export function notEmpty(subject: any): boolean {
  return subject !== ''
}

export function notEquals(thisname: string): Validator {
  return function (subject: any) {
    return subject !== thisname
  }
}

export function notWhiteSpace(subject: string): boolean {
  return !(subject.trim() === '')
}
