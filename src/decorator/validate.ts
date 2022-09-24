import {
  toValidate,
  toEachValidate,
  toValidateRequired,
  getReflectOwnMetadata,
  toCustomValidate,
} from '../method';
import {
  Class,
  RequiredKey,
  ValidatedKey,
  EachValidatedKey,
  ValidateMetaData,
  CustomValidatedKey,
  ArgumentValidateOptions,
} from '../common';

/**
 * Specify a method parameter that must be passed in, or throw an exception.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @param message The error message. (default: `missing required argument !`)
 *
 * @publicApi
 */
export function Required(message?: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(RequiredKey, target, property);
    const metadata: ValidateMetaData = { index, message };

    data.push(metadata);

    Reflect.defineMetadata(RequiredKey, data, target, property);
  };
}
/**
 * Specify a method parameter for the method that needs to be executed in the validator.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `AssembleValidator` !
 *
 * @publicApi
 */
export function Validated(target: any, property: any, index: number) {
  const data = getReflectOwnMetadata(ValidatedKey, target, property);
  const metadata: ValidateMetaData = { index };

  data.push(metadata);
  Reflect.defineMetadata(ValidatedKey, data, target, property);
}
/**
 * Specify a method parameter that needs to be executed in the validator, and this parameter needs to be looped through.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `AssembleValidator` !
 *
 * @param type The classes that need to be validated.
 *
 * @publicApi
 */
export function EachValidated(type: Class) {
  return function (target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(EachValidatedKey, target, property);
    const metadata: ValidateMetaData = { index, type };

    data.push(metadata);

    Reflect.defineMetadata(EachValidatedKey, data, target, property);
  };
}
/**
 * Validate parameters using custom validators.
 *
 * @tips
 * - This is a parameter Decorator.
 * - Must be used in conjunction with the method decorator: `ArgumentValidator` !
 *
 * @param validator The validation function.
 * @param message The error message.
 *
 * @publicApi
 */
export function CustomValidated(validator: (...args: any[]) => boolean, message: string) {
  return function(target: any, property: any, index: number) {
    const data = getReflectOwnMetadata(CustomValidatedKey, target, property);
    const metadata: ValidateMetaData = { index, message, validator };

    data.push(metadata);

    Reflect.defineMetadata(CustomValidatedKey, data, target, property);
  };
}
/**
 * Method validator, needs to be used in combination with other parameter decorators.
 *
 * @param error The error class
 *
 * @publicApi
 */
export function ArgumentValidator(error: Class<Error> = Error) {
  return function(target: any, property: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
    const method = descriptor.value;

    descriptor.value = function(...args: any[]) {
      toCustomValidate(args, target, property, error);
      toValidateRequired(args, target, property, error);

      const result = method.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
/**
 * Method validator, needs to be used in combination with other parameter decorators.
 *
 * @param options The argument validator options.
 *
 * @publicApi
 */
export function AssembleValidator(options?: ArgumentValidateOptions) {
  return function(target: any, property: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) {
    const method = descriptor.value;
    const error = options?.error || Error;

    descriptor.value = async function(...args: any[]) {
      await toValidate(args, target, property, error, options);
      await toEachValidate(args, target, property, error, options);

      const result = await method.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
