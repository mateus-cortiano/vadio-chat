/* validators.ts */

type Validator = (subject: any) => boolean

class ValidationError extends Error {
  name = 'ValidationError'

  constructor(
    value: string,
    property: string,
    instance: object,
    validator: Validator
  ) {
    super(
      `${validator.name}: '${value}' is not valid for '${instance.constructor.name}.${property}'`
    )
  }
}

export function validateSetter(...validators: Validator[]) {
  return function (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const setter = descriptor.set

    descriptor.set = function (this: any, value: any) {
      for (let validator of validators) {
        if (!validator(value))
          throw new ValidationError(value, propertyKey, this, validator)
      }

      setter.call(this, value)
    }
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

export function isTCPPort(subject: number): boolean {
  return subject >= MIN_TCP_PORT && subject <= MAX_TCP_PORT
}
